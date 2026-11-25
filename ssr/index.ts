import express, { NextFunction, Request, Response } from 'express';
import { escape } from 'html-escaper';
import fetch from 'node-fetch';
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

const beAssetUrl = (identifier: string, assetPath: string) =>
  `${config.assetsUrl}?host=${encodeURIComponent(identifier)}` +
  `&url=${encodeURIComponent(assetPath)}`;

/** Paths to ask BE for; favicon.* falls back to a PNG path BE has always supported. */
const assetPathsToTry = (requestPath: string): string[] => {
  if (requestPath === '/favicon.ico' || requestPath === '/favicon.png') {
    return [requestPath, '/assets/favicon-32x32.png'];
  }
  return [requestPath];
};

const fetchTenantAsset = async (identifier: string, assetPath: string) => {
  const ans = await fetch(beAssetUrl(identifier, assetPath), {
    timeout: ASSET_TIMEOUT_MS,
  });
  if (!ans.ok) return null;
  // BE may 404 as JSON {}; never treat that as an icon body
  const contentType = ans.headers.get('content-type') || '';
  if (contentType.includes('application/json')) return null;
  return ans;
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
    let ans = null;
    let usedPath = req.path;

    for (const assetPath of assetPathsToTry(req.path)) {
      ans = await fetchTenantAsset(identifier, assetPath);
      if (ans) {
        usedPath = assetPath;
        break;
      }
    }

    if (!ans) {
      console.warn(
        `[ssr] asset miss host=${incomingHost} tenant=${identifier} path=${req.path}`,
      );
      // Do NOT fall through to packaged favicon — that is why every subdomain looked identical
      res.status(404).end();
      return;
    }

    const contentType = ans.headers.get('content-type');
    if (contentType) res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', NO_CACHE);
    res.setHeader('Pragma', 'no-cache');

    if (req.method === 'HEAD') {
      res.status(200).end();
      return;
    }

    const buffer = await ans.buffer();
    if (usedPath !== req.path) {
      console.log(
        `[ssr] asset fallback host=${incomingHost} tenant=${identifier} ${req.path} → ${usedPath}`,
      );
    }
    res.status(200).send(buffer);
  })().catch((err) => {
    console.warn(
      `[ssr] asset fail host=${incomingHost} tenant=${identifier} path=${req.path}`,
      err,
    );
    if (!res.headersSent) res.status(404).end();
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
