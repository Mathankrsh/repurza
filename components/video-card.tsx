import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type VideoCardProps = {
  videoId: string;
  title: string;
  author: string;
  createdAt: Date | string;
  hasBlog: boolean;
  hasThread: boolean;
  preview: string;
};

const MAX_CONTENT_LENGTH = 150;

// Strip HTML tags for preview
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function VideoCard({
  videoId,
  title,
  author,
  createdAt,
  hasBlog,
  hasThread,
  preview,
}: VideoCardProps) {
  const plainTextContent = stripHtml(preview);
  const contentPreview =
    plainTextContent.length > MAX_CONTENT_LENGTH
      ? `${plainTextContent.substring(0, MAX_CONTENT_LENGTH)}...`
      : plainTextContent;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="mt-1">
              By {author} • YouTube ID: {videoId}
            </CardDescription>
          </div>
          <div className="flex gap-1 ml-2">
            {hasBlog && <Badge variant="default">Blog</Badge>}
            {hasThread && <Badge variant="secondary">Thread</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{contentPreview}</p>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between w-full">
          <p className="text-muted-foreground text-xs">
            Created: {new Date(createdAt).toLocaleDateString()}
          </p>
          <Button asChild>
            <Link href={`/content/${videoId}`}>View Content</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
