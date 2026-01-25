import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
// import { viteCommonjs, esbuildCommonjs } from '@originjs/vite-plugin-commonjs';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  // depending on your application, base can also be "/"
  base: '.',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false,
      injectManifest: {
        injectionPoint: undefined,
      },
      workbox: {
        skipWaiting: true,
      },
    }),
    // viteCommonjs(),
    react(),
    viteTsconfigPaths(),
    visualizer({ open: false }) as PluginOption,
  ],
  resolve: {
    alias: [
      { find: 'path', replacement: 'path-browserify' }, // this!!
    ],
  },
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000
    port: 3000,
  },
  define: {
    // here is the main update
    global: 'globalThis',
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.js$/.test(name ?? '')) {
            return 'static/js/[name]-[hash][extname]';
          }

          if (/\.css$/.test(name ?? '')) {
            return 'static/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});
