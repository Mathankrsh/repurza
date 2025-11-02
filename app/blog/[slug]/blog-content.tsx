"use client";

import { useState } from "react";
import BlogEditor from "@/components/blog-editor";
import markdownToHtml from "@/lib/markdown-to-html";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";

interface BlogContentProps {
  content: string;
  slug: string;
}

export default function BlogContent({ content, slug }: BlogContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");

  const handleSave = async (newContent: string) => {
    // Here you would typically save to your database
    console.log("Saving content:", newContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        <BlogEditor
          content={content}
          placeholder="Start editing your blog post..."
          maxLength={10000}
          onSave={handleSave}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Blog Content</h2>
        <Button
          variant="outline"
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </div>
      
      <div
        className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent || markdownToHtmlSync(content) }}
      />
    </div>
  );
}

// Helper function to convert markdown to HTML synchronously
function markdownToHtmlSync(markdown: string): string {
  try {
    // Simple markdown to HTML conversion for basic formatting
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/\n/gim, '<br>');
  } catch (error) {
    return markdown;
  }
}