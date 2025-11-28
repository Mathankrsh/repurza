import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getVideoContent } from "@/server/blogs";
import ContentPageClient from "./content-page-client";

async function ContentPage({ videoId }: { videoId: string }) {
  const videoData = await getVideoContent(videoId);

  if (!videoData) {
    return notFound();
  }

  return <ContentPageClient videoData={videoData} />;
}

export default async function ContentPageWrapper(props: {
  params: Promise<{ videoId: string }>;
}) {
  const params = await props.params;

  return (
    <Suspense
      fallback={
        <div className="flex h-screen">
          <div className="w-64 border-r bg-muted/20 p-4">
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full mt-2" />
          </div>
          <div className="flex-1 p-6">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      }
    >
      <ContentPage videoId={params.videoId} />
    </Suspense>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ videoId: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const videoData = await getVideoContent(params.videoId);

  if (!videoData) {
    return notFound();
  }

  const title = videoData.blog?.title || videoData.thread?.title || "Content";

  return {
    title,
    openGraph: {
      title,
    },
  };
}