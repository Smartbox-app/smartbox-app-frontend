const GCS_ASSET_FOLDERS = {
  logo: 'logo',
  background: 'background',
  boxGroup: 'box-group',
  stockMapBackground: 'stockBackgrounds',
} as const;

interface TenantAssetSource {
  logo?: string | null;
  background?: string | null;
  publicAssetsBaseUrl?: string | null;
}

interface BoxGroupImageSource {
  image?: string | null;
}

interface StockMapBackgroundSource {
  mapBackground?: string | null;
}

const isAbsoluteAssetUrl = (value: string) =>
  value.startsWith('http://') ||
  value.startsWith('https://') ||
  value.startsWith('/');

const normalizeBaseUrl = (baseUrl?: string | null) =>
  baseUrl?.replace(/\/$/, '') ?? null;

const buildGcsAssetUrl = (
  baseUrl: string | null | undefined,
  folder: string,
  fileName?: string | null,
): string | null => {
  if (!fileName) return null;

  if (isAbsoluteAssetUrl(fileName)) {
    return fileName;
  }

  const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
  if (!normalizedBaseUrl) return null;

  return `${normalizedBaseUrl}/${folder}/${fileName}`;
};

const getTenantLogoUrl = (tenant?: TenantAssetSource | null): string | null =>
  buildGcsAssetUrl(tenant?.publicAssetsBaseUrl, GCS_ASSET_FOLDERS.logo, tenant?.logo);

const getTenantBackgroundUrl = (
  tenant?: TenantAssetSource | null,
): string | null =>
  buildGcsAssetUrl(
    tenant?.publicAssetsBaseUrl,
    GCS_ASSET_FOLDERS.background,
    tenant?.background,
  );

const getBoxGroupImageUrl = (
  boxGroup?: BoxGroupImageSource | null,
  tenant?: Pick<TenantAssetSource, 'publicAssetsBaseUrl'> | null,
): string | null =>
  buildGcsAssetUrl(
    tenant?.publicAssetsBaseUrl,
    GCS_ASSET_FOLDERS.boxGroup,
    boxGroup?.image,
  );

const getStockMapBackgroundUrl = (
  stock?: StockMapBackgroundSource | null,
  tenant?: Pick<TenantAssetSource, 'publicAssetsBaseUrl'> | null,
): string | null =>
  buildGcsAssetUrl(
    tenant?.publicAssetsBaseUrl,
    GCS_ASSET_FOLDERS.stockMapBackground,
    stock?.mapBackground,
  );

export {
  getTenantLogoUrl,
  getTenantBackgroundUrl,
  getBoxGroupImageUrl,
  getStockMapBackgroundUrl,
};
