"use client";

import BlogEditor from "@/components/blog-editor";

export default function TestEditorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-5 py-8">
        <h1 className="mb-8 font-bold text-3xl">Tiptap Editor Test</h1>
        <BlogEditor
          content="<p>Start writing here...</p>"
          maxLength={5000}
          placeholder="This is a test of the Tiptap editor integration"
        />
      </div>
    </div>
  );
}
