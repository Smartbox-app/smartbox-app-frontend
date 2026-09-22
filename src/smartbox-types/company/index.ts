import { SelectOption } from '../select';

export interface CompanyEntity {
  id: string;
  tenantId: string;
  name: string;
  invoiceServiceApiKey: string;
  invoiceServiceDomain: string;
  invoiceServiceDepartmentID: string;
}

export type CompanyListRes = Pick<CompanyEntity, 'id' | 'name' | 'tenantId'>;

export type CompanyListAdminRes = CompanyListRes & {
  tenant?: string;
  identifier?: string;
};

export type CompanyReq = Pick<
  CompanyEntity,
  | 'name'
  | 'invoiceServiceApiKey'
  | 'invoiceServiceDomain'
  | 'invoiceServiceDepartmentID'
> & {
  tenantId?: string;
};

export type CompanyOption = SelectOption;
