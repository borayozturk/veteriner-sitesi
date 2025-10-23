import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  FaBold, FaItalic, FaUnderline, FaListUl, FaListOl,
  FaHeading, FaQuoteLeft, FaCode, FaUndo, FaRedo
} from 'react-icons/fa';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1 bg-gray-50 rounded-t-xl">
      {/* Headings */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('heading', { level: 1 }) ? 'bg-purple-100 text-purple-600' : 'text-gray-700'
        }`}
        title="Başlık 1"
      >
        <FaHeading className="text-xl" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('heading', { level: 2 }) ? 'bg-purple-100 text-purple-600' : 'text-gray-700'
        }`}
        title="Başlık 2"
      >
        <FaHeading className="text-lg" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('heading', { level: 3 }) ? 'bg-purple-100 text-purple-600' : 'text-gray-700'
        }`}
        title="Başlık 3"
      >
        <FaHeading className="text-base" />
      </button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      {/* Text Formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('bold') ? 'bg-purple-100 text-purple-600' : 'text-gray-700'
        }`}
        title="Kalın"
      >
        <FaBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('italic') ? 'bg-purple-100 text-purple-600' : 'text-gray-700'
        }`}
        title="İtalik"
      >
        <FaItalic />
      </button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('bulletList') ? 'bg-purple-100 text-purple-600' : 'text-gray-700'
        }`}
        title="Madde İşaretli Liste"
      >
        <FaListUl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('orderedList') ? 'bg-purple-100 text-purple-600' : 'text-gray-700'
        }`}
        title="Numaralı Liste"
      >
        <FaListOl />
      </button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      {/* Blockquote */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('blockquote') ? 'bg-purple-100 text-purple-600' : 'text-gray-700'
        }`}
        title="Alıntı"
      >
        <FaQuoteLeft />
      </button>

      {/* Code Block */}
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded hover:bg-gray-200 transition-colors ${
          editor.isActive('codeBlock') ? 'bg-purple-100 text-purple-600' : 'text-gray-700'
        }`}
        title="Kod Bloğu"
      >
        <FaCode />
      </button>

      <div className="w-px h-8 bg-gray-300 mx-1" />

      {/* Undo/Redo */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
        title="Geri Al"
      >
        <FaUndo />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
        title="Yinele"
      >
        <FaRedo />
      </button>
    </div>
  );
};

const RichTextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-100 transition-all">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-[400px] focus:outline-none"
      />
    </div>
  );
};

export default RichTextEditor;
