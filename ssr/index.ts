import express, { NextFunction, Request, Response } from 'express';
import { escape } from 'html-escaper';
import fetch, { Response as FetchResponse } from 'node-fetch';
import path from 'path';
import { readFile } from 'fs/promises';
import { config } from './config';
import {
  hostFromRequest,
  tenantFromHost,
  withHostParam,
} from './tenant-from-host';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', true);

const fePath = path.resolve(config.feFilesPath);
const META_TIMEOUT_MS = 2000;
const ASSET_TIMEOUT_MS = 3000;

/** Paths that used to be proxied to BE by Apache (.htaccess); must not hit static defaults. */
const TENANT_ASSET_PATHS = new Set([
  '/manifest.json',
  '/favicon.ico',
  '/favicon.png',
  '/assets/apple-touch-icon.png',
  '/assets/favicon-32x32.png',
  '/assets/favicon-16x16.png',
  '/assets/safari-pinned-tab.svg',
  '/assets/android-chrome-192x192.png',
  '/assets/android-chrome-512x512.png',
]);

const NO_CACHE = 'no-cache, no-store, must-revalidate';
const IMMUTABLE = 'public, max-age=31536000, immutable';

const setHtmlCacheHeaders = (res: Response) => {
  res.setHeader('Cache-Control', NO_CACHE);
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
};

const isHashedAsset = (relPath: string) =>
  relPath.startsWith(`static${path.sep}`) ||
  relPath.startsWith('static/') ||
  /-[a-zA-Z0-9_-]{8,}\.[a-z0-9]+$/i.test(relPath);

const isEntryOrServiceWorker = (relPath: string) => {
  const base = path.basename(relPath);
  return (
    base === 'index.html' ||
    base === 'manifest.json' ||
    base === 'sw.js' ||
    base === 'service-worker.js' ||
    base.startsWith('workbox-') ||
    base.endsWith('.webmanifest')
  );
};

async function loadMetas(apiUrl: string): Promise<Record<string, string>> {
  const ans = await fetch(apiUrl, { timeout: META_TIMEOUT_MS });
  if (!ans.ok) throw new Error(`meta ${ans.status}`);
  const data = (await ans.json()) as { payload?: Record<string, string> };
  return data.payload ?? {};
}

async function handleIndex(originalUrl: string, hostname: string, res: Response) {
  setHtmlCacheHeaders(res);

  const html = await readFile(path.join(fePath, 'index.html'), 'utf8');
  let metas: Record<string, string> = { ...config.defaults };

  const incomingHost = hostFromRequest(originalUrl, hostname);
  const identifier = tenantFromHost(incomingHost, config.rootDomain);
  const finalUrl = withHostParam(originalUrl, identifier);
  const apiUrl = `${config.apiUrl}${finalUrl}`;

  try {
    metas = { ...metas, ...(await loadMetas(apiUrl)) };
    console.log(
      `[ssr] ok host=${incomingHost} tenant=${identifier || '(apex)'} title=${metas.title ?? ''}`,
    );
  } catch (err) {
    console.warn(`[ssr] meta fail host=${incomingHost} url=${apiUrl}`, err);
  }

  const re = new RegExp(`\\\${(${Object.keys(metas).join('|')})}`, 'gi');
  res.send(html.replace(re, (m) => escape(metas[m.slice(2, -1)] ?? '')));
}

// Express 4 does not catch async rejections → no response → Apache 502
const sendIndex = (req: Request, res: Response) => {
  handleIndex(req.originalUrl, req.hostname, res).catch((err) => {
    console.error('[ssr] handleIndex', err);
    if (!res.headersSent) {
      res.status(500).type('text').send('SSR error');
    }
  });
};

const isManifestPath = (p: string) => p === '/manifest.json';
const isIconPath = (p: string) => TENANT_ASSET_PATHS.has(p) && !isManifestPath(p);

const beAssetUrl = (identifier: string, assetPath: string) =>
  `${config.assetsUrl}?host=${encodeURIComponent(identifier)}` +
  `&url=${encodeURIComponent(assetPath)}`;

/** Resolve tenant icon on the public CDN (BE /tenant/assets pipe is broken in prod). */
async function resolvePublicIconUrl(
  identifier: string,
): Promise<string | null> {
  const ans = await fetch(`${config.tenantApiBase}/${encodeURIComponent(identifier)}`, {
    timeout: ASSET_TIMEOUT_MS,
  });
  if (!ans.ok) return null;
  const data = (await ans.json()) as {
    payload?: { icon?: string; publicAssetsBaseUrl?: string };
  };
  const icon = data.payload?.icon;
  const base = data.payload?.publicAssetsBaseUrl?.replace(/\/$/, '');
  if (!icon || !base) return null;
  return `${base}/icon/${icon}`;
}

const sendUpstream = async (
  ans: FetchResponse,
  req: Request,
  res: Response,
) => {
  // Follow one redirect (BE may 302 to GCS after fix)
  if ([301, 302, 307, 308].includes(ans.status)) {
    const location = ans.headers.get('location');
    if (location) {
      res.setHeader('Cache-Control', NO_CACHE);
      res.redirect(302, location);
      return;
    }
  }

  if (!ans.ok) {
    throw new Error(`upstream ${ans.status}`);
  }

  const contentType = ans.headers.get('content-type');
  if (contentType) res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', NO_CACHE);
  res.setHeader('Pragma', 'no-cache');

  if (req.method === 'HEAD') {
    res.status(200).end();
    return;
  }

  res.status(200).send(await ans.buffer());
};

/** Proxy tenant icons/manifest to BE (replaces Apache .htaccess under Docker/NPM). */
const proxyTenantAsset = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  if (!TENANT_ASSET_PATHS.has(req.path)) return next();

  const incomingHost = hostFromRequest(req.originalUrl, req.hostname);
  const identifier = tenantFromHost(incomingHost, config.rootDomain);
  // Apex / unknown host → fall through to packaged defaults
  if (!identifier) return next();

  (async () => {
    // 1) Manifest — always from BE (JSON is expected)
    if (isManifestPath(req.path)) {
      const ans = await fetch(beAssetUrl(identifier, req.path), {
        timeout: ASSET_TIMEOUT_MS,
        redirect: 'manual',
      });
      if (!ans.ok) {
        console.warn(
          `[ssr] manifest miss host=${incomingHost} tenant=${identifier} status=${ans.status}`,
        );
        return next();
      }
      await sendUpstream(ans, req, res);
      return;
    }

    // 2) Icons — try BE (may redirect to CDN); if that fails, resolve CDN ourselves
    if (isIconPath(req.path)) {
      try {
        const ans = await fetch(beAssetUrl(identifier, req.path), {
          timeout: ASSET_TIMEOUT_MS,
          redirect: 'manual',
        });
        const contentType = ans.headers.get('content-type') || '';
        const looksLikeImage =
          ans.ok && !contentType.includes('application/json');
        const isRedirect = [301, 302, 307, 308].includes(ans.status);

        if (looksLikeImage || isRedirect) {
          await sendUpstream(ans, req, res);
          return;
        }
      } catch (err) {
        console.warn(
          `[ssr] asset be fail host=${incomingHost} tenant=${identifier} path=${req.path}`,
          err,
        );
      }

      const publicUrl = await resolvePublicIconUrl(identifier);
      if (publicUrl) {
        console.log(
          `[ssr] icon cdn host=${incomingHost} tenant=${identifier} path=${req.path}`,
        );
        res.setHeader('Cache-Control', NO_CACHE);
        res.redirect(302, publicUrl);
        return;
      }

      console.warn(
        `[ssr] icon miss host=${incomingHost} tenant=${identifier} path=${req.path}`,
      );
      // No tenant icon → packaged default is fine
      return next();
    }

    next();
  })().catch((err) => {
    console.warn(
      `[ssr] asset fail host=${incomingHost} tenant=${identifier} path=${req.path}`,
      err,
    );
    if (!res.headersSent) next();
  });
};

// No meta fetch — used by Docker healthcheck
app.get('/healthz', (_req, res) => {
  res.status(200).type('text').send('ok');
});

app.get(['/', '/index.html'], sendIndex);

// Before express.static so packaged favicon/manifest do not win for tenants
app.use(proxyTenantAsset);

app.use(
  express.static(fePath, {
    index: false,
    setHeaders(res, filePath) {
      const relPath = path.relative(fePath, filePath);

      if (isEntryOrServiceWorker(relPath)) {
        res.setHeader('Cache-Control', NO_CACHE);
        res.setHeader('Pragma', 'no-cache');
      } else if (isHashedAsset(relPath)) {
        res.setHeader('Cache-Control', IMMUTABLE);
      } else {
        res.setHeader('Cache-Control', 'no-cache');
      }

      if (config.enableXSendfile) {
        res.setHeader('X-Sendfile', filePath);
      }
    },
  }),
);

app.all('*', sendIndex);

app.listen(config.fePort, '0.0.0.0', () => {
  console.log(`SSR for ${fePath} listening on 0.0.0.0:${config.fePort}`);
  console.log(
    `SSR SSR_API_URL=${config.apiUrl} SSR_ASSETS_URL=${config.assetsUrl} ROOT_DOMAIN=${config.rootDomain}`,
  );
});
