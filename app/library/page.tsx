import { Suspense } from "react";
import { VideosList } from "@/components/videos-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function LibraryPage() {
  return (
    <div className="container mx-auto max-w-3xl space-y-4 px-5 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Content Library</h1>
        <p className="text-muted-foreground mt-2">
          Your generated blog posts and threads organized by YouTube video.
        </p>
      </div>
      
      <Suspense
        fallback={
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        }
      >
        <VideosList />
      </Suspense>
    </div>
  );
}
