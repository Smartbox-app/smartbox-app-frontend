import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { mergeConfig, type UserConfig } from 'vite';

const sharedConfig: UserConfig = {
  base: '.',
  plugins: [react(), viteTsconfigPaths()],
  resolve: {
    alias: [{ find: 'path', replacement: 'path-browserify' }],
  },
  server: {
    open: true,
    port: 3000,
  },
  define: {
    global: 'globalThis',
  },
  build: {
    emptyOutDir: true,
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
  optimizeDeps: {
    include: ['@tiptap/react', '@tiptap/starter-kit'],
  },
};

export const createViteConfig = (overrides: UserConfig = {}): UserConfig => {
  const { plugins: overridePlugins, ...rest } = overrides;

  // mergeConfig concatenates plugin arrays — only pass override plugins here.
  return mergeConfig(
    sharedConfig,
    overridePlugins ? { ...rest, plugins: overridePlugins } : rest,
  );
};
