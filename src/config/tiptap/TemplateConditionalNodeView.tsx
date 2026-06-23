import React from 'react';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';

export const TemplateConditionalNodeView = ({
  node,
  updateAttributes,
  selected,
}: NodeViewProps) => (
  <NodeViewWrapper
    as="div"
    className={`template-conditional${selected ? ' template-conditional--selected' : ''}`}
    data-condition={node.attrs.condition}
  >
    <div className="template-conditional__header" contentEditable={false}>
      <span className="template-conditional__label">Warunek:</span>
      <input
        className="template-conditional__input"
        value={node.attrs.condition ?? ''}
        onChange={(event) =>
          updateAttributes({ condition: event.target.value })
        }
        placeholder="np. isCompany, companyName, nip"
        onKeyDown={(event) => event.stopPropagation()}
      />
    </div>
    <NodeViewContent className="template-conditional__content" />
  </NodeViewWrapper>
);
