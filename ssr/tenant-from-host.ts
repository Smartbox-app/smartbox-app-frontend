/** Tenant id from Host, given the app root (may itself be a subdomain on staging). */
export function tenantFromHost(hostname: string, rootDomain: string): string {
  const host = hostname.split(':')[0].toLowerCase().replace(/\.$/, '');
  const root = rootDomain.toLowerCase().replace(/^\./, '');

  if (root) {
    if (host === root || host === `www.${root}`) return '';
    if (host.endsWith(`.${root}`)) {
      return host.slice(0, -(root.length + 1)).split('.')[0] || '';
    }
  }

  const parts = host.split('.');
  return parts.length <= 2 ? '' : parts[0];
}

export function hostFromRequest(originalUrl: string, reqHostname: string): string {
  try {
    return new URL(originalUrl, 'http://local').searchParams.get('host') || reqHostname;
  } catch {
    return reqHostname;
  }
}

export function withHostParam(originalUrl: string, host: string): string {
  const u = new URL(originalUrl, 'http://local');
  u.searchParams.set('host', host);
  return `${u.pathname}${u.search}`;
}
