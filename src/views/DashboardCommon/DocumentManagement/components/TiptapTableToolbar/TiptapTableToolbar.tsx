import { Editor, useEditorState } from '@tiptap/react';
import React from 'react';

import { __ } from 'src/helpers/i18n';
import { TableToolbarWrapper, Button } from 'src/views/DashboardCommon/DocumentManagement/components/styled';

export const TiptapTableToolbar = ({ editor }: { editor: Editor }) => {
  const { isTable } = useEditorState({
    editor,
    selector: ({ editor }) => ({
      isTable: editor.isActive('table'),
    }),
  });

  if (!isTable) return null;

  return (
    <TableToolbarWrapper>
      <Button onClick={() => editor.chain().focus().addRowAfter().run()}>
        {__('application.phrases.addRow')}
      </Button>

      <Button onClick={() => editor.chain().focus().addColumnAfter().run()}>
        {__('application.phrases.addColumn')}
      </Button>

      <Button onClick={() => editor.chain().focus().deleteRow().run()}>
        {__('application.phrases.deleteRow')}
      </Button>

      <Button onClick={() => editor.chain().focus().deleteColumn().run()}>
        {__('application.phrases.deleteColumn')}
      </Button>

      <Button onClick={() => editor.chain().focus().mergeCells().run()}>
        {__('application.phrases.mergeCells')}
      </Button>

      <Button onClick={() => editor.chain().focus().splitCell().run()}>
        {__('application.phrases.splitCell')}
      </Button>

      <Button onClick={() => editor.chain().focus().deleteTable().run()}>
        {__('application.phrases.deleteTable')}
      </Button>
    </TableToolbarWrapper>
  );
};
