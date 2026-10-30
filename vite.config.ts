import { defineConfig, type PluginOption } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { createViteConfig } from './vite.config.base';

export default defineConfig(async () => {
  const { visualizer } = await import('rollup-plugin-visualizer');

  return createViteConfig({
    plugins: [
      VitePWA({
        // autoUpdate forces skipWaiting and clientsClaim, which activate a new
        // worker in open tabs and drop the hashed files those tabs still need.
        registerType: 'prompt',
        manifest: false,
        injectManifest: {
          injectionPoint: undefined,
        },
        workbox: {
          skipWaiting: false,
          clientsClaim: false,
          // Never serve a stale shell after deploy — index.html must hit the network.
          navigateFallback: null,
          globIgnores: ['**/index.html'],
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkOnly',
            },
          ],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        },
      }),
      visualizer({ open: true }) as PluginOption,
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'recharts': ['recharts'],
            'react-id-swiper': ['react-id-swiper'],
            'react-moveable': ['react-moveable'],
          },
        },
      },
    },
  });
});
