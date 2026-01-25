#!/usr/bin/env node

/**
 * build-mobile-app.mjs
 *
 * Capacitor build script with:
 * - ESM support
 * - Interactive (Inquirer) OR non-interactive (--app) mode
 * - CI-safe behavior
 */

import fs from 'fs';
import path from 'path';
import util from 'util';
import inquirer from 'inquirer';
import minimist from 'minimist';
import { execSync } from 'child_process';
import { readFile, writeFile } from 'fs/promises';

// -----------------------------------------------------------------------------
// Setup
// -----------------------------------------------------------------------------

const copyFile = util.promisify(fs.copyFile);

const args = minimist(process.argv.slice(2), {
  string: ['mode', 'app'],
});

const mode = args.mode || 'local';
const assetsFolder = './app-assets';

// -----------------------------------------------------------------------------
// App mappings
// -----------------------------------------------------------------------------

const folderToAppName = {
  aplikacja: 'Smartbox Storage',
};

const folderToAppIdentifier = {
  aplikacja: 'com.smartbox.aplikacja.app',
};

const folderToHostName = {
  prod: { aplikacja: 'aplikacja' },
  local: { aplikacja: 'test' },
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function run(command, options = {}) {
  console.log(`\n$ ${command}`);
  execSync(command, { stdio: 'inherit', ...options });
}

async function copyFiles(srcDir, destDir, files) {
  await Promise.all(
    files.map((file) =>
      copyFile(path.join(srcDir, file), path.join(destDir, file)),
    ),
  );
}

async function deleteNativeFolders() {
  for (const dir of ['./android', './ios']) {
    if (fs.existsSync(dir)) {
      console.log(`Removing ${dir}`);
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
}

// -----------------------------------------------------------------------------
// Platform config
// -----------------------------------------------------------------------------

async function copyInfoPlist(folderName) {
  const appName = folderToAppName[folderName] || folderName;
  const appId = folderToAppIdentifier[folderName] || folderName;
  const hostName = folderToHostName[mode]?.[folderName] || folderName;
  const template = await readFile('./app-config/ios/Info.plist', 'utf8');
  const content = template
    .replace('{IOS_APP_NAME}', appName)
    .replace('{IOS_APP_BUNDLE_ID}', appId)
    .replace('{IOS_APP_DEEP_LINK_SCHEMA}', `smartbox-${hostName}`);
  console.log('WRITING INFO.list');
  await writeFile('./ios/App/App/Info.plist', content);
}

async function copyAndroidManifest(folderName) {
  const appId = folderToAppIdentifier[folderName] || folderName;
  const hostName = folderToHostName[mode]?.[folderName] || folderName;
  const template = await readFile(
    './app-config/android/AndroidManifest.xml',
    'utf8',
  );
  const content = template
    .replace('{ANDROID_APP_ID}', appId)
    .replace('{ANDROID_APP_DEEP_LINK_SCHEMA}', `smartbox-${hostName}`);
  await writeFile('./android/app/src/main/AndroidManifest.xml', content);
}

async function addConfigFiles(folderName) {
  await copyFiles('./app-config/ios', './ios/App/App', ['AppDelegate.swift']);
  await copyFiles('./app-config/ios', './ios/App', ['Podfile']);

  // await copyFiles(`./app-config/ios/${folderName}`, './ios/App/App', [
  //   'GoogleService-Info.plist',
  // ]);

  await copyInfoPlist(folderName);
  await copyAndroidManifest(folderName);
}

async function addSecurityConfigFile() {
  await copyFiles('./app-config/android', './android/app/src/main/res/xml', [
    'network_security_config.xml',
  ]);
}

// -----------------------------------------------------------------------------
// Capacitor init
// -----------------------------------------------------------------------------

function initAndroid(folderName) {
  const appName = folderToAppName[folderName] || folderName;
  const appId = folderToAppIdentifier[folderName] || folderName;

  run(`NODE_APP_NAME="${appName}" NODE_APP_ID="${appId}" npx cap add android`);
}

function initIos(folderName) {
  const appName = folderToAppName[folderName] || folderName;
  const appId = folderToAppIdentifier[folderName] || folderName;

  run(`NODE_APP_NAME="${appName}" NODE_APP_ID="${appId}" npx cap add ios `);
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  if (!fs.existsSync(assetsFolder)) {
    throw new Error(`Assets folder not found: ${assetsFolder}`);
  }

  const appList = fs
    .readdirSync(assetsFolder)
    .filter((name) => !['config', '.DS_Store'].includes(name));

  if (appList.length === 0) {
    throw new Error('No apps found in app-assets');
  }

  // --------------------------------------------------
  // App selection (CLI or interactive)
  // --------------------------------------------------

  let app = args.app;

  if (!app) {
    if (!process.stdin.isTTY) {
      throw new Error(
        'No TTY available. Use --app=<folderName> when running non-interactively.',
      );
    }

    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'app',
        message:
          'Wybierz aplikację która ma zostać zbudowana (nazwa folderu = nazwa apki)',
        choices: appList,
      },
    ]);

    app = answer.app;
  }

  if (!appList.includes(app)) {
    throw new Error(`App '${app}' not found in ${assetsFolder}`);
  }

  // --------------------------------------------------
  // Build
  // --------------------------------------------------

  const hostName = folderToHostName[mode]?.[app] || app;
  const hostSuffix = mode === 'prod' ? '.smartbox-app.pl' : '@TODO';
  const fullAddress = `${hostName}${hostSuffix}`;

  run(
    `VITE_APP_HOSTNAME="${fullAddress}" VITE_APP_API_URL=${mode === 'prod' ? 'https://api.smartbox-app.pl' : 'http://10.0.2.2:3001'} npx vite build`,
  );

  // --------------------------------------------------
  // Native setup
  // --------------------------------------------------

  await deleteNativeFolders();

  initAndroid(app);
  initIos(app);

  await addConfigFiles(app);
  await addSecurityConfigFile();

  // iOS dependencies
  run('cd ./ios/App && pod install && cd ../../');

  // Assets
  run(`npx @capacitor/assets generate --assetPath "./app-assets/${app}"`);

  console.log('\nIMPORTANT:');
  console.log('- Add app capabilities in Xcode');
  console.log('- Push Notifications');
  console.log('- Background Modes → Remote notifications');
  console.log('- Verify GoogleService-Info.plist in Xcode');
}

// -----------------------------------------------------------------------------
// Bootstrap
// -----------------------------------------------------------------------------

main().catch((err) => {
  console.error('\nBuild failed');
  console.error(err.message || err);
  process.exit(1);
});
