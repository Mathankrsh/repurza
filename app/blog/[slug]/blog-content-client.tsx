"use client";

import { useState } from "react";
import BlogEditor from "@/components/blog-editor";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";

interface BlogContentClientProps {
  content: string;
  slug: string;
}

export default function BlogContentClient({ content, slug }: BlogContentClientProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (newContent: string) => {
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
      
      <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none">
        <pre className="whitespace-pre-wrap font-sans">{content}</pre>
      </div>
    </div>
  );
}