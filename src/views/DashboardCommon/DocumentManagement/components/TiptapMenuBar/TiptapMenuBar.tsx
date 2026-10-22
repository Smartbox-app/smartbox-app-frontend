import React from 'react';
import { Editor } from '@tiptap/react';
import { __ } from 'src/helpers/i18n';
import { Toolbar, Button } from '../styled';

export const TiptapMenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const setLink = () => {
    const url = prompt(__('application.phrases.enterUrl'));
    if (!url) return;

    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <Toolbar>
      {/* TEKST */}
      <Button
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </Button>

      <Button
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </Button>

      <Button
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        U
      </Button>

      {/* NAGŁÓWKI */}
      <Button onClick={() => editor.chain().focus().setParagraph().run()}>
        P
      </Button>

      <Button
        active={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </Button>

      <Button
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </Button>

      {/* LISTY */}
      <Button
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        •
      </Button>

      <Button
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1.
      </Button>

      {/* ALIGN */}
      <Button onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        ⬅
      </Button>

      <Button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        ⬍
      </Button>

      <Button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        ➡
      </Button>

      {/* LINK */}
      <Button active={editor.isActive('link')} onClick={setLink}>
        Link
      </Button>

      <Button onClick={() => editor.chain().focus().unsetLink().run()}>
        ❌
      </Button>

      {/* TABELA */}
      <Button
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({
              rows: 3,
              cols: 3,
              withHeaderRow: true,
            })
            .run()
        }
      >
        {__('application.phrases.insertTable')}
      </Button>

      {/* HISTORIA */}
      <Button onClick={() => editor.chain().focus().undo().run()}>↺</Button>

      <Button onClick={() => editor.chain().focus().redo().run()}>↻</Button>
    </Toolbar>
  );
};
