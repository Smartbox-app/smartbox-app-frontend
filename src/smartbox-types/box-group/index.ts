import { PriceResolveType, SinglePricing } from "./pricing";
export * from './pricing';

export interface BoxGroupEntity {
    id: string;
    name: string;
    image: string;
    stockId: string;
    pricing: SinglePricing[];
    priceResolveType: PriceResolveType;
    minRentPeriod: number;
    width?: number;
    height?: number;
    depth?: number;
    area?: number;
    volume?: number;
}

export type BoxGroupReq = Pick<BoxGroupEntity, 'name' | 'stockId' | 'width' | 'height' | 'depth' | 'area' | 'volume' | 'minRentPeriod'>;
export type BoxGroupListRes = Pick<BoxGroupEntity, 'id' | 'name' | 'stockId' | 'area' | 'minRentPeriod' | 'pricing'>;
export type BoxGroupUserRes = Pick<BoxGroupEntity, 'id' | 'name' | 'stockId' | 'image' | 'width' | 'height' | 'depth' | 'area' | 'volume' | 'pricing' | 'minRentPeriod' >
    & { available: boolean };
export type BoxGroupAdminClientRes = Pick<BoxGroupEntity, 'id' | 'name' | 'stockId' | 'image' | 'width' | 'height' | 'depth' | 'area' | 'volume' | 'pricing' | 'priceResolveType' | 'minRentPeriod' >;