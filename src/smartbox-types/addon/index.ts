export enum AddonPricingType {
    Day = 'day',
    Week = 'week',
    Month = 'month',
    Year = 'year'
}

export interface SingleAddonVariant {
    id: string;
    name: string;
    pricing: SingleAddonPricing[];
}

export interface SingleAddonPricing {
    id: string;
    type: AddonPricingType;
    // how many days/months etc
    price: number | null;
    quantity: number | null;
}

export enum AddonPriceResolveType {
    Proportional = 'proportional',
    RoundToNearestPeriod = 'round',
    RestByDay = 'rest-by-day'
}

export enum AddonUserFileRequirementType {
    Required = 'required',
    Optional = 'optional',
    RequiredWhenNoVariant = 'required-when-no-variant',
}

export interface AddonPricingReq {
    variants: SingleAddonVariant[];
    priceResolveType: AddonPriceResolveType;
}

export interface CalculatedAddonPriceRes {
    addonId: string;
    variantId: string;
    price: { value: number, isGross: boolean };
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
    }
  }

export interface AddonEntity {
    id: string;
    description: string;
    required: boolean;
    name: string;
    stockId: string;
    tenantId: string;
    file?: string;
    fileName?: string;
    fileText?: string;
    acceptances: SingleAcceptance[];
    pricing: SingleAddonVariant[];
    priceResolveType: AddonPriceResolveType;
    userFileAllowed: boolean;
    userFileText: string;
    userFileRequirement: AddonUserFileRequirementType;
}

export type AddonFormDataReq = Pick<
    AddonEntity,
    'name' | 'description' | 'stockId' | 'fileText' | 'userFileText' | 'userFileRequirement'
> & {
    acceptances: string;
    required: string;
    userFileAllowed: string;
}
export type AddonReq = Pick<AddonEntity, 'name' | 'description' | 'required' | 'stockId' | 'acceptances' | 'userFileRequirement' | 'fileText' | 'userFileAllowed' | 'userFileText'>
export type AddonListRes = Pick<AddonEntity, 'id' | 'name' | 'pricing' | 'stockId'>
export type AddonRes = Pick<AddonEntity, 'id' | 'description' | 'acceptances' | 'file' | 'required' | 'fileText' | 'name' | 'stockId' | 'pricing' | 'userFileAllowed' | 'userFileText' | 'userFileRequirement'> & {
    isGross: boolean
}
export type AddonClientAdminRes = Omit<AddonRes, 'isGross'> & {
    pricing: SingleAddonVariant[];
    priceResolveType: AddonPriceResolveType;
}