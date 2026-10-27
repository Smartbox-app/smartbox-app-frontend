import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import React from 'react';

import { __ } from 'src/helpers/i18n';

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
      <span className="template-conditional__label">
        {__('application.phrases.condition')}
      </span>
      <input
        className="template-conditional__input"
        value={node.attrs.condition ?? ''}
        onChange={(event) =>
          updateAttributes({ condition: event.target.value })
        }
        placeholder={__('application.phrases.conditionExample')}
        onKeyDown={(event) => event.stopPropagation()}
      />
    </div>
    <NodeViewContent className="template-conditional__content" />
  </NodeViewWrapper>
);
