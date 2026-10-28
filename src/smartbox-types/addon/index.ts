import { PriceDisplayForClients } from "src/smartbox-types/stock";
import { LocalizedStringMap } from 'src/smartbox-types/i18n';

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

export type SingleAddonVariantForUser = Omit<SingleAddonVariant, 'pricing'> & {
  pricing: SingleAddonPricingForUser[];
}

export type SingleAddonVariantForUserWithCorrectedPrice = SingleAddonVariantForUser & {
  price: number;
  netPrice: number;
  grossPrice: number;
};

export interface SingleAddonPricing {
  id: string;
  type: AddonDynamicPricingType;
  // how many days/months etc
  price: number | null;
  quantity: number | null;
}

export type SingleAddonPricingForUser = Omit<SingleAddonPricing, 'type'> & {
  display: PriceDisplayForClients;
  netPrice: number;
  grossPrice: number;
  isGross: boolean;
  type: AddonDynamicPricingType | null;
};

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
  price: { value: number; netPrice: number; grossPrice: number; isGross: boolean }[];
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
  nameI18n: LocalizedStringMap;
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
  boxGroupIds: string[];
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
> & {
  acceptances: string;
  boxGroupIds: string;
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
  | 'boxGroupIds'
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
  | 'userFileAllowed'
  | 'userFileText'
  | 'noPricing'
  | 'userFileRequirement'
  | 'tax'
  | 'order'
  | 'active'
  | 'newRentOnly'
> & {
  display: PriceDisplayForClients;
  isGross: boolean;
  pricing: SingleAddonVariantForUser[];
};
export type AddonClientAdminRes = Omit<AddonRes, 'isGross' | 'display' | 'pricing'> & {
  pricing: SingleAddonVariant[];
  priceResolveType: AddonPriceResolveType;
  boxGroupIds: string[];
};

export type AddonTemplateVariableRes = {
  slug: string;
  name: string;
};
