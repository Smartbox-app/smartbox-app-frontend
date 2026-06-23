import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';

export const TemplateVariableNodeView = ({
  node,
  selected,
}: NodeViewProps) => (
  <NodeViewWrapper
    as="span"
    className={`template-variable${selected ? ' template-variable--selected' : ''}`}
    data-template-variable={node.attrs.name}
  >
    <span className="template-variable__label" contentEditable={false}>
      {`{{${node.attrs.name}}}`}
    </span>
  </NodeViewWrapper>
);
