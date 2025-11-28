/**
 * Utility functions for content type detection and processing
 */

/**
 * Detects if content is HTML or markdown
 * @param content - The content to check
 * @returns true if content appears to be HTML, false if markdown
 */
export function isHtmlContent(content: string): boolean {
  if (!content || typeof content !== "string") {
    return false;
  }

  const trimmed = content.trim();

  // Check if it starts with HTML tag
  if (trimmed.startsWith("<")) {
    return true;
  }

  // Strong indicators of markdown content - if these patterns are present, it's likely markdown
  const markdownPatterns = [
    /^#{1,6}\s+/m, // Headers (# ## ### etc.)
    /^\*{1,2}[^*]+\*{1,2}/m, // Bold/italic with asterisks
    /^_[^_]+_/m, // Italic with underscores
    /^\[([^\]]+)\]\(([^)]+)\)/m, // Links [text](url)
    /^```[\s\S]*?```/m, // Code blocks
    /^`[^`]+`/m, // Inline code
    /^\d+\.\s+/m, // Ordered lists
    /^[-*+]\s+/m, // Unordered lists
    /^>\s+/m, // Blockquotes
  ];

  // If we find strong markdown patterns, it's markdown
  if (markdownPatterns.some((pattern) => pattern.test(trimmed))) {
    return false;
  }

  // Check for common HTML patterns (but be more strict)
  const htmlPatterns = [
    /<p[^>]*>/i, // Paragraph tags
    /<div[^>]*>/i, // Div tags
    /<h[1-6][^>]*>/i, // Heading tags
    /<strong[^>]*>/i, // Strong tags
    /<em[^>]*>/i, // Em tags
    /<a[^>]*href=/i, // Anchor tags with href
  ];

  // If we find multiple HTML tags (more than 3), it's likely HTML content
  const tagMatches = trimmed.match(/<[^>]+>/g);
  if (tagMatches && tagMatches.length > 3) {
    return true;
  }

  // Check for specific HTML structures
  return htmlPatterns.some((pattern) => pattern.test(trimmed));
}

/**
 * Determines if content should be processed as markdown or displayed as HTML
 * @param content - The content to check
 * @returns 'html' if content is HTML, 'markdown' if content is markdown
 */
export function getContentType(content: string): "html" | "markdown" {
  return isHtmlContent(content) ? "html" : "markdown";
}
