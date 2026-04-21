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
import 'dotenv/config';
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
  wlasnybox: 'Własny Box Self Storage',
  superbox: 'Superbox',
  rentbox: 'Rentbox'
};

const folderToAppIdentifier = {
  ios: {
    aplikacja: 'com.smartbox.aplikacja.app',
    wlasnybox: 'com.smartbox.wlasnybox.app',
    superbox: 'com.smartbox.superbox.app',
    rentbox: 'com.smartbox.rentbox.app'
  },
  android: {
    aplikacja: 'com.smartbox.aplikacja.app',
    wlasnybox: 'com.smartbox.wlasnybox.app',
    superbox: 'com.smartbox.superbox.app',
    rentbox: 'com.smartbox.rentbox.app'
  },
};

const folderToHostName = {
  prod: {
    aplikacja: 'aplikacja',
    wlasnybox: 'wlasnybox',
    superbox: 'superbox',
    rentbox: 'rentbox'
  },
  local: { aplikacja: 'test' },
};

const authIds = {
  web: {
    aplikacja: {
      google:
        '315516464384-5ipo3i6jcmlhj9ef8ureo3hatrbeejek.apps.googleusercontent.com',
    },
    wlasnybox: {
      google:
        '315516464384-5ipo3i6jcmlhj9ef8ureo3hatrbeejek.apps.googleusercontent.com',
    },
    superbox: {
      google:
        '315516464384-5ipo3i6jcmlhj9ef8ureo3hatrbeejek.apps.googleusercontent.com',
    },
    rentbox: {
      google:
        '315516464384-5ipo3i6jcmlhj9ef8ureo3hatrbeejek.apps.googleusercontent.com',
    },
  },
  ios: {
    aplikacja: {
      google: {
        id: '315516464384-g7cbrcua1bs804r0lgvhlgv94jqdfthu.apps.googleusercontent.com',
        reversed:
          'com.googleusercontent.apps.315516464384-g7cbrcua1bs804r0lgvhlgv94jqdfthu',
      },
    },
    wlasnybox: {
      google: {
        id: '315516464384-qvitlfcuoe9emkcgk90cd18su6klov9b.apps.googleusercontent.com',
        reversed:
          'com.googleusercontent.apps.315516464384-qvitlfcuoe9emkcgk90cd18su6klov9b',
      },
    },
    superbox: {
      google: {
        id: '315516464384-2580vbf7dluev1vuri2hgfkh8oe86r47.apps.googleusercontent.com',
        reversed:
          'com.googleusercontent.apps.315516464384-2580vbf7dluev1vuri2hgfkh8oe86r47',
      },
    },
    rentbox: {
      google: {
        id: '315516464384-fsj78e35t2lq6emp0ep6omf3n79s5cvq.apps.googleusercontent.com',
        reversed:
          'com.googleusercontent.apps.315516464384-fsj78e35t2lq6emp0ep6omf3n79s5cvq',
      },
    },
  },
  android: {
    aplikacja: {
      google:
        'com.googleusercontent.apps.315516464384-jpeesk0v0amm7up9adf6p44hqao558tu',
    },
    wlasnybox: {
      google: {
        id: '315516464384-9nauq6csokb6ljioan0v1mcp1estvvok.apps.googleusercontent.com',
      },
    },
    superbox: {
      google: {
        id: '315516464384-n460c3gimfjknc7kvkjk3udg0in4cim6.apps.googleusercontent.com',
      },
    },
    rentbox: {
      google: {
        id: '315516464384-i374vrlc49ua37inm4777vnakt36r2fo.apps.googleusercontent.com',
      },
    },
  },
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
  const appId = folderToAppIdentifier.ios[folderName] || folderName;
  const authId = authIds.ios[folderName];
  const hostName = folderToHostName[mode]?.[folderName] || folderName;
  const template = await readFile('./app-config/ios/Info.plist', 'utf8');
  const content = template
    .replaceAll('{IOS_APP_NAME}', appName)
    .replaceAll('{IOS_APP_BUNDLE_ID}', appId)
    .replace('{IOS_APP_DEEP_LINK_SCHEMA}', `smartbox-${hostName}`)
    .replace('{IOS_GOOGLE_AUTH_CLIENT_REVERSED_ID}', authId.google.reversed)
    .replace('{IOS_GOOGLE_AUTH_CLIENT_ID}', authId.google.id)
    .replaceAll('{META_CLIENT_ID}', process.env.META_CLIENT_ID)
    .replace('{META_CLIENT_TOKEN}', process.env.META_CLIENT_TOKEN);
  console.log('WRITING INFO.list');
  await writeFile('./ios/App/App/Info.plist', content);
}

async function copyEntitlements(folderName) {
  const hostName = folderToHostName[mode]?.[folderName] || folderName;

  const template = await readFile('./app-config/ios/App.entitlements', 'utf8');
  const content = template.replaceAll('{HOSTNAME}', hostName);
  console.log('WRITING App.entitlements');
  await writeFile('./ios/App/App/App.entitlements', content);
}

async function copyAndroidManifest(folderName) {
  const appId = folderToAppIdentifier.android[folderName] || folderName;
  const hostName = folderToHostName[mode]?.[folderName] || folderName;
  const template = await readFile(
    './app-config/android/AndroidManifest.xml',
    'utf8',
  );
  const content = template
    .replace('{ANDROID_APP_ID}', appId)
    .replace('{ANDROID_APP_DEEP_LINK_HOST}', hostName);
  await writeFile('./android/app/src/main/AndroidManifest.xml', content);
}

async function copyAndroidMainActivity(folderName) {
  const appId = folderToAppIdentifier.android[folderName] || folderName;
  const hostName = folderToHostName[mode]?.[folderName] || folderName;

  const segments = appId.split('.');

  const template = await readFile(
    './app-config/android/MainActivity.java',
    'utf8',
  );
  const content = template.replace('{ANDROID_APP_ID}', appId);

  await writeFile(
    `./android/app/src/main/java/${segments[0]}/${segments[1]}/${segments[2]}/${segments[3]}/MainActivity.java`,
    content,
  );
}

async function copyAndroidStrings(folderName) {
  const appId = folderToAppIdentifier.android[folderName] || folderName;
  const appName = folderToAppName[folderName] || folderName;
  console.log('PROCESS', process.env);
  const template = await readFile('./app-config/android/strings.xml', 'utf8');
  const content = template
    .replace('{ANDROID_APP_ID}', appId)
    .replaceAll('{ANDROID_APP_NAME}', appName)
    .replace('{META_APP_ID}', process.env.META_CLIENT_ID)
    .replace('{META_CLIENT_TOKEN}', process.env.META_CLIENT_SECRET);
  await writeFile('./android/app/src/main/res/values/strings.xml', content);
}

async function addConfigFiles(folderName) {
  await copyFiles('./app-config/ios', './ios/App/App', ['AppDelegate.swift']);
  // await copyFiles('./app-config/ios', './ios/App', ['Podfile']);

  // await copyFiles(`./app-config/ios/${folderName}`, './ios/App/App', [
  //   'GoogleService-Info.plist',
  // ]);

  await copyInfoPlist(folderName);
  await copyEntitlements(folderName);
  await copyAndroidManifest(folderName);
  await copyAndroidStrings(folderName);
  await copyAndroidMainActivity(folderName);
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
  const appId = folderToAppIdentifier.android[folderName] || folderName;

  run(`NODE_APP_NAME="${appName}" NODE_APP_ID="${appId}" npx cap add android`);
}

function initIos(folderName) {
  const appName = folderToAppName[folderName] || folderName;
  const appId = folderToAppIdentifier.ios[folderName] || folderName;

  run(
    `NODE_APP_NAME="${appName}" NODE_APP_ID="${appId}" npx cap add ios --packagemanager CocoaPods`,
  );
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
  console.log('- Associated domain: applinks:{hostname}.smartbox-app.pl');
}

// -----------------------------------------------------------------------------
// Bootstrap
// -----------------------------------------------------------------------------

main().catch((err) => {
  console.error('\nBuild failed');
  console.error(err.message || err);
  process.exit(1);
});
