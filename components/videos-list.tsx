import Link from "next/link";
import { getVideosByUser } from "@/server/blogs";
import { VideoCard } from "./video-card";

// Strip HTML tags for preview
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function VideosList() {
  const videos = await getVideosByUser();

  if (videos.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium text-muted-foreground">
          No content yet
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          Start by generating content from a YouTube video.
        </p>
        <Link href="/" className="inline-block mt-4">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            Create Content
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <VideoCard
          key={video.videoId}
          videoId={video.videoId}
          title={video.latestContent.title.replace(/ \(Blog\)| \(Thread\)$/, "")}
          author={video.latestContent.author}
          createdAt={video.latestContent.createdAt}
          hasBlog={video.hasBlog}
          hasThread={video.hasThread}
          preview={video.latestContent.content}
        />
      ))}
    </div>
  );
}