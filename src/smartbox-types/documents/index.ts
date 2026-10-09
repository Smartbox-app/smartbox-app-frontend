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
  isCurrent: boolean;
  isDraft: boolean;
};

export type DocumentListResClient = Pick<
  DocumentEntity,
  'id' | 'type' | 'updatedAt' | 'isDraft' | 'stockId' | 'companyId'
> & {
  stockName?: string | null;
  companyName?: string | null;
};

export type DocumentListResAdmin = DocumentListResClient & {
  identifier?: string;
  tenantId?: string;
  stockName?: string | null;
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
