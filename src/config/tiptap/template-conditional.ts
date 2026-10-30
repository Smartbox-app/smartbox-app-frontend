import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { TemplateConditionalBranch } from 'src/config/tiptap/template-conditional-branch';
import { TemplateConditionalNodeView } from 'src/config/tiptap/TemplateConditionalNodeView';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    templateConditional: {
      insertTemplateConditional: (condition?: string) => ReturnType;
    };
  }
}

export const TemplateConditional = Node.create({
  name: 'templateConditional',
  group: 'block',
  content: 'templateConditionalBranch+',
  defining: true,

  addAttributes() {
    return {
      condition: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-condition') ?? '',
        renderHTML: (attributes) => ({
          'data-condition': attributes.condition,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-template-conditional]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-template-conditional': '',
        'data-condition': node.attrs.condition,
        class: 'template-conditional',
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TemplateConditionalNodeView);
  },

  addCommands() {
    return {
      insertTemplateConditional:
        (condition = '') =>
        ({ chain }) =>
          chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: { condition },
              content: [
                {
                  type: TemplateConditionalBranch.name,
                  attrs: { branch: 'if' },
                  content: [{ type: 'paragraph' }],
                },
                {
                  type: TemplateConditionalBranch.name,
                  attrs: { branch: 'else' },
                  content: [{ type: 'paragraph' }],
                },
              ],
            })
            .run(),
    };
  },
});
