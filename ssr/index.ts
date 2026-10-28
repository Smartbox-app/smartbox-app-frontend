import express, { Response } from 'express';
import { escape } from 'html-escaper';
import fetch from 'node-fetch';
import path from 'path';
import { readFile } from 'fs/promises';
import { config } from './config';

const app = express();
app.disable('x-powered-by');

const fePath = path.resolve(config.feFilesPath);

async function handleIndex(originalUrl: string, hostname: string, res: Response) {
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
    setHeaders: config.enableXSendfile
      ? (res, filePath) => {
          res.setHeader('X-Sendfile', filePath);
        }
      : undefined,
  }),
);

app.all('*', (req, res) => handleIndex(req.originalUrl, req.hostname, res));

app.listen(config.fePort, '0.0.0.0', () => {
  console.log(`SSR for ${fePath} listening on 0.0.0.0:${config.fePort}`);
});
