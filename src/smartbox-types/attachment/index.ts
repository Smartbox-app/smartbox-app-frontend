import { TenantEntity } from "../tenant";

export type AttachmentEntity = {
  id: string;
  description: string;
  name: string;
  file: string;
  showInFooter: boolean;
  tenantId: string;
  tenant: TenantEntity;
}

export type AttachmentRes =  Pick<AttachmentEntity, 'id' | 'name' | 'description'>;

export type AttachmentListRes = Pick<AttachmentEntity, 'id' | 'name'>;

export type AttachmentListAdminRes = Pick<AttachmentEntity, 'id' | 'name'> & { tenant: string };

export type AttachmentFormDataReq = Pick<
  AttachmentEntity,
  | 'name'
  | 'description'
> & {
  showInFooter: string;
  tenantId?: string;
};

export type AttachmentReq = Pick<
  AttachmentEntity,
  | 'name'
  | 'description'
  | 'showInFooter'
> & {
    tenantId?: string
}