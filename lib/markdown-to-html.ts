import { remark } from "remark";
import html from "remark-html";

// Regex to match frontmatter (YAML metadata between --- markers)
const FRONTMATTER_REGEX = /^---\s*\n[\s\S]*?\n---\s*\n/;

// Regex to match markdown code block markers at the beginning
const CODE_BLOCK_REGEX = /^```(?:md|mdx)?\s*\n/;

function stripFrontmatter(content: string): string {
  // Remove frontmatter (YAML metadata between --- markers)
  let cleanedContent = content.replace(FRONTMATTER_REGEX, "");

  // Remove markdown code block markers at the beginning
  cleanedContent = cleanedContent.replace(CODE_BLOCK_REGEX, "");

  return cleanedContent.trim();
}

export default async function markdownToHtml(markdown: string) {
  // Remove frontmatter before processing
  const cleanMarkdown = stripFrontmatter(markdown);
  const result = await remark().use(html).process(cleanMarkdown);
  return result.toString();
}

/**
 * Synchronous version of markdownToHtml for client-side usage
 * Note: This is a simplified version that handles common markdown patterns
 */
export function markdownToHtmlSync(markdown: string): string {
  if (!markdown) {
    return "";
  }

  // Remove frontmatter before processing
  const cleanMarkdown = stripFrontmatter(markdown);

  try {
    // Split into lines for better processing
    const lines = cleanMarkdown.split("\n");
    let html = "";
    let inParagraph = false;
    let inList = false;
    let listType = ""; // 'ul' or 'ol'
    let listItems: string[] = [];

    const flushParagraph = () => {
      if (inParagraph) {
        html += "</p>\n";
        inParagraph = false;
      }
    };

    const flushList = () => {
      if (inList && listItems.length > 0) {
        html += `<${listType}>\n${listItems.join("")}\n</${listType}>\n`;
        listItems = [];
        inList = false;
        listType = "";
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines
      if (!line) {
        flushParagraph();
        continue;
      }

      // Handle headers
      if (line.startsWith("#")) {
        flushParagraph();
        flushList();
        const match = line.match(/^(#{1,6})\s+(.+)$/);
        if (match) {
          const level = match[1].length;
          const text = match[2];
          html += `<h${level}>${text}</h${level}>\n`;
        }
        continue;
      }

      // Handle code blocks
      if (line.startsWith("```")) {
        flushParagraph();
        flushList();
        const lang = line.substring(3).trim();
        let codeContent = "";
        i++;

        // Find the end of the code block
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeContent += `${lines[i]}\n`;
          i++;
        }

        const langClass = lang ? ` class="language-${lang}"` : "";
        html += `<pre><code${langClass}>${codeContent.trim()}</code></pre>\n`;
        continue;
      }

      // Handle blockquotes
      if (line.startsWith(">")) {
        flushParagraph();
        flushList();
        const quoteText = line.substring(1).trim();
        html += `<blockquote>${quoteText}</blockquote>\n`;
        continue;
      }

      // Handle unordered lists
      if (line.match(/^[-*+]\s+/)) {
        flushParagraph();
        if (!inList || listType !== "ul") {
          flushList();
          inList = true;
          listType = "ul";
        }
        const itemText = line.replace(/^[-*+]\s+/, "");
        listItems.push(`<li>${itemText}</li>\n`);
        continue;
      }

      // Handle ordered lists
      if (line.match(/^\d+\.\s+/)) {
        flushParagraph();
        if (!inList || listType !== "ol") {
          flushList();
          inList = true;
          listType = "ol";
        }
        const itemText = line.replace(/^\d+\.\s+/, "");
        listItems.push(`<li>${itemText}</li>\n`);
        continue;
      }

      // Handle regular paragraphs
      flushList();
      if (inParagraph) {
        html += " ";
      } else {
        html += "<p>";
        inParagraph = true;
      }

      // Process inline formatting
      let processedLine = line;

      // Handle inline code
      processedLine = processedLine.replace(/`([^`]+)`/g, "<code>$1</code>");

      // Handle bold and italic
      processedLine = processedLine.replace(
        /\*\*\*([^*]+)\*\*\*/g,
        "<strong><em>$1</em></strong>"
      );
      processedLine = processedLine.replace(
        /\*\*([^*]+)\*\*/g,
        "<strong>$1</strong>"
      );
      processedLine = processedLine.replace(/\*([^*]+)\*/g, "<em>$1</em>");

      // Handle strikethrough
      processedLine = processedLine.replace(/~~([^~]+)~~/g, "<del>$1</del>");

      // Handle links
      processedLine = processedLine.replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2">$1</a>'
      );

      html += processedLine;
    }

    // Flush any remaining content
    flushParagraph();
    flushList();

    return html.trim();
  } catch (_error) {
    return cleanMarkdown;
  }
}
