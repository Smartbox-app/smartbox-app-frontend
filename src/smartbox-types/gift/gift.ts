import { GiftType } from 'src/smartbox-types/gift/gift-entity';

export class GiftRes {
  id: string;
  code: string;
  discount: number;
  duration: number;
  type: GiftType;
  count: number;
  active: boolean;
  minRentPeriod: number;
  startAt: Date | null;
}


/** Row from GET gift/list/:stockId. */
export interface GiftListRes {
  id: string;
  active: boolean;
  discount: number;
  duration: number;
  type: GiftType;
  code: string;
  count: number;
  countLeft: number;
  stockId: string;
  minRentPeriod: number;
  expireAt: Date;
  startAt: Date | null;
  newClientsOnly: boolean;
  group: string;
}

export interface AddGiftReq {
  code?: string;
  discount: number;
  reductionTo: number;
  duration: number;
  type: GiftType;
  count: number;
  stockId: string;
  startAt: string;
  expireAt: string;
  minRentPeriod: number;
  boxGroupId?: string | null;
  newClientsOnly?: boolean;
}

export interface GetGiftReq {
  code: string;
  stockId: string;
  startDate: string;
  endDate: string;
}
