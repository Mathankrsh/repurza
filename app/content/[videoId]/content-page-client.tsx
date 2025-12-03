"use client";

import { useState } from "react";
import { ContentSidebar } from "./content-sidebar";
import { ContentEditor } from "./content-editor";
import type { getVideoContent } from "@/server/blogs";

type VideoData = Awaited<ReturnType<typeof getVideoContent>>;

type ContentType = "blog" | "thread" | null;

interface ContentPageClientProps {
  videoData: NonNullable<VideoData>;
}

export default function ContentPageClient({
  videoData,
}: ContentPageClientProps) {
  const [activeContentType, setActiveContentType] = useState<ContentType>(
    videoData.blog ? "blog" : videoData.thread ? "thread" : null
  );
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleContentTypeChange = (type: ContentType) => {
    if (type !== activeContentType) {
      setIsSwitching(true);
      // Small delay to show loading state
      setTimeout(() => {
        setActiveContentType(type);
        setIsSwitching(false);
      }, 100);
    }
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-background">
      <ContentSidebar
        videoId={videoData.videoId}
        activeContentType={activeContentType}
        onContentTypeChange={handleContentTypeChange}
        hasBlog={!!videoData.blog}
        hasThread={!!videoData.thread}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {isSwitching ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground">
                Switching content...
              </p>
            </div>
          </div>
        ) : activeContentType ? (
          <ContentEditor
            videoData={videoData}
            contentType={activeContentType}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-medium text-muted-foreground">
                No content available
              </h3>
              <p className="text-sm text-muted-foreground">
                This video doesn't have any generated content yet.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
