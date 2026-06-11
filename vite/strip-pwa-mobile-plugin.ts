import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

const PWA_ROOT_FILES = [
  'manifest.json',
  'serviceWorkerMessageHandler.js',
  'registerSW.js',
  'sw.js',
];

const stripPwaFromHtml = (html: string) =>
  html
    .replace(/<link[^>]*rel=["']manifest["'][^>]*>\s*/gi, '')
    .replace(/<script[^>]*vite-plugin-pwa[^>]*><\/script>\s*/gi, '')
    .replace(/<script[^>]*registerSW[^>]*><\/script>\s*/gi, '');

export const stripPwaForMobile = (): Plugin => {
  let outDir = 'dist';

  return {
    name: 'strip-pwa-for-mobile',
    configResolved(config) {
      outDir = config.build.outDir;
    },
    transformIndexHtml(html) {
      return stripPwaFromHtml(html);
    },
    closeBundle() {
      const distPath = path.resolve(outDir);

      for (const fileName of PWA_ROOT_FILES) {
        const filePath = path.join(distPath, fileName);
        if (fs.existsSync(filePath)) {
          fs.rmSync(filePath, { force: true });
        }
      }

      if (!fs.existsSync(distPath)) return;

      for (const fileName of fs.readdirSync(distPath)) {
        if (fileName.startsWith('workbox-') && fileName.endsWith('.js')) {
          fs.rmSync(path.join(distPath, fileName), { force: true });
        }
      }

      const indexPath = path.join(distPath, 'index.html');
      if (!fs.existsSync(indexPath)) return;

      const html = stripPwaFromHtml(fs.readFileSync(indexPath, 'utf8'));
      fs.writeFileSync(indexPath, html);
    },
  };
};
