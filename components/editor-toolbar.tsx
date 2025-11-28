"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  CheckSquare,
  Code,
  Copy,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Palette,
  Quote,
  Save,
  Strikethrough,
  Subscript,
  Superscript,
  Table as TableIcon,
  Underline,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import TurndownService from "turndown";

type EditorToolbarProps = {
  editor: any;
  onSave?: () => void;
  isSaving?: boolean;
  saveStatus?: 'idle' | 'success' | 'error';
};

export default function EditorToolbar({ editor, onSave, isSaving = false, saveStatus = 'idle' }: EditorToolbarProps) {
  if (!editor) {
    return null;
  }

  const handleCopyAsMarkdown = async () => {
    try {
      const html = editor.getHTML() || "";
      const turndownService = new TurndownService({
        headingStyle: 'atx',
        bulletListMarker: '*',
        codeBlockStyle: 'fenced'
      });
      
      const markdown = turndownService.turndown(html);
      
      await navigator.clipboard.writeText(markdown);
      toast.success("Content copied as markdown!");
    } catch (error) {
      console.error("Failed to copy as markdown:", error);
      toast.error("Failed to copy content");
    }
  };

  const setHeading = (level: 1 | 2 | 3) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  const setTextAlign = (alignment: "left" | "center" | "right") => {
    editor.chain().focus().setTextAlign(alignment).run();
  };

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b bg-background p-2">
      {/* Text Formatting Group */}
      <div className="flex items-center gap-1">
        <Button
          className={`h-8 w-8 ${editor.isActive("bold") ? "bg-accent" : ""}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          size="sm"
          title="Bold (Ctrl+B)"
          variant="ghost"
        >
          <Bold className="h-3 w-3" />
        </Button>
        <Button
          className={`h-8 w-8 ${editor.isActive("italic") ? "bg-accent" : ""}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          size="sm"
          title="Italic (Ctrl+I)"
          variant="ghost"
        >
          <Italic className="h-3 w-3" />
        </Button>
        <Button
          className={`h-8 w-8 ${editor.isActive("underline") ? "bg-accent" : ""}`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          size="sm"
          title="Underline (Ctrl+U)"
          variant="ghost"
        >
          <Underline className="h-3 w-3" />
        </Button>
        <Button
          className={`h-8 w-8 ${editor.isActive("strike") ? "bg-accent" : ""}`}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          size="sm"
          title="Strikethrough (Ctrl+Shift+S)"
          variant="ghost"
        >
          <Strikethrough className="h-3 w-3" />
        </Button>
        <Button
          className={`h-8 w-8 ${editor.isActive("subscript") ? "bg-accent" : ""}`}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          size="sm"
          title="Subscript (Ctrl+=)"
          variant="ghost"
        >
          <Subscript className="h-3 w-3" />
        </Button>
        <Button
          className={`h-8 w-8 ${editor.isActive("superscript") ? "bg-accent" : ""}`}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          size="sm"
          title="Superscript (Ctrl+Shift+=)"
          variant="ghost"
        >
          <Superscript className="h-3 w-3" />
        </Button>
      </div>

      <Separator className="h-6" orientation="vertical" />

      {/* Heading Group */}
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className={`h-8 w-8 ${editor.isActive("heading") ? "bg-accent" : ""}`}
              size="sm"
              title="Heading"
              variant="ghost"
            >
              <Heading1 className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setHeading(1)}>
              <Heading1 className="mr-2 h-4 w-4" />
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setHeading(2)}>
              <Heading2 className="mr-2 h-4 w-4" />
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setHeading(3)}>
              <Heading3 className="mr-2 h-4 w-4" />
              Heading 3
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Separator className="h-6" orientation="vertical" />

      {/* Lists Group */}
      <div className="flex items-center gap-1">
        <Button
          className={`h-8 w-8 ${editor.isActive("bulletList") ? "bg-accent" : ""}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          size="sm"
          title="Bullet List (Ctrl+Shift+8)"
          variant="ghost"
        >
          <List className="h-3 w-3" />
        </Button>
        <Button
          className={`h-8 w-8 ${editor.isActive("orderedList") ? "bg-accent" : ""}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          size="sm"
          title="Numbered List (Ctrl+Shift+7)"
          variant="ghost"
        >
          <ListOrdered className="h-3 w-3" />
        </Button>
        <Button
          className={`h-8 w-8 ${editor.isActive("taskList") ? "bg-accent" : ""}`}
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          size="sm"
          title="Task List (Ctrl+Shift+T)"
          variant="ghost"
        >
          <CheckSquare className="h-3 w-3" />
        </Button>
      </div>

      <Separator className="h-6" orientation="vertical" />

      {/* Alignment Group */}
      <div className="flex items-center gap-1">
        <Button
          className={`h-8 w-8 ${editor.isActive({ textAlign: "left" }) ? "bg-accent" : ""}`}
          onClick={() => setTextAlign("left")}
          size="sm"
          title="Align Left"
          variant="ghost"
        >
          <AlignLeft className="h-3 w-3" />
        </Button>
        <Button
          className={`h-8 w-8 ${editor.isActive({ textAlign: "center" }) ? "bg-accent" : ""}`}
          onClick={() => setTextAlign("center")}
          size="sm"
          title="Align Center"
          variant="ghost"
        >
          <AlignCenter className="h-3 w-3" />
        </Button>
        <Button
          className={`h-8 w-8 ${editor.isActive({ textAlign: "right" }) ? "bg-accent" : ""}`}
          onClick={() => setTextAlign("right")}
          size="sm"
          title="Align Right"
          variant="ghost"
        >
          <AlignRight className="h-3 w-3" />
        </Button>
      </div>

      <Separator className="h-6" orientation="vertical" />

      {/* Elements Group */}
      <div className="flex items-center gap-1">
        <Button
          className={`h-8 w-8 ${editor.isActive("blockquote") ? "bg-accent" : ""}`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          size="sm"
          title="Quote (Ctrl+Shift+9)"
          variant="ghost"
        >
          <Quote className="h-3 w-3" />
        </Button>
        <Button
          className={`h-8 w-8 ${editor.isActive("codeBlock") ? "bg-accent" : ""}`}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          size="sm"
          title="Code Block (Ctrl+Shift+C)"
          variant="ghost"
        >
          <Code className="h-3 w-3" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          size="sm"
          title="Horizontal Rule"
          variant="ghost"
        >
          <Minus className="h-3 w-3" />
        </Button>
      </div>

      <Separator className="h-6" orientation="vertical" />

      {/* Color Picker */}
      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="h-8 w-8"
              size="sm"
              title="Text Color"
              variant="ghost"
            >
              <Palette className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setColor("#000000")}>
              <div className="mr-2 h-4 w-4 rounded bg-black" />
              Black
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setColor("#ef4444")}>
              <div className="mr-2 h-4 w-4 rounded bg-red-500" />
              Red
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setColor("#3b82f6")}>
              <div className="mr-2 h-4 w-4 rounded bg-blue-500" />
              Blue
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setColor("#10b981")}>
              <div className="mr-2 h-4 w-4 rounded bg-green-500" />
              Green
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setColor("#f59e0b")}>
              <div className="mr-2 h-4 w-4 rounded bg-amber-500" />
              Orange
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setColor("#8b5cf6")}>
              <div className="mr-2 h-4 w-4 rounded bg-violet-500" />
              Purple
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Separator className="h-6" orientation="vertical" />

      {/* Media & Tables */}
      <div className="flex items-center gap-1">
        <Button
          className="h-8 w-8"
          onClick={addImage}
          size="sm"
          title="Insert Image"
          variant="ghost"
        >
          <ImageIcon className="h-3 w-3" />
        </Button>
        <Button
          className="h-8 w-8"
          onClick={addTable}
          size="sm"
          title="Insert Table"
          variant="ghost"
        >
          <TableIcon className="h-3 w-3" />
        </Button>
      </div>

      <Separator className="h-6" orientation="vertical" />

      {/* Link Button */}
      <div className="flex items-center gap-1">
        <Button
          className={`h-8 w-8 ${editor.isActive("link") ? "bg-accent" : ""}`}
          onClick={() => {
            const url = window.prompt("Enter URL:");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          size="sm"
          title="Add Link"
          variant="ghost"
        >
          <LinkIcon className="h-3 w-3" />
        </Button>
        {editor.isActive("link") && (
          <Button
            className="h-8 w-8"
            onClick={() => editor.chain().focus().unsetLink().run()}
            size="sm"
            title="Remove Link"
            variant="ghost"
          >
            ×
          </Button>
        )}
      </div>

      <div className="flex-1" />

      {/* Undo/Redo Group */}
      <div className="flex items-center gap-1">
        <Button
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
          size="sm"
          title="Undo (Ctrl+Z)"
          variant="ghost"
        >
          <span className="flex h-3 w-3 items-center justify-center">↶</span>
        </Button>
        <Button
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
          size="sm"
          title="Redo (Ctrl+Y)"
          variant="ghost"
        >
          <span className="flex h-3 w-3 items-center justify-center">↷</span>
        </Button>
      </div>

      <Separator className="h-6" orientation="vertical" />

      {/* Copy & Save Buttons */}
      <div className="flex items-center gap-1">
        <Button
          onClick={handleCopyAsMarkdown}
          size="sm"
          title="Copy as Markdown"
          variant="ghost"
        >
          <Copy className="h-3 w-3" />
        </Button>
        <Button
          onClick={onSave}
          disabled={isSaving}
          size="sm"
          title="Save (Ctrl+S)"
          variant={saveStatus === 'success' ? 'default' : saveStatus === 'error' ? 'destructive' : 'default'}
        >
          {isSaving ? (
            <>
              <Save className="h-3 w-3 animate-spin" />
            </>
          ) : saveStatus === 'success' ? (
            <>
              <Save className="h-3 w-3" />
            </>
          ) : saveStatus === 'error' ? (
            <>
              <Save className="h-3 w-3" />
            </>
          ) : (
            <>
              <Save className="h-3 w-3" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
