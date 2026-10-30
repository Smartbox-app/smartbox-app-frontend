import { TenantForUsers } from 'smartbox-types';

export const hasMobileAppAndroidLink = (
  tenant?: TenantForUsers | null,
): boolean => !!tenant?.mobileAppAndroidLink;

export const hasMobileAppIosLink = (tenant?: TenantForUsers | null): boolean =>
  !!tenant?.mobileAppIosLink;
