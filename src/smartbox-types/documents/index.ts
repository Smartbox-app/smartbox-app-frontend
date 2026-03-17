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

export type DocumentType = 'privacy-policy';

export type DocumentEntity = {
  id: string;
  content: TiptapDocument;
  createdAt: Date;
  updatedAt: Date;
  type: DocumentType;
  tenantId: string;
};

export type DocumentListRes = Pick<DocumentEntity, 'id' | 'type'>

export type DocumentRes = Pick<DocumentEntity, 'id' | 'type' | 'content' | 'updatedAt'>