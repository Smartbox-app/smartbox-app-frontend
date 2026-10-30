import type { Extensions } from '@tiptap/core';
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from '@tiptap/extension-table';
import { TextStyleKit } from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';

import { TemplateConditional } from 'src/config/tiptap/template-conditional';
import { TemplateConditionalBranch } from 'src/config/tiptap/template-conditional-branch';
import { TemplateExpression } from 'src/config/tiptap/template-expression';
import { TemplateVariable } from 'src/config/tiptap/template-variable';

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
