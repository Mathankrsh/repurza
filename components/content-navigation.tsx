"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowLeft, Edit, FileText, MessageSquare } from "lucide-react";

type ContentNavigationProps = {
  videoId: string;
  hasBlog: boolean;
  hasThread: boolean;
  activeTab: "blog" | "thread";
  onTabChange: (tab: "blog" | "thread") => void;
  blogSlug?: string;
  threadSlug?: string;
};

export function ContentNavigation({
  videoId,
  hasBlog,
  hasThread,
  activeTab,
  onTabChange,
  blogSlug,
  threadSlug,
}: ContentNavigationProps) {
  return (
    <div className="space-y-4">
      {/* Back button */}
      <Link href="/library">
        <Button variant="ghost" size="sm" className="mb-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Library
        </Button>
      </Link>

      {/* Content type tabs */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Content Type</h3>
        <div className="flex flex-col gap-2">
          {hasBlog && (
            <Button
              variant={activeTab === "blog" ? "default" : "outline"}
              size="sm"
              onClick={() => onTabChange("blog")}
              className="justify-start"
            >
              <FileText className="w-4 h-4 mr-2" />
              Blog Post
              {activeTab === "blog" && <Badge className="ml-auto" variant="secondary">Active</Badge>}
            </Button>
          )}
          
          {hasThread && (
            <Button
              variant={activeTab === "thread" ? "default" : "outline"}
              size="sm"
              onClick={() => onTabChange("thread")}
              className="justify-start"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Twitter Thread
              {activeTab === "thread" && <Badge className="ml-auto" variant="secondary">Active</Badge>}
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Edit links */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Actions</h3>
        <div className="flex flex-col gap-2">
          {hasBlog && blogSlug && (
            <Link href={`/blog/${blogSlug}/edit`}>
              <Button variant="outline" size="sm" className="justify-start w-full">
                <Edit className="w-4 h-4 mr-2" />
                Edit Blog
              </Button>
            </Link>
          )}
          
          {hasThread && threadSlug && (
            <Link href={`/blog/${threadSlug}/edit`}>
              <Button variant="outline" size="sm" className="justify-start w-full">
                <Edit className="w-4 h-4 mr-2" />
                Edit Thread
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}