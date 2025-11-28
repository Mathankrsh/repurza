"use client";

import CharacterCount from "@tiptap/extension-character-count";
import CodeBlock from "@tiptap/extension-code-block";
import Color from "@tiptap/extension-color";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Strike from "@tiptap/extension-strike";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@tiptap/extension-table";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Copy } from "lucide-react";
import { useRef, useState, useImperativeHandle, forwardRef, useEffect, useCallback } from "react";

import { toast } from "sonner";
import TurndownService from "turndown";
import EditorToolbar from "./editor-toolbar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

type BlogEditorProps = {
  content?: string;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
  onSaveExtended?: (data: { html: string; json: unknown }) => void;
  placeholder?: string;
  maxLength?: number;
};

const BlogEditorComponent = function BlogEditor({
  content = "",
  onChange,
  onSave,
  onSaveExtended,
  placeholder = "Start writing your blog post...",
  maxLength = 10_000,
}: BlogEditorProps, ref: React.ForwardedRef<{ handleSave: () => void }>) {
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [_showFloatingToolbar, setShowFloatingToolbar] = useState(false);
  const [_selectionCoords, setSelectionCoords] = useState({ x: 0, y: 0 });
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        paragraph: {
          HTMLAttributes: {
            class: "leading-7 [&:not(:first-child)]:mt-6",
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: "list-disc list-inside",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal list-inside",
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: "mt-6 border-l-2 pl-6 italic",
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class:
              "relative rounded bg-muted px-3.5 py-2 font-mono text-sm font-semibold",
          },
        },
        horizontalRule: {
          HTMLAttributes: {
            class: "my-4 hr",
          },
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit: maxLength,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      CodeBlock,
      HorizontalRule,
      Strike,
      Subscript,
      Superscript,
      Color,
      TextStyle,
      TaskList.configure({
        HTMLAttributes: {
          class: "task-list",
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: "task-item",
        },
        nested: true,
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
      updateFloatingToolbar(editor);
    },
    onSelectionUpdate: ({ editor }) => {
      updateFloatingToolbar(editor);
    },
    onFocus: ({ editor }) => {
      updateFloatingToolbar(editor);
    },
    editorProps: {
      attributes: {
        class: "ProseMirror focus:outline-none min-h-[400px] p-4", // Simplified initial class
      },
    },
  });

  const updateFloatingToolbar = (editor: Editor) => {
    if (!(editorRef.current && toolbarRef.current)) {
      return;
    }

    const { from, to } = editor.state.selection;

    if (from === to) {
      // No text selected
      setShowFloatingToolbar(false);
      return;
    }

    // Get the selection coordinates
    const coords = editor.view.coordsAtPos(from);
    const containerCoords = editorRef.current.getBoundingClientRect();

    setSelectionCoords({
      x: coords.left - containerCoords.left + (coords.right - coords.left) / 2,
      y: coords.top - containerCoords.top - 60,
    });
    setShowFloatingToolbar(true);
  };

  const handleSave = () => {
    const html = editor?.getHTML() || "";
    const json = editor?.getJSON() as unknown;
    onSaveExtended?.({ html, json });
    onSave?.(html);
  };

  // Auto-save functionality
  useEffect(() => {
    if (!editor || !onSaveExtended) return;

    let saveTimeout: NodeJS.Timeout;
    
    const handleUpdate = () => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(async () => {
        const html = editor.getHTML() || "";
        const json = editor.getJSON() as unknown;
        setIsAutoSaving(true);
        try {
          await onSaveExtended({ html, json });
        } finally {
          setTimeout(() => setIsAutoSaving(false), 1000);
        }
      }, 2000); // Auto-save after 2 seconds of inactivity
    };

    editor.on('update', handleUpdate);
    
    return () => {
      clearTimeout(saveTimeout);
      editor.off('update', handleUpdate);
    };
  }, [editor, onSaveExtended]);

  

  // Expose save method to parent component via ref
  useImperativeHandle(ref, () => ({
    handleSave
  }));

  if (!editor) {
    return <div>Loading editor...</div>;
  }

return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-lg border bg-background">
        {/* Main Toolbar */}
        <EditorToolbar 
          editor={editor} 
          onSave={handleSave}
          isSaving={isAutoSaving}
          saveStatus={isAutoSaving ? 'idle' : 'idle'}
        />

        {/* Editor Content */}
        <div className="min-h-[400px] p-6 w-full" ref={editorRef}>
          <EditorContent
            className="typography focus:outline-none w-full"
            editor={editor}
          />
        </div>
      </div>
    </div>
  );
};

const BlogEditor = forwardRef(BlogEditorComponent);
BlogEditor.displayName = "BlogEditor";

export default BlogEditor;
