import { Extension } from "@tiptap/core";

export const MarkdownShortcuts = Extension.create({
  name: "markdownShortcuts",

  addKeyboardShortcuts() {
    return {
      // Standard markdown shortcuts
      "Mod-b": () => this.editor.commands.toggleBold(),
      "Mod-i": () => this.editor.commands.toggleItalic(),
      "Mod-u": () => this.editor.commands.toggleUnderline(),
      "Mod-Shift-s": () => this.editor.commands.toggleStrike(),

      // Headings shortcuts
      "Mod-1": () => this.editor.commands.toggleHeading({ level: 1 }),
      "Mod-2": () => this.editor.commands.toggleHeading({ level: 2 }),
      "Mod-3": () => this.editor.commands.toggleHeading({ level: 3 }),

      // Lists
      "Mod-Shift-8": () => this.editor.commands.toggleBulletList(),
      "Mod-Shift-7": () => this.editor.commands.toggleOrderedList(),

      // Block elements
      "Mod-Shift-9": () => this.editor.commands.toggleBlockquote(),
      "Mod-Shift-C": () => this.editor.commands.toggleCodeBlock(),

      // Other
      "Mod-Shift-H": () => this.editor.commands.setHorizontalRule(),

      // Subscript/Superscript
      "Mod-=": () => this.editor.commands.toggleSubscript(),
      "Mod-Shift-=": () => this.editor.commands.toggleSuperscript(),

      // Task list
      "Mod-Shift-T": () => this.editor.commands.toggleTaskList(),
    };
  },
});
