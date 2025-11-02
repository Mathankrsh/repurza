"use client";

import BlogEditor from "@/components/blog-editor";

export default function BlogEditorClient({ content }: { content: string }) {
  return (
    <BlogEditor
      content={content}
      placeholder="Start editing your blog post..."
      maxLength={10000}
    />
  );
}