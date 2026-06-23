import React from 'react';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import type { NodeViewProps } from '@tiptap/react';

export const TemplateConditionalBranchNodeView = ({
  node,
}: NodeViewProps) => {
  const branch = node.attrs.branch === 'else' ? 'else' : 'if';
  const label = branch === 'else' ? 'W przeciwnym razie' : 'Jeśli spełniony';

  return (
    <NodeViewWrapper
      as="div"
      className="template-conditional-branch"
      data-branch={branch}
    >
      <div className="template-conditional-branch__label" contentEditable={false}>
        {label}
      </div>
      <NodeViewContent className="template-conditional-branch__content" />
    </NodeViewWrapper>
  );
};
