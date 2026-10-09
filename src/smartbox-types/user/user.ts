import { UserRole, UserStatus, Language } from './user-entity';
import { ApiErrorCode } from '../apiMessages/errorCodes';
import { TenantEntity } from '../tenant';
import { CompanyData, RentStatus, SelectOption } from '..';

export class UserRes {
  id: string;
  email: string;
  city: string;
  street: string;
  country: string;
  postCode: string;
  birthDate: Date | null;
  phone: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  rentCount: number;
  companyData: CompanyData;
  tenantId: string | null;
  stocks: string[];
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
  [key: string]: StockSummary[];
}

export interface UserListRes extends UserRes {
  status: UserStatus;
  tenant?: string;
  hasPasswordSet?: boolean;
  canResendActivationEmail?: boolean;
}

export interface UserClientListRes {
  id: string;
  status: UserStatus;
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

/** Row from GET user/invitation-list. Token is excluded by the entity. */
export interface UserInvitationListItem {
  id: string;
  email: string;
  role: UserRole;
  stockIds: string[];
  tenantId: string | null;
  tenant: TenantEntity;
}

export interface UpdateUserReq {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  postCode: string;
  companyData: CompanyData;
}

export interface UpdateUserBasicReq {
  firstName: string;
  lastName: string;
}

export interface UpdateUserContactReq {
  phone: string;
  email: string;
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface UpdateUserCompanyReq {
  companyName: string;
  companyStreet: string;
  companyCity: string;
  companyPostCode: string;
  companyCountry: string;
  nip: string;
}

export interface AddUserReq {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  pwd: string;
  pwd2: string;
}

/** Returned from POST user/new when SMS activation is used. */
export type RegisterUserRes = {
  activationToken?: string;
};

export type AccountActivationTokenPayload = {
  activationToken: string;
};

export interface AddUserByAdminReq {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  tenantId?: string;
}

export interface ActivateUserReq {
  pwd?: string;
  pwd2?: string;
}

export type ActivationStatusRes = {
  needsPassword: boolean;
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

export interface InviteUserFailure {
  email: string;
  errorCode: ApiErrorCode;
}

export interface InviteUsersRes {
  invited: string[];
  failed: InviteUserFailure[];
}

export interface AddTenantReq {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
}

export interface ChangeRoleReq {
  role: UserRole;
  stocks: string[];
}

export interface UpdatePwdReq {
  oldPwd?: string;
  newPwd: string;
  newPwd2: string;
}

export enum UserType {
  staff,
  user,
  client,
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

export class MyLang {
  lang: Language;
}

export interface UpdateWorkerStocksReq {
  userId: string;
  stockIds: SelectOption[];
}

export interface UserDetailsRes {
  id: string;
  email: string;
  city: string;
  street: string;
  postCode: string;
  country: string;
  phone: string;
  firstName: string;
  lastName: string;
  rentCount: number;
  companyData: CompanyData;
  note?: string | null;
  activeRents: ActiveRentsForUserDetails[];
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
