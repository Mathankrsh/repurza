"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PostHeader } from "@/components/post-header";
import { Skeleton } from "@/components/ui/skeleton";

import { toast } from "sonner";
import BlogEditor from "@/components/blog-editor";
import { updateBlogContent } from "@/server/blogs";
import { getContentType } from "@/lib/content-utils";
import { markdownToHtmlSync } from "@/lib/markdown-to-html";
import type { getVideoContent } from "@/server/blogs";

type VideoData = Awaited<ReturnType<typeof getVideoContent>>;
type ContentType = "blog" | "thread";

interface ContentEditorProps {
  videoData: NonNullable<VideoData>;
  contentType: ContentType;
}

export function ContentEditor({ videoData, contentType }: ContentEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const content = contentType === "blog" ? videoData.blog : videoData.thread;

// Use the existing markdown library for reliable conversion
  const processMarkdownToHtml = (markdown: string): string => {
    if (!markdown) return "";
    
    const contentType = getContentType(markdown);
    if (contentType === "html") {
      return markdown;
    }
    
    return markdownToHtmlSync(markdown);
  };

  // Process content for both display and editing - convert markdown to HTML if needed
  const processedContent = useMemo(() => {
    if (!content) return "";
    return processMarkdownToHtml(content.content);
  }, [content, contentType]);
  
  if (!content) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-medium text-muted-foreground">
            No {contentType} content available
          </h3>
          <p className="text-sm text-muted-foreground">
            This video doesn't have a {contentType} yet.
          </p>
        </div>
      </div>
    );
  }

  const handleSave = async ({ html, json }: { html: string; json: unknown }) => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      await updateBlogContent(content.slug, { html, json });
      setSaveStatus('success');
      toast.success("Content saved successfully!");
      
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error("Failed to save content:", error);
      setSaveStatus('error');
      toast.error("Failed to save content. Please try again.");
      
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant={contentType === "blog" ? "default" : "secondary"}>
                {contentType === "blog" ? "Blog Post" : "Thread"}
              </Badge>
              <div>
                <h1 className="text-xl font-semibold">
                  {content.title.replace(/ \(Blog\)| \(Thread\)$/, "")}
                </h1>
                <p className="text-sm text-muted-foreground">
                  By {content.author} • {new Date(content.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">
                {isSaving ? "Saving..." : saveStatus === 'success' ? "Saved!" : saveStatus === 'error' ? "Error occurred" : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="h-full">
          <BlogEditor
            content={processedContent}
            maxLength={10_000}
            onSaveExtended={handleSave}
            placeholder={`Start editing your ${contentType}...`}
          />
        </div>
      </div>
    </div>
  );
}