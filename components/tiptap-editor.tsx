"use client";

import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Undo,
} from "lucide-react";
import { Button } from "./ui/button";

export default function TiptapEditor({
  content,
  onChange,
  editable = true,
}: {
  content: string;
  onChange: (content: string) => void;
  editable?: boolean;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your blog post...",
      }),
      CharacterCount.configure({
        limit: 50_000,
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="prose prose-sm max-w-none">
      <div className="flex flex-wrap gap-2 border-b p-2">
        <Button
          className={editor.isActive("bold") ? "bg-gray-200" : ""}
          onClick={() => editor.chain().focus().toggleBold().run()}
          size="sm"
          variant="ghost"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          className={editor.isActive("italic") ? "bg-gray-200" : ""}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          size="sm"
          variant="ghost"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          className={editor.isActive("bulletList") ? "bg-gray-200" : ""}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          size="sm"
          variant="ghost"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          className={editor.isActive("orderedList") ? "bg-gray-200" : ""}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          size="sm"
          variant="ghost"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          className={editor.isActive("blockquote") ? "bg-gray-200" : ""}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          size="sm"
          variant="ghost"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <Button
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
          size="sm"
          variant="ghost"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
          size="sm"
          variant="ghost"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent
        className="min-h-[400px] p-4 focus:outline-none"
        editor={editor}
      />
    </div>
  );
}
