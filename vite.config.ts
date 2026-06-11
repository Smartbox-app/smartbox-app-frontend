import { defineConfig, type PluginOption } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { createViteConfig } from './vite.config.base';

export default defineConfig(async () => {
  const { visualizer } = await import('rollup-plugin-visualizer');

  return createViteConfig({
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        manifest: false,
        injectManifest: {
          injectionPoint: undefined,
        },
        workbox: {
          skipWaiting: true,
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        },
      }),
      visualizer({ open: true }) as PluginOption,
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            pdfjs: ['pdfjs-dist'],
            'recharts': ['recharts'],
            'react-id-swiper': ['react-id-swiper'],
            'react-moveable': ['react-moveable'],
          },
        },
      },
    },
  });
});
