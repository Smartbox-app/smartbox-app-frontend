export enum AddonVariantPriceType {
  Dynamic = 'dynamic',
  Fixed = 'fixed',
}

export enum AddonDynamicPricingType {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Quarter = 'quarter',
  HalfYear = 'half_year',
  Year = 'year',
}

export interface SingleAddonVariant {
  id: string;
  name: string;
  default: boolean;
  pricing: SingleAddonPricing[];
  priceType: AddonVariantPriceType;
  price: number | null;
}

export interface SingleAddonPricing {
  id: string;
  type: AddonDynamicPricingType;
  // how many days/months etc
  price: number | null;
  quantity: number | null;
}

export enum AddonPriceResolveType {
  Proportional = 'proportional',
  RoundToNearestPeriod = 'round',
  RestByDay = 'rest-by-day',
}

export enum AddonFixedPriceInstallmentsResolveType {
  Proportional = 'proportional',
  FirstPeriod = 'first-period',
}

export enum AddonUserFileRequirementType {
  Required = 'required',
  Optional = 'optional',
  RequiredWhenNoVariant = 'required-when-no-variant',
}

export interface AddonPricingReq {
  variants: SingleAddonVariant[];
  priceResolveType: AddonPriceResolveType;
  fixedPriceInstallmentsResolveType: AddonFixedPriceInstallmentsResolveType;
}

export interface CalculatedAddonPriceRes {
  addonId: string;
  variantId: string;
  price: { value: number; isGross: boolean };
  details: string[];
  error?: string;
}

export interface SingleAcceptance {
  id: string;
  text: string;
  required: boolean;
}

export type AcceptanceStatuses = {
  [key: string]: {
    accepted: boolean;
  };
};

export interface AddonEntity {
  id: string;
  description: string;
  additionalDescription: string;
  required: boolean;
  name: string;
  slug: string;
  stockId: string;
  tenantId: string;
  file?: string;
  fileName?: string;
  fileText?: string;
  acceptances: SingleAcceptance[];
  pricing: SingleAddonVariant[];
  priceResolveType: AddonPriceResolveType;
  fixedPriceInstallmentsResolveType: AddonFixedPriceInstallmentsResolveType;
  userFileAllowed: boolean;
  userFileText: string;
  userFileRequirement: AddonUserFileRequirementType;
  tax: string;
  noPricing: boolean;
  order: number;
  active: boolean;
  newRentOnly: boolean;
  boxGroupId: string | null;
}

export type AddonFormDataReq = Pick<
  AddonEntity,
  | 'name'
  | 'slug'
  | 'description'
  | 'additionalDescription'
  | 'stockId'
  | 'fileText'
  | 'userFileText'
  | 'userFileRequirement'
  | 'tax'
  | 'boxGroupId'
> & {
  acceptances: string;
  required: string;
  userFileAllowed: string;
  noPricing: string;
  order: string;
  active: string;
  newRentOnly: string;
};

export type AddonReq = Pick<
  AddonEntity,
  | 'name'
  | 'slug'
  | 'description'
  | 'additionalDescription'
  | 'required'
  | 'stockId'
  | 'acceptances'
  | 'userFileRequirement'
  | 'fileText'
  | 'userFileAllowed'
  | 'userFileText'
  | 'noPricing'
  | 'tax'
  | 'order'
  | 'active'
  | 'newRentOnly'
  | 'boxGroupId'
>;
export type AddonListRes = Pick<
  AddonEntity,
  | 'id'
  | 'name'
  | 'pricing'
  | 'stockId'
  | 'noPricing'
  | 'order'
  | 'active'
  | 'newRentOnly'
>;
export type AddonRes = Pick<
  AddonEntity,
  | 'id'
  | 'description'
  | 'additionalDescription'
  | 'acceptances'
  | 'file'
  | 'required'
  | 'fileText'
  | 'name'
  | 'slug'
  | 'stockId'
  | 'pricing'
  | 'userFileAllowed'
  | 'userFileText'
  | 'noPricing'
  | 'userFileRequirement'
  | 'tax'
  | 'order'
  | 'active'
  | 'newRentOnly'
> & {
  isGross: boolean;
};
export type AddonClientAdminRes = Omit<AddonRes, 'isGross'> & {
  pricing: SingleAddonVariant[];
  priceResolveType: AddonPriceResolveType;
};
