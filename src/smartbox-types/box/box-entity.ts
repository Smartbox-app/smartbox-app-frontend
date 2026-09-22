import { SinglePricing } from '../box-group';
import { IBase } from '../base/base.interface';
import { RentStatus } from '../rent';

export enum BoxStatus {
  free = 'free',
  outOfService = 'outOfService',
}

export type BoxDisplayStatus = RentStatus | BoxStatus;

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
  companyId?: string | null;
}

export type BoxListRes = Pick<BoxEntity, 'id' | 'identifier' | 'stockId'> & {
  controlled: boolean;
  area: number;
  status: BoxDisplayStatus;
  rentId: string;
  pricing: SinglePricing[];
  companyId?: string | null;
  companyName?: string | null;
};
export type BoxMapRes = Pick<
  BoxEntity,
  'id' | 'identifier' | 'stockId' | 'x' | 'y' | 'width' | 'height' | 'rotation'
> & {
  groupWidth: number;
  groupHeight: number;
  area: number;
  status: BoxDisplayStatus;
  rentId: string;
  finishAt?: Date | string | null;
  decisionFinishAt?: Date | string | null;
};
export type BoxMapUserRes = Pick<
  BoxEntity,
  'id' | 'identifier' | 'stockId' | 'x' | 'y' | 'width' | 'height' | 'rotation'
> & { groupWidth: number; groupHeight: number; area: number };

export type BoxReq = Pick<
  BoxEntity,
  | 'identifier'
  | 'additionalInfo'
  | 'stockId'
  | 'boxGroupId'
  | 'ksmIdentifier'
  | 'companyId'
>;
export type BoxPositionReq = Pick<BoxEntity, 'x' | 'y' | 'stockId'>;
export type BoxActiveReq = Pick<BoxEntity, 'active'>;
export type BoxSizeReq = Pick<BoxEntity, 'width' | 'height' | 'stockId'>;

export type BoxesBatchReq = {
  identifiers: string;
  stockId: string;
  boxGroupId: string;
  companyId?: string | null;
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
  status: BoxDisplayStatus | null;
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
