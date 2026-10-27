import '@tiptap/extension-table';
import '@tiptap/extension-text-align';
import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect, useMemo, useRef } from 'react';

import { DocumentType, TiptapDocument } from 'smartbox-types';
import { getDocumentEditorExtensions } from 'src/config/tiptap';
import { EditorRoot, EditorToolbarSticky, EditorWrapper } from 'src/views/DashboardCommon/DocumentManagement/components/styled';
import { TiptapMenuBar } from 'src/views/DashboardCommon/DocumentManagement/components/TiptapMenuBar';
import { TiptapTableToolbar } from 'src/views/DashboardCommon/DocumentManagement/components/TiptapTableToolbar';
import { TiptapTemplateToolbar } from 'src/views/DashboardCommon/DocumentManagement/components/TiptapTemplateToolbar';

type Props = {
  value: TiptapDocument;
  onChange: (value: TiptapDocument) => void;
  documentType?: DocumentType;
  templateTenantId?: string;
  templateStockId?: string | null;
};

export const TiptapEditor = ({
  value,
  onChange,
  documentType,
  templateTenantId,
  templateStockId,
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
            templateStockId={templateStockId}
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
