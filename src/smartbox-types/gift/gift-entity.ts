import { IBase } from '../base/base.interface';
import { IPayment } from '../payment';

export interface IGift extends IBase {
  code: string;
  discount: number;
  duration: number;
  expireAt: Date;
  active: boolean;
  minRentPeriod: number;
  type: GiftType;
}

export enum GiftType {
  ReducePeriodToPrice = 'reduce-period-to-price',
  ReducePeriodByValue = 'reduce-period-by-value',
  ReducePeriodByPercent = 'reduce-period-by-percent'
}