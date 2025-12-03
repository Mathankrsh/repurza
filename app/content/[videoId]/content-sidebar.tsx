"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  MessageCircle,
  Home,
  Library,
} from "lucide-react";
import Link from "next/link";

type ContentType = "blog" | "thread" | null;

interface ContentSidebarProps {
  videoId: string;
  activeContentType: ContentType;
  onContentTypeChange: (type: ContentType) => void;
  hasBlog: boolean;
  hasThread: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function ContentSidebar({
  videoId,
  activeContentType,
  onContentTypeChange,
  hasBlog,
  hasThread,
  isCollapsed,
  onToggleCollapse,
}: ContentSidebarProps) {
  return (
    <div
      className={`
      relative border-r bg-muted/20 transition-all duration-300
      ${isCollapsed ? "w-16" : "w-64"}
    `}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>

      <div className="flex h-full flex-col p-4">
        {/* Navigation */}
        <div className="space-y-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="w-full justify-start"
          >
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              {!isCollapsed && "Home"}
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="w-full justify-start"
          >
            <Link href="/library">
              <Library className="h-4 w-4 mr-2" />
              {!isCollapsed && "Library"}
            </Link>
          </Button>
        </div>

        <Separator className="my-4" />

        {/* Content Type Selector */}
        {!isCollapsed && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Content Type
            </h3>

            <Button
              variant={activeContentType === "blog" ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => onContentTypeChange("blog")}
              disabled={!hasBlog}
            >
              <FileText className="h-4 w-4 mr-2" />
              Blog Post
              {hasBlog && (
                <Badge variant="secondary" className="ml-auto">
                  ✓
                </Badge>
              )}
            </Button>

            <Button
              variant={activeContentType === "thread" ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={() => onContentTypeChange("thread")}
              disabled={!hasThread}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Thread
              {hasThread && (
                <Badge variant="secondary" className="ml-auto">
                  ✓
                </Badge>
              )}
            </Button>
          </div>
        )}

        {/* Collapsed State Icons */}
        {isCollapsed && (
          <div className="space-y-2">
            <Button
              variant={activeContentType === "blog" ? "default" : "outline"}
              size="sm"
              className="w-full justify-center p-2"
              onClick={() => onContentTypeChange("blog")}
              disabled={!hasBlog}
              title="Blog Post"
            >
              <FileText className="h-4 w-4" />
            </Button>

            <Button
              variant={activeContentType === "thread" ? "default" : "outline"}
              size="sm"
              className="w-full justify-center p-2"
              onClick={() => onContentTypeChange("thread")}
              disabled={!hasThread}
              title="Thread"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        )}

        <Separator className="my-4" />

        {/* Video Info */}
        {!isCollapsed && (
          <div className="mt-auto space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Video ID
            </h3>
            <p className="text-xs font-mono bg-muted p-2 rounded">{videoId}</p>
          </div>
        )}
      </div>
    </div>
  );
}
