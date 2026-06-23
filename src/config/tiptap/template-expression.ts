import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { TemplateExpressionNodeView } from './TemplateExpressionNodeView';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    templateExpression: {
      insertTemplateExpression: (expression?: string) => ReturnType;
    };
  }
}

export const TemplateExpression = Node.create({
  name: 'templateExpression',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      expression: {
        default: '',
        parseHTML: (element) =>
          element.getAttribute('data-template-expression') ?? '',
        renderHTML: (attributes) => ({
          'data-template-expression': attributes.expression,
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-template-expression]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-template-expression': node.attrs.expression,
        class: 'template-expression',
      }),
      `=${node.attrs.expression}`,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TemplateExpressionNodeView);
  },

  addCommands() {
    return {
      insertTemplateExpression:
        (expression = '') =>
        ({ chain }) =>
          chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: { expression },
            })
            .run(),
    };
  },
});
