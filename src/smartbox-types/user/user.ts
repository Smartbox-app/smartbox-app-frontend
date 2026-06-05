import { UserRole, UserStatus, Language } from './user-entity';
import { BaseResponse } from '../base/baseRes';
import { Prop } from '../store/prop.decorator';
import type { CompanyData } from '../payment';
import { RentStatus } from '../rent';
import { ApiErrorCode } from '../apiMessages/errorCodes';
import { SelectOption } from '../select';

export class UserRes extends BaseResponse {
  @Prop() id: string;
  @Prop() email: string;
  @Prop() city: string;
  @Prop() street: string;
  @Prop() postCode: string;
  @Prop() birthDate?: Date;
  @Prop() phone: string;
  @Prop() firstName: string;
  @Prop() lastName: string;
  @Prop() country: string;
  @Prop() role: UserRole;
  @Prop() rentCount: number;
  @Prop() companyData: CompanyData;
  @Prop() tenantId: string | null;
  @Prop() stocks: string[];
}

export interface BoxesSummary {
  count: number;
}

export interface StockSummary {
  id: string;
  name: string;
  boxes: BoxesSummary;
  allowexBoxesCount?: number;
}

export interface StocksByTenant {
  [key: string]: StockSummary[]
}

export interface UserListRes extends UserRes {
  status: UserStatus;
}

export interface UserClientListRes {
  id: string;
  tenantId: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  phone: string;
  allowedBoxesCount: number;
  allowedStocksCount: number;
  stocks?: StockSummary[];

}

export interface UpdateUserReq {
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  postCode: string;
  companyData: CompanyData;
}

export interface AddUserReq {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  pwd: string;
  pwd2: string;
}

export type RegisterUserRes = {
  activationToken?: string;
};

export type AccountActivationTokenPayload = {
  activationToken: string;
};

export interface AddInvitedUserReq {
  invitationId: string;
  token: string;
  phone: string;
  firstName: string;
  lastName: string;
  pwd: string;
  pwd2: string;
  tenantId: string;
}

export interface AddInvitedTenantReq {
  userId: string;
  token: string;
  identifier: string;
  name: string;
  pwd: string;
  pwd2: string;
}

export interface InviteWorkerReq {
  /** Legacy single invite when `emails` is omitted or empty. */
  email?: string;
  /** Bulk invite; non-empty array returns {@link InviteUsersRes}. */
  emails?: string[];
  role: UserRole;
  tenantId?: string;
  stockIds: SelectOption[];
}

export interface InviteUserFailure {
  email: string;
  errorCode: ApiErrorCode;
}

export interface InviteUsersRes {
  invited: string[];
  failed: InviteUserFailure[];
}

export interface AddTenantReq {
    // user data
    email: string;
    phone: string;
    tenantId: string;
    // tenant data
    name: string;
}

export interface ChangeRoleReq {
  role: UserRole,
  stocks: string[],
}

export interface UpdatePwdReq {
  oldPwd: string;
  newPwd: string;
  newPwd2: string;
}

export enum UserType {
  staff,
  user,
  client
}

export interface RestorPwdPetition {
  email: string;
}

export interface RestorPwdReq {
  userId: string;
  token: string;
  pwd: string;
  pwd2: string;
}

export class MyLang extends BaseResponse {
  @Prop()
  lang: Language;
}

export interface UpdateWorkerStocksReq {
  userId: string;
  stockIds: string[];
}

export interface UserDetailsRes {
  id: string;
  email: string;
  city: string;
  street: string;
  postCode: string;
  phone: string;
  firstName: string;
  lastName: string;
  rentCount: number;
  companyData: CompanyData;
  activeRents: ActiveRentsForUserDetails[]
}

export interface ActiveRentsForUserDetails {
  id: string;
  startAt: Date;
  finishAt: Date;
  number: string;
  status: RentStatus;
}

export interface SendSmsReq {
  sendToOnesThatRent: boolean;
  text: string;
  stockId?: string;
}
