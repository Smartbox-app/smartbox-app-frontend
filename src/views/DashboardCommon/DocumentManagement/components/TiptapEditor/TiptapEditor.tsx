import '@tiptap/extension-table';
import '@tiptap/extension-text-align';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyleKit } from '@tiptap/extension-text-style';
import React, { useEffect } from 'react';
import { EditorWrapper } from '../styled';
import { TiptapMenuBar } from '../TiptapMenuBar';
import { TiptapTableToolbar } from '../TiptapTableToolbar';
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from '@tiptap/extension-table';

type Props = {
  value: any;
  onChange: (value: any) => void;
};

export const TiptapEditor = ({ value, onChange }: Props) => {
  const editor = useEditor({
    extensions: [
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextStyleKit,
      StarterKit,
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getJSON());
    },
  });

  console.log('EDITOR', editor);

  // Sync external value (important for reset/edit mode)
  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(value);
  }, [value]);

  return (
    <div>
      <TiptapMenuBar editor={editor} />
      <TiptapTableToolbar editor={editor} />

      <EditorWrapper>
        <EditorContent editor={editor} />
      </EditorWrapper>
    </div>
  );
};
