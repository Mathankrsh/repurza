"use client";

import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo } from "lucide-react";

interface BlogEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export default function BlogEditor({
  content = "",
  onChange,
  onSave,
  placeholder = "Start writing your blog post...",
  maxLength = 10000,
}: BlogEditorProps) {
  const [isEditing, setIsEditing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit: maxLength,
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[200px] p-4",
      },
    },
  });

  const handleSave = () => {
    onSave?.(editor?.getHTML() || "");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    onChange?.(content);
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="border rounded-lg overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-2 p-3 border-b bg-gray-50 dark:bg-gray-800">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "bg-gray-200 dark:bg-gray-700" : ""}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "bg-gray-200 dark:bg-gray-700" : ""}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "bg-gray-200 dark:bg-gray-700" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "bg-gray-200 dark:bg-gray-700" : ""}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive("blockquote") ? "bg-gray-200 dark:bg-gray-700" : ""}
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
          <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            {editor.storage.characterCount.characters()} / {maxLength}
          </div>
        </div>

        {/* Editor Content */}
        <div className="p-4 min-h-[300px]">
          <EditorContent
            editor={editor}
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 p-3 border-t bg-gray-50 dark:bg-gray-800">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}