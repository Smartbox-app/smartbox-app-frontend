import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TemplateConditionalBranchNodeView } from './TemplateConditionalBranchNodeView';

export const TemplateConditionalBranch = Node.create({
  name: 'templateConditionalBranch',
  content: 'block+',
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      branch: {
        default: 'if',
        parseHTML: (element) => element.getAttribute('data-branch') ?? 'if',
        renderHTML: (attributes) => ({
          'data-branch': attributes.branch,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-template-conditional-branch]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-template-conditional-branch': '',
        'data-branch': node.attrs.branch,
        class: 'template-conditional-branch',
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TemplateConditionalBranchNodeView);
  },
});
