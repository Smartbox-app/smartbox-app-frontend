import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import { __ } from 'src/helpers/i18n';

export const TemplateExpressionNodeView = ({
  node,
  updateAttributes,
  selected,
}: NodeViewProps) => (
  <NodeViewWrapper
    as="span"
    className={`template-expression${selected ? ' template-expression--selected' : ''}`}
    data-template-expression={node.attrs.expression}
  >
    <span className="template-expression__prefix" contentEditable={false}>
      =
    </span>
    <input
      className="template-expression__input"
      value={node.attrs.expression ?? ''}
      onChange={(event) => updateAttributes({ expression: event.target.value })}
      placeholder={__('application.phrases.expressionExample')}
      onKeyDown={(event) => event.stopPropagation()}
    />
  </NodeViewWrapper>
);
