import { useCallback } from 'react';
import { useTenant } from './useTenant';
import { TenantForUsers } from 'smartbox-types';

type AssetType = 'logo' | 'background' | 'slide' | 'icon' | 'box-group' | 'map';

export const useFileStorage = () => {
  const { tenant } = useTenant();

  const getAssetPath = useCallback(
    (type: AssetType, assetName: string) => {
      if (!tenant) return '';
      const { publicAssetsBaseUrl } = tenant;
      return `${publicAssetsBaseUrl}/${type}/${assetName}`;
    },
    [tenant],
  );

  return {
    getAssetPath,
  };
};
