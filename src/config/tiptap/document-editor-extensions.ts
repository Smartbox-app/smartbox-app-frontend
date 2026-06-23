import type { Extensions } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { TextStyleKit } from '@tiptap/extension-text-style';
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from '@tiptap/extension-table';
import { TemplateVariable } from './template-variable';
import { TemplateExpression } from './template-expression';
import { TemplateConditionalBranch } from './template-conditional-branch';
import { TemplateConditional } from './template-conditional';

const basicDocumentEditorExtensions: Extensions = [
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  TextStyleKit,
  StarterKit,
];

const agreementTemplateExtensions: Extensions = [
  TemplateVariable,
  TemplateExpression,
  TemplateConditionalBranch,
  TemplateConditional,
];

export const getDocumentEditorExtensions = (
  includeTemplateBlocks = false,
): Extensions => [
  ...basicDocumentEditorExtensions,
  ...(includeTemplateBlocks ? agreementTemplateExtensions : []),
];
