import { IBase } from '../base/base.interface';
import { RentStatus } from '../rent';
import { IUser, UserRole } from './user-entity';
import { IStock } from '../stock';

export interface IStory extends IBase {
  user: IUser;
  oldStatus: string;
  newStatus: string;
  date: Date;
  box: string;
  stock: IStock;
  role: UserRole.admin | UserRole.worker;
  rentFromAt: Date;
  rentToAt: Date;
  tenantEmail: string;
}