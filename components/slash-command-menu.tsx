// Placeholder for slash command functionality
// TODO: Implement proper slash command menu
import { Extension } from "@tiptap/core";

export const SlashCommand = Extension.create({
  name: "slashCommand",
  addKeyboardShortcuts() {
    return {
      "/": () => {
        // Placeholder for slash command functionality
        return true;
      },
    };
  },
});
