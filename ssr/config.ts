export const config = {
  feFilesPath:
    process.env.FE_FILES_PATH ||
    '/home/smartbox/domains/smartbox-app.pl/public_html/dist',
  apiUrl: process.env.API_URL || 'https://api.smartbox-app.pl/tenant/ssr',
  // App apex — staging may already be a subdomain (e.g. vps247-smartbox.netcloud24.com)
  rootDomain: process.env.ROOT_DOMAIN || 'smartbox-app.pl',
  fePort: Number(process.env.FRONTEND_PORT || 3204),
  enableXSendfile: process.env.ENABLE_X_SENDFILE !== 'false',
  defaults: {
    title: 'Smartbox Storage',
  },
};
