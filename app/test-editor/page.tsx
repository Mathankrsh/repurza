"use client";

import BlogEditor from "@/components/blog-editor";

export default function TestEditorPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-5 py-8">
        <h1 className="text-3xl font-bold mb-8">Tiptap Editor Test</h1>
        <BlogEditor
          content="<p>Start writing here...</p>"
          placeholder="This is a test of the Tiptap editor integration"
          maxLength={5000}
        />
      </div>
    </div>
  );
}