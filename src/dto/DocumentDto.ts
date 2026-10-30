import { IsIn, IsObject, IsOptional, IsString, ValidateIf } from 'class-validator';

import { TiptapDocument, DocumentType } from 'src/smartbox-types';

export const DOCUMENT_TYPES: DocumentType[] = ['privacy-policy', 'rules', 'agreement'];

export class DocumentDto {
  [key: string]: unknown;

  @IsObject()
  content: TiptapDocument;

  @IsIn(DOCUMENT_TYPES)
  type: DocumentType;

  tenantId?: string;

  @ValidateIf((dto: DocumentDto) => dto.type === 'agreement')
  @IsOptional()
  @IsString()
  stockId?: string | null;

  @ValidateIf((dto: DocumentDto) => dto.type === 'agreement')
  @IsOptional()
  @IsString()
  companyId?: string | null;
}
