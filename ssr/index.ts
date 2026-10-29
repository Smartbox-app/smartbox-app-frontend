import express, { Response } from 'express';
import { escape } from 'html-escaper';
import fetch from 'node-fetch';
import path from 'path';
import { readFile } from 'fs/promises';
import { config } from './config';

const app = express();
app.disable('x-powered-by');

const fePath = path.resolve(config.feFilesPath);

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

async function handleIndex(originalUrl: string, hostname: string, res: Response) {
  setHtmlCacheHeaders(res);

  const html = await readFile(path.join(fePath, 'index.html'), 'utf8');
  let metas: Record<string, string> = { ...config.defaults };

  const identifier = hostname.split('.')[0];
  const finalUrl = originalUrl.includes('?host')
    ? originalUrl
    : `${originalUrl}${originalUrl.includes('?') ? '&' : '?'}host=${identifier}`;

  try {
    const ans = await fetch(`${config.apiUrl}${finalUrl}`);
    const data = (await ans.json()) as { payload: Record<string, string> };
    metas = { ...metas, ...data.payload };
  } catch {
    // fall back to defaults
  }

  const re = new RegExp(`\\\${(${Object.keys(metas).join('|')})}`, 'gi');
  res.send(html.replace(re, (m) => escape(metas[m.slice(2, -1)] ?? '')));
}

app.get(['/', '/index.html'], (req, res) =>
  handleIndex(req.originalUrl, req.hostname, res),
);

app.use(
  express.static(fePath, {
    // index.html is always served by handleIndex with no-cache headers
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

app.all('*', (req, res) => handleIndex(req.originalUrl, req.hostname, res));

app.listen(config.fePort, '0.0.0.0', () => {
  console.log(`SSR for ${fePath} listening on 0.0.0.0:${config.fePort}`);
});
