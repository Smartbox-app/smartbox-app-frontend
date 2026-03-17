import React from 'react';
import { Editor, useEditorState } from '@tiptap/react';
import { TableToolbarWrapper, Button } from '../styled';

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
        + Wiersz
      </Button>

      <Button onClick={() => editor.chain().focus().addColumnAfter().run()}>
        + Kolumna
      </Button>

      <Button onClick={() => editor.chain().focus().deleteRow().run()}>
        Usuń wiersz
      </Button>

      <Button onClick={() => editor.chain().focus().deleteColumn().run()}>
        Usuń kolumnę
      </Button>

      <Button onClick={() => editor.chain().focus().mergeCells().run()}>
        Scal
      </Button>

      <Button onClick={() => editor.chain().focus().splitCell().run()}>
        Podziel
      </Button>

      <Button onClick={() => editor.chain().focus().deleteTable().run()}>
        Usuń tabelę
      </Button>
    </TableToolbarWrapper>
  );
};
