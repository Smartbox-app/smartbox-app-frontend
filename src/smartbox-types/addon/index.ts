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
    acceptance?: string;
    pricing: SingleAddonVariant[];
    priceResolveType: AddonPriceResolveType;
}

export type AddonFormDataReq = Pick<
    AddonEntity,
    'name' | 'description' | 'stockId' | 'acceptance' | 'fileText'
> & {
    required: string
}
export type AddonReq = Pick<AddonEntity, 'name' | 'description' | 'required' | 'stockId' | 'acceptance' | 'fileText'>
export type AddonListRes = Pick<AddonEntity, 'id' | 'name' | 'pricing' | 'stockId'>
export type AddonRes = Pick<AddonEntity, 'id' | 'description' | 'acceptance' | 'file' | 'required' | 'fileText' | 'name' | 'stockId' | 'pricing'> & {
    isGross: boolean
}
export type AddonClientAdminRes = Omit<AddonRes, 'isGross'> & {
    pricing: SingleAddonVariant[];
    priceResolveType: AddonPriceResolveType;
}