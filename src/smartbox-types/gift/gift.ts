import { Prop } from '../store/prop.decorator';
import { BaseResponse } from '../base/baseRes';
import { GiftType } from './gift-entity';
export class GiftRes extends BaseResponse {
  @Prop()
  id: string;
  @Prop()
  code: string;
  @Prop()
  discount: number;
  @Prop()
  duration: number;
  @Prop()
  type: GiftType;
  @Prop()
  count: number;
  @Prop()
  active: boolean;
  @Prop()
  minRentPeriod: number;
}


export interface AddGiftReq {
  discount: number;
  duration: number;
  type: GiftType;
  count: number;
  stockId: string;
  expireAt: string;
}

export interface GetGiftReq {
  code: string;
  stockId: string;
  startDate: string;
  endDate: string;
}
