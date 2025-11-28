"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileText, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getContentType } from "@/lib/content-utils";
import markdownToHtml from "@/lib/markdown-to-html";
import { getPostBySlug } from "@/server/blogs";
import BlogEditor from "@/components/blog-editor";

type ContentType = "blog" | "thread";

export default function GenerationPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ContentType>("blog");
  const [blogContent, setBlogContent] = useState<any>(null);
  const [threadContent, setThreadContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load content based on slug
  useEffect(() => {
    async function loadContent() {
      try {
        setIsLoading(true);

        // Try to get blog content first
        const blog = await getPostBySlug(params.slug as string);
        if (blog) {
          setBlogContent(blog);
        }

        // Try to get thread content (slug-thread)
        const thread = await getPostBySlug(`${params.slug}-thread`);
        if (thread) {
          setThreadContent(thread);
        }

        // Set active tab based on available content
        if (blog && thread) {
          setActiveTab("blog"); // Default to blog if both exist
        } else if (thread) {
          setActiveTab("thread");
        } else if (blog) {
          setActiveTab("blog");
        }
      } catch (error) {
        console.error("Error loading content:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadContent();
  }, [params.slug]);

  const currentContent = activeTab === "blog" ? blogContent : threadContent;

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading content...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentContent) {
    return (
      <div className="flex min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Content Not Found</h1>
            <p className="text-gray-600 mb-6">
              The content you're looking for doesn't exist.
            </p>
            <Button onClick={() => router.push("/")}>Go Back Home</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <div className="w-64 lg:w-64 md:w-48 sm:w-full sm:border-r sm:border-gray-200 bg-gray-50 p-4 lg:block md:hidden sm:block">
        <div className="lg:block md:hidden sm:hidden">
          {/* Mobile menu toggle could go here */}
        </div>

        <h2 className="font-semibold text-lg mb-4">Content Type</h2>

        <div className="space-y-2">
          <Button
            variant={activeTab === "blog" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("blog")}
            disabled={!blogContent}
          >
            <FileText className="mr-2 h-4 w-4" />
            <span className="sm:inline sm:hidden">Blog</span>
            <span className="hidden sm:inline">Blog Content</span>
            {blogContent && (
              <span className="ml-auto text-xs text-green-600">✓</span>
            )}
          </Button>

          <Button
            variant={activeTab === "thread" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("thread")}
            disabled={!threadContent}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            <span className="sm:inline sm:hidden">Thread</span>
            <span className="hidden sm:inline">Thread Content</span>
            {threadContent && (
              <span className="ml-auto text-xs text-green-600">✓</span>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">
              {currentContent.title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 text-sm space-y-1 sm:space-y-0 sm:space-x-2">
              <span>By {currentContent.author}</span>
              <span className="hidden sm:inline">•</span>
              <span>
                {new Date(currentContent.createdAt).toLocaleDateString()}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {activeTab === "blog" ? "Blog" : "Thread"}
              </span>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4 mb-6">
            <p className="text-gray-700 text-sm sm:text-base">
              {activeTab === "blog"
                ? "Blog content generated from YouTube video transcript"
                : "Twitter thread content generated from YouTube video transcript"}
            </p>
          </div>

          {/* Content Display */}
          <GenerationEditor content={currentContent} contentType={activeTab} />
        </div>
      </div>
    </div>
  );
}

// Editor component that shows WYSIWYG editor immediately
function GenerationEditor({
  content,
  contentType,
}: {
  content: any;
  contentType: ContentType;
}) {
  const [isSaving, setIsSaving] = useState(false);

  // Process content like blog page does
  const contentType_raw = getContentType(content.content || "");
  const processedContent =
    contentType_raw === "html"
      ? content.content || ""
      : markdownToHtml(content.content || "");

  const handleSave = async (data: { html: string; json: unknown }) => {
    try {
      setIsSaving(true);

      // Update content via API
      const response = await fetch(`/api/blog/${content.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success(
          `${contentType === "blog" ? "Blog" : "Thread"} content saved successfully!`
        );
      } else {
        throw new Error("Failed to save content");
      }
    } catch (error) {
      console.error("Failed to save content:", error);
      toast.error("Failed to save content. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">
          Edit {contentType === "blog" ? "Blog" : "Thread"} Content
        </h2>
        <div className="text-sm text-gray-600">
          {isSaving ? "Saving..." : "Auto-saved"}
        </div>
      </div>

      <BlogEditor
        content={processedContent}
        maxLength={10_000}
        onSaveExtended={handleSave}
        placeholder={`Start editing your ${contentType === "blog" ? "blog post" : "Twitter thread"}...`}
      />
    </div>
  );
}
