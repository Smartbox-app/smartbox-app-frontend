export const config = {
  feFilesPath:
    process.env.FE_FILES_PATH ||
    '/home/smartbox/domains/smartbox-app.pl/public_html/dist',
  apiUrl: process.env.API_URL || 'http://host.docker.internal:3001/tenant/ssr',
  // App apex — staging may already be a subdomain (e.g. vps247-smartbox.netcloud24.com)
  rootDomain: process.env.ROOT_DOMAIN || 'smartbox-app.pl',
  fePort: Number(process.env.FRONTEND_PORT || 3204),
  // Default off: Docker paths are useless to host Apache X-Sendfile
  enableXSendfile: process.env.ENABLE_X_SENDFILE === 'true',
  defaults: {
    title: 'Smartbox Storage',
  },
};
