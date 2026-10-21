import { PriceDisplayForClients } from "../stock";

export enum PricingType {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Quarter = 'quarter',
  HalfYear = 'half_year',
  Year = 'year',
}

export interface PriceThreshold {
  boxesLeft: number | null;
  price: number | null;
}

export interface SinglePricing {
  type: PricingType;
  quantity: number | null;
  price: number | null;
  thresholds?: PriceThreshold[];
}

export type SinglePricingForUser = Omit<SinglePricing, 'thresholds'> & {
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

export interface CalculatedPriceRes {
  price: {
    value: number;
    isGross: boolean;
    netPrice: number;
    grossPrice: number;
    display: PriceDisplayForClients;
  }[];
  details: string[];
  error?: string;
}
