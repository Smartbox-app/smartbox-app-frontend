import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { TemplateVariableNodeView } from 'src/config/tiptap/TemplateVariableNodeView';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    templateVariable: {
      insertTemplateVariable: (name: string) => ReturnType;
    };
  }
}

export const TemplateVariable = Node.create({
  name: 'templateVariable',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      name: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-template-variable'),
        renderHTML: (attributes) => ({
          'data-template-variable': attributes.name,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-template-variable]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-template-variable': node.attrs.name,
        class: 'template-variable',
      }),
      `{{${node.attrs.name}}}`,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TemplateVariableNodeView);
  },

  addCommands() {
    return {
      insertTemplateVariable:
        (name: string) =>
        ({ chain }) =>
          chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: { name },
            })
            .run(),
    };
  },
});
