import { IBase } from '../base/base.interface';
import { CompanyData } from '../payment';

export interface IUser extends IBase{
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  city: string;
  postCode: string;

  createdAt: Date;

  status: UserStatus;
  role: UserRole;
  rentCount: number;
  companyData: CompanyData;
  stocks: string[];
  
  pwdHash: string;
  currentTokenId: string;
  updateTokenValidTill: Date;
  updateToken: string;
  facebookId: string;
  gmailId: string;
  lang: Language;
}

export interface IUserInvitation extends IBase {
  email: string;
  token: string;
  role: UserRole;
  tenantId: string;
  stockIds: string[];
}

export enum UserRole {
  admin = 'Administrator',
  worker = 'Pracownik',
  user = 'Użytkownik',
  client = 'Klient',
}

export enum UserRoleForTenant {
  worker = 'Pracownik',
  user = 'Użytkownik',
}

export enum UserStatus {
  active = 'Aktywny',
  blocked = 'Zablokowany',
  preActive = 'Nie aktywowany'
}

export enum Language {
  'pl',
  'en',
}
