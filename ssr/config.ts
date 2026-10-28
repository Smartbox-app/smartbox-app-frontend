export const config = {
  feFilesPath:
    process.env.FE_FILES_PATH ||
    '/home/smartbox/domains/smartbox-app.pl/public_html/dist',
  apiUrl: process.env.API_URL || 'https://api.smartbox-app.pl/tenant/ssr',
  fePort: Number(process.env.FRONTEND_PORT || 3204),
  enableXSendfile: process.env.ENABLE_X_SENDFILE !== 'false',
  defaults: {
    title: 'Smartbox Storage',
  },
};
