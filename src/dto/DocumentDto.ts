import { IsIn, IsObject } from 'class-validator';
import { __ } from 'src/helpers/i18n';
import { TiptapDocument, DocumentType } from '../smartbox-types';

export const DOCUMENT_TYPES: DocumentType[] = ['privacy-policy'];

export class DocumentDto {
  @IsObject()
  content: TiptapDocument;

  @IsIn(DOCUMENT_TYPES)
  type: DocumentType;

  tenantId: string;
}
