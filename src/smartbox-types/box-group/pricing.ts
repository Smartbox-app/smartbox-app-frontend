import { PriceDisplayForClients } from '../stock/price-display-for-clients';

export enum PricingType {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Quarter = 'quarter',
  HalfYear = 'half_year',
  Year = 'year',
}

export interface SinglePricing {
  type: PricingType;
  quantity: number | null;
  price: number | null;
}

export type SinglePricingForUser = SinglePricing & {
  display: PriceDisplayForClients;
  netPrice: number;
  grossPrice: number;
  isGross: boolean;
};

export enum PriceResolveType {
  Proportional = 'proportional',
  RoundToNearestPeriod = 'round',
  RestByDay = 'rest-by-day',
}

export interface PricingReq {
  pricing: SinglePricing[];
  priceResolveType: PriceResolveType;
}
