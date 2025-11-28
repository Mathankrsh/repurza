"use client";

import { ContentEditor } from "@/app/content/[videoId]/content-editor";

// Mock data for testing
const mockVideoData = {
  videoId: "test123",
  blog: {
    id: "test-blog-id",
    slug: "test123-blog",
    title: "Test Blog Post (Blog)",
    content: `# This is a Test H1 Header

## This is a Test H2 Header

### This is a Test H3 Header

This is a regular paragraph with **bold text** and *italic text* and \`inline code\`.

Here's a bullet list:

* First item with **bold text**
* Second item with *italic text*  
* Third item with \`code\`
* Fourth item

Here's a numbered list:

1. First numbered item
2. Second numbered item with **bold**
3. Third numbered item

> This is a blockquote with some important information
> It can span multiple lines

\`\`\`javascript
// This is a code block
function test() {
  console.log("Hello World");
}
\`\`\`

Another paragraph after the code block.`,

    tiptapContent: {},
    contentType: "blog" as const,
    author: "Test Author",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: "test-user-id"
  },
  thread: null
};

export default function TestContentPage() {
  return (
    <div className="min-h-screen bg-background">
      <ContentEditor videoData={mockVideoData} contentType="blog" />
    </div>
  );
}