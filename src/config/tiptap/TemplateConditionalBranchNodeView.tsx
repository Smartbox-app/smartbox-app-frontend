import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';
import React from 'react';

import { __ } from 'src/helpers/i18n';

export const TemplateConditionalBranchNodeView = ({ node }: NodeViewProps) => {
  const branch = node.attrs.branch === 'else' ? 'else' : 'if';
  const label =
    branch === 'else'
      ? __('application.phrases.otherwise')
      : __('application.phrases.ifMet');

  return (
    <NodeViewWrapper
      as="div"
      className="template-conditional-branch"
      data-branch={branch}
    >
      <div
        className="template-conditional-branch__label"
        contentEditable={false}
      >
        {label}
      </div>
      <NodeViewContent className="template-conditional-branch__content" />
    </NodeViewWrapper>
  );
};
