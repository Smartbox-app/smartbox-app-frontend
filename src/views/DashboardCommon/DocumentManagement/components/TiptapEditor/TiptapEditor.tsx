import '@tiptap/extension-table';
import '@tiptap/extension-text-align';
import { useEditor, EditorContent } from '@tiptap/react';
import React, { useEffect, useMemo, useRef } from 'react';
import { EditorRoot, EditorToolbarSticky, EditorWrapper } from '../styled';
import { TiptapMenuBar } from '../TiptapMenuBar';
import { TiptapTableToolbar } from '../TiptapTableToolbar';
import { TiptapTemplateToolbar } from '../TiptapTemplateToolbar';
import { getDocumentEditorExtensions } from 'src/config/tiptap';
import { DocumentType } from 'smartbox-types';

type Props = {
  value: any;
  onChange: (value: any) => void;
  documentType?: DocumentType;
  templateTenantId?: string;
};

export const TiptapEditor = ({
  value,
  onChange,
  documentType,
  templateTenantId,
}: Props) => {
  const isAgreement = documentType === 'agreement';

  const extensions = useMemo(
    () => getDocumentEditorExtensions(isAgreement),
    [isAgreement],
  );
  const isInternalUpdate = useRef(false);

  const editor = useEditor(
    {
      extensions,
      content: value,
      onUpdate({ editor }) {
        isInternalUpdate.current = true;
        onChange(editor.getJSON());
      },
    },
    [isAgreement],
  );

  // Sync only external value changes (e.g. form reset when loading a document).
  useEffect(() => {
    if (!editor || value == null) return;
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  return (
    <EditorRoot>
      <EditorToolbarSticky>
        <TiptapMenuBar editor={editor} />
        {isAgreement ? (
          <TiptapTemplateToolbar
            editor={editor}
            templateTenantId={templateTenantId}
          />
        ) : null}
        {editor ? <TiptapTableToolbar editor={editor} /> : null}
      </EditorToolbarSticky>

      <EditorWrapper>
        <EditorContent editor={editor} />
      </EditorWrapper>
    </EditorRoot>
  );
};
