import express, { Request, Response } from 'express';
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

// No meta fetch — used by Docker healthcheck
app.get('/healthz', (_req, res) => {
  res.status(200).type('text').send('ok');
});

app.get(['/', '/index.html'], sendIndex);

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
  console.log(`SSR SSR_API_URL=${config.apiUrl} ROOT_DOMAIN=${config.rootDomain}`);
});
