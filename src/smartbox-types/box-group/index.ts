import { BoxGroupType } from 'src/smartbox-types/box-group/box-group-type';
import { PriceResolveType, SinglePricing, SinglePricingForUser } from 'src/smartbox-types/box-group/pricing';
import { LocalizedStringMap } from 'src/smartbox-types/i18n';

export * from 'src/smartbox-types/box-group/pricing';
export * from 'src/smartbox-types/box-group/box-group-type';

export interface BoxGroupEntity {
  id: string;
  name: string;
  nameI18n: LocalizedStringMap;
  type: BoxGroupType;
  image: string;
  stockId: string;
  pricing: SinglePricing[];
  priceResolveType: PriceResolveType;
  minRentPeriod: number;
  maxAdvanceBookingDays: number;
  maxRentPeriod: number;
  limitToNotify: number | null;
  width?: number;
  height?: number;
  depth?: number;
  area?: number;
  volume?: number;
  order?: number;
}

export type BoxGroupReq = Pick<
  BoxGroupEntity,
  | 'name'
  | 'type'
  | 'stockId'
  | 'width'
  | 'height'
  | 'depth'
  | 'area'
  | 'volume'
  | 'minRentPeriod'
  | 'maxAdvanceBookingDays'
  | 'maxRentPeriod'
  | 'limitToNotify'
  | 'order'
> & {
  nameI18n?: LocalizedStringMap;
} & Record<string, unknown>;
export type BoxGroupListRes = Pick<
  BoxGroupEntity,
  'id' | 'name' | 'stockId' | 'area' | 'minRentPeriod' | 'maxRentPeriod' | 'pricing' | 'order'
>;
export type BoxGroupUserRes = Pick<
  BoxGroupEntity,
  | 'id'
  | 'name'
  | 'type'
  | 'stockId'
  | 'image'
  | 'width'
  | 'height'
  | 'depth'
  | 'area'
  | 'volume'
  | 'minRentPeriod'
  | 'maxAdvanceBookingDays'
  | 'maxRentPeriod'
  | 'order'
> & { available: boolean, left: number | null, pricing: SinglePricingForUser[] };
export type BoxGroupAdminClientRes = Pick<
  BoxGroupEntity,
  | 'id'
  | 'name'
  | 'type'
  | 'stockId'
  | 'image'
  | 'width'
  | 'height'
  | 'depth'
  | 'area'
  | 'volume'
  | 'pricing'
  | 'priceResolveType'
  | 'minRentPeriod'
  | 'maxAdvanceBookingDays'
  | 'maxRentPeriod'
>;

export type BoxGroupPublicRes = Pick<BoxGroupEntity, 'id' | 'name' | 'stockId'> & {
  stockName: string | null;
  imageUrl: string | null;
  freeBoxesCount: number;
  closestAvailableAt: string | null;
};

export type BoxPublicRes = {
  identifier: string;
  available: boolean;
};

export type BoxGroupPublicWithBoxesRes = BoxGroupPublicRes & {
  boxes: BoxPublicRes[];
};
