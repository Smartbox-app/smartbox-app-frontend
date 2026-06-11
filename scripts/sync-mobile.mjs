#!/usr/bin/env node

/**
 * Rebuild web assets for Capacitor and copy them into existing native projects.
 * Use this after code changes when testing in Android Studio / Xcode simulator.
 * Full native setup still requires: npm run build-mobile
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import 'dotenv/config';

const PWA_ARTIFACTS = [
  'manifest.json',
  'serviceWorkerMessageHandler.js',
  'registerSW.js',
  'sw.js',
];

function run(command, env = {}) {
  console.log(`\n$ ${command}`);
  execSync(command, {
    stdio: 'inherit',
    env: { ...process.env, ...env },
  });
}

function removePath(targetPath) {
  if (!fs.existsSync(targetPath)) return;
  console.log(`Removing ${targetPath}`);
  fs.rmSync(targetPath, { recursive: true, force: true });
}

function readCapacitorEnv() {
  const configPath = './android/app/src/main/assets/capacitor.config.json';
  if (!fs.existsSync(configPath)) {
    throw new Error(
      'Android project not found. Run `npm run build-mobile` once to create native projects.',
    );
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (!config.appId || !config.appName) {
    throw new Error(
      'Invalid capacitor.config.json in android assets. Run `npm run build-mobile` again.',
    );
  }

  return {
    shellEnv: `NODE_APP_NAME="${config.appName}" NODE_APP_ID="${config.appId}"`,
  };
}

function cleanNativeWebAssets() {
  removePath('./android/app/src/main/assets/public');
  removePath('./android/app/build');
  removePath('./ios/App/App/public');
}

function assertNoPwaArtifactsInDist() {
  const distPath = './dist';
  const found = PWA_ARTIFACTS.filter((fileName) =>
    fs.existsSync(path.join(distPath, fileName)),
  );

  if (fs.existsSync(distPath)) {
    found.push(
      ...fs
        .readdirSync(distPath)
        .filter((fileName) => fileName.startsWith('workbox-')),
    );
  }

  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    const indexHtml = fs.readFileSync(indexPath, 'utf8');
    if (/rel=["']manifest["']/i.test(indexHtml)) {
      found.push('index.html (manifest link)');
    }
    if (/registerSW|vite-plugin-pwa/i.test(indexHtml)) {
      found.push('index.html (service worker registration)');
    }
  }

  if (found.length > 0) {
    throw new Error(
      `PWA artifacts found in mobile dist: ${found.join(', ')}`,
    );
  }
}

function getIndexEntryScript(indexPath) {
  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  const match = indexHtml.match(/src="\/static\/js\/(index-[^"]+\.js)"/);
  return match?.[1] ?? null;
}

function logWebBundleEntrypoint(mobileBuildId) {
  const indexPath = './dist/index.html';
  if (!fs.existsSync(indexPath)) return;

  const entryScript = getIndexEntryScript(indexPath);

  console.log(
    entryScript
      ? `\nWeb bundle entry: /static/js/${entryScript}`
      : '\nWeb bundle entry: not found in dist/index.html',
  );
  console.log(`Mobile build id: ${mobileBuildId}`);
}

function verifyAndroidAssets() {
  const indexPath = './android/app/src/main/assets/public/index.html';
  const entryScript = getIndexEntryScript(indexPath);
  const buildIdPath = './android/app/src/main/assets/public/mobile-build-id.txt';

  if (!entryScript) {
    throw new Error('android index.html does not reference an entry script');
  }

  const jsPath = path.join(
    './android/app/src/main/assets/public/static/js',
    entryScript,
  );

  if (!fs.existsSync(jsPath)) {
    throw new Error(
      `android index.html references ${entryScript}, but the file is missing`,
    );
  }

  if (!fs.existsSync(buildIdPath)) {
    throw new Error(
      'android assets are missing mobile-build-id.txt (required for native cache busting)',
    );
  }

  const buildId = fs.readFileSync(buildIdPath, 'utf8').trim();
  console.log(`Verified android asset bundle: ${entryScript}`);
  console.log(`Verified native web bundle id: ${buildId}`);
}

function cleanAndroidGradleBuild() {
  if (!fs.existsSync('./android/gradlew')) return;

  run('cd android && ./gradlew clean && cd ..');
}

const mobileBuildId = Date.now();
const viteEnv = {
  MOBILE_BUILD_ID: String(mobileBuildId),
  VITE_APP_HOSTNAME: process.env.VITE_APP_HOSTNAME || 'test',
  VITE_APP_API_URL: process.env.VITE_APP_API_URL || 'http://10.0.2.2:3001',
};

console.log('Cleaning dist...');
removePath('./dist');
removePath('./node_modules/.vite');

run(
  `npx vite build --config vite.config.mobile.ts`,
  viteEnv,
);

assertNoPwaArtifactsInDist();
logWebBundleEntrypoint(mobileBuildId);

const { shellEnv } = readCapacitorEnv();

cleanNativeWebAssets();
run(`${shellEnv} npx cap sync`);

verifyAndroidAssets();
cleanAndroidGradleBuild();

console.log(
  '\nMobile web assets synced.',
  '\nUninstall the app from the emulator once, then run from Android Studio or: npx cap run android',
);
