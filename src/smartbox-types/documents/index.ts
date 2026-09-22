export type TiptapNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
};

export type TiptapDocument = {
  type: 'doc';
  content: TiptapNode[];
};

export type DocumentType = 'privacy-policy' | 'rules' | 'agreement';

export type DocumentEntity = {
  id: string;
  content: TiptapDocument;
  createdAt: Date;
  updatedAt: Date;
  type: DocumentType;
  tenantId: string;
  stockId: string | null;
  companyId: string | null;
  isDraft?: boolean;
};

export type DocumentListRes = Pick<
  DocumentEntity,
  'id' | 'type' | 'updatedAt' | 'isDraft' | 'stockId' | 'companyId'
> & {
  identifier?: string;
  tenantId?: string;
  stockName?: string | null;
  companyName?: string | null;
};

export type DocumentRes = Pick<
  DocumentEntity,
  | 'id'
  | 'type'
  | 'content'
  | 'updatedAt'
  | 'tenantId'
  | 'stockId'
  | 'companyId'
  | 'isDraft'
>;

export type DocumentHtmlRes = {
  html: string;
};

export type AgreementAddonTemplate = {
  slug: string;
  variant: string | null;
  price: number | null;
};

export type AgreementTemplateInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  cost?: string;
  startAt?: string;
  finishAt?: string;
  city?: string;
  street?: string;
  postCode?: string;
  date?: string;
  stockName?: string;
  stockAddress?: string;
  size?: string;
  area?: string;
  boxNumber?: string;
  mailToSendInvoice?: string;
  addons?: string | AgreementAddonTemplate[];
  isCompany?: string | boolean;
  nip?: string;
  companyName?: string;
  companyPostCode?: string;
  companyStreet?: string;
  companyCity?: string;
  birthDate?: string;
};