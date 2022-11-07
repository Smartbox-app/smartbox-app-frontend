const { adjustWorkbox, override } = require('customize-cra');
const { aliasDangerous, configPaths } = require('react-app-rewire-alias/lib/aliasDangerous');

module.exports = {
  webpack: override(
    adjustWorkbox((wb) =>
      Object.assign(wb, {
        importScripts: ['/serviceWorkerMessageHandler.js'],
        exclude: wb.exclude || [],
      }),
    ),
    aliasDangerous(configPaths('./tsconfig.paths.json')),
  ),
};
