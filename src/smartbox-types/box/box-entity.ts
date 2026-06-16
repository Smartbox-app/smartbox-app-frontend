import { SinglePricing } from '../box-group';
import { IBase } from '../base/base.interface';
import { RentStatus } from '../rent';

export interface BoxEntity {
  id: string;
  identifier: string;
  stockId: string;
  boxGroupId: string;
  additionalInfo?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
  ksmIdentifier?: string;
  active: boolean;
}

export type BoxListRes = Pick<BoxEntity, 'id' | 'identifier' | 'stockId'> & {
  controlled: boolean;
  area: number;
  status: RentStatus;
  rentId: string;
  pricing: SinglePricing[];
};
export type BoxMapRes = Pick<
  BoxEntity,
  'id' | 'identifier' | 'stockId' | 'x' | 'y' | 'width' | 'height' | 'rotation'
> & {
  groupWidth: number;
  groupHeight: number;
  area: number;
  status: RentStatus;
  rentId: string;
};
export type BoxMapUserRes = Pick<
  BoxEntity,
  'id' | 'identifier' | 'stockId' | 'x' | 'y' | 'width' | 'height' | 'rotation'
> & { groupWidth: number; groupHeight: number; area: number };

export type BoxReq = Pick<
  BoxEntity,
  'identifier' | 'additionalInfo' | 'stockId' | 'boxGroupId' | 'ksmIdentifier'
>;
export type BoxPositionReq = Pick<BoxEntity, 'x' | 'y' | 'stockId'>;
export type BoxActiveReq = Pick<BoxEntity, 'active'>;
export type BoxSizeReq = Pick<BoxEntity, 'width' | 'height' | 'stockId'>;

export type BoxesBatchReq = {
  identifiers: string;
  stockId: string;
  boxGroupId: string;
};

export type BoxMapLayoutItem = Pick<
  BoxEntity,
  'id' | 'x' | 'y' | 'width' | 'height' | 'rotation'
>;

export type BoxesMapLayoutBatchReq = {
  stockId: string;
  boxes: BoxMapLayoutItem[];
};

export interface IBoxGroup extends IBase {
  size: number;
  free: string[];
}

export interface QueryBuilderBox {
  id: string;
  stockId: string;
  area: number;
  identifier: string;
  status: RentStatus | null;
  rentId: string | null;
  pricing: SinglePricing[];
  ksmIdentifier: string;
  active: boolean;
}

export interface QueryBuilderMapBox extends QueryBuilderBox {
  x: number;
  y: number;
  width: number;
  height: number;
  groupWidth: number;
  groupHeight: number;
}
