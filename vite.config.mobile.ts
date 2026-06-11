import fs from 'fs';
import path from 'path';
import { defineConfig, type Plugin, type PluginOption } from 'vite';
import { createViteConfig } from './vite.config.base';
import { stripPwaForMobile } from './vite/strip-pwa-mobile-plugin';

const emitMobileBuildIdFile = (mobileBuildId: string): Plugin => {
  let outDir = 'dist';

  return {
    name: 'emit-mobile-build-id-file',
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      fs.writeFileSync(
        path.join(path.resolve(outDir), 'mobile-build-id.txt'),
        `${mobileBuildId}\n`,
      );
    },
  };
};

export default defineConfig(async () => {
  const { visualizer } = await import('rollup-plugin-visualizer');
  const mobileBuildId =
    process.env.MOBILE_BUILD_ID ?? `${Date.now()}`;

  return createViteConfig({
    define: {
      'import.meta.env.VITE_MOBILE_BUILD_ID': JSON.stringify(mobileBuildId),
    },
    plugins: [
      stripPwaForMobile(),
      emitMobileBuildIdFile(mobileBuildId),
      visualizer({ open: false }) as PluginOption,
    ],
  });
});
