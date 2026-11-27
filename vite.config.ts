import { defineConfig, type PluginOption } from 'vite';
import { createViteConfig } from './vite.config.base';

export default defineConfig(async () => {
  const { visualizer } = await import('rollup-plugin-visualizer');

  return createViteConfig({
    // '/' so chunk preloads stay /static/js/... . base "." produced .static/js/... and every lazy import failed.
    base: '/',
    plugins: [visualizer({ open: true }) as PluginOption],
    build: {
      rollupOptions: {
        output: {
          // Object-form manualChunks also absorbs dependencies, which put React
          // inside the recharts chunk and cycled that chunk with the entry.
          onlyExplicitManualChunks: true,
          manualChunks(id) {
            // Shared CJS interop lives here so library chunks don't import it back from the entry.
            if (id.includes('commonjsHelpers')) return 'react';
            if (!id.includes('node_modules')) return;

            if (matches(id, RECHARTS_PKGS)) return 'recharts';
            if (matches(id, REACT_PKGS)) return 'react';
            if (matches(id, SWIPER_PKGS)) return 'react-id-swiper';
            if (matches(id, MOVEABLE_PKGS)) return 'react-moveable';
          },
        },
      },
    },
  });
});

const matches = (id: string, pkgs: string[]) =>
  pkgs.some((pkg) => id.includes(`/node_modules/${pkg}/`));

// Checked before REACT_PKGS so nested copies stay with the library that owns them.
const RECHARTS_PKGS = [
  'recharts',
  '@reduxjs/toolkit',
  'victory-vendor',
  'decimal.js-light',
  'es-toolkit',
  'eventemitter3',
  'clsx',
  'tiny-invariant',
  'reselect',
  'immer',
  'd3-array',
  'd3-color',
  'd3-ease',
  'd3-format',
  'd3-interpolate',
  'd3-scale',
  'd3-shape',
  'd3-time',
  'd3-time-format',
  'd3-path',
  'd3-timer',
  'internmap',
];

const REACT_PKGS = [
  'react',
  'react-dom',
  'scheduler',
  'react-is',
  'redux',
  'react-redux',
  'use-sync-external-store',
  '@babel/runtime',
  'hoist-non-react-statics',
  'prop-types',
  'loose-envify',
  'object-assign',
];

const SWIPER_PKGS = ['react-id-swiper', 'swiper', 'dom7', 'ssr-window'];

const MOVEABLE_PKGS = [
  'react-moveable',
  'moveable',
  '@daybrush/utils',
  '@egjs/agent',
  '@egjs/children-differ',
  '@egjs/list-differ',
  '@scena/dragscroll',
  '@scena/event-emitter',
  '@scena/matrix',
  'css-to-mat',
  'framework-utils',
  'gesto',
  'overlap-area',
  'css-styled',
  'react-css-styled',
  'react-selecto',
];
