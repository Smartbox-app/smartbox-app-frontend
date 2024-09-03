export enum PricingType {
    Day = 'day',
    Week = 'week',
    Month = 'month',
    Year = 'year'
}

export interface SinglePricing {
    type: PricingType;
    quantity: number | null;
    price: number | null;
    // only in response to user
    isGross?: boolean;
}

export enum PriceResolveType {
    Proportional = 'proportional',
    RoundToNearestPeriod = 'round',
    RestByDay = 'rest-by-day'
}

export interface PricingReq {
    pricing: SinglePricing[];
    priceResolveType: PriceResolveType;
}

export interface CalculatedPriceRes {
    price: { value: number, isGross: boolean };
    details: string[];
    error?: string;
}