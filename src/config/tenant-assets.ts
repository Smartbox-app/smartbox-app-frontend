const TENANT_LOGO_BASE_URL =
  import.meta.env.VITE_TENANT_LOGO_BASE_URL ??
  'https://storage.googleapis.com/smartbox-app/logo';

interface TenantLogoSource {
  logo?: string | null;
}

const isAbsoluteAssetUrl = (value: string) =>
  value.startsWith('http://') ||
  value.startsWith('https://') ||
  value.startsWith('/');

const getTenantLogoUrl = (tenant?: TenantLogoSource | null): string | null => {
  if (!tenant?.logo) return null;

  if (isAbsoluteAssetUrl(tenant.logo)) {
    return tenant.logo;
  }

  return `${TENANT_LOGO_BASE_URL}/${tenant.logo}`;
};

export { TENANT_LOGO_BASE_URL, getTenantLogoUrl };
