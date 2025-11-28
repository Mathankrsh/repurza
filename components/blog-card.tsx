import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SelectBlog } from "@/db/schema";

// import { sanitizeHtml } from "@/lib/sanitize-html"; // Temporarily disabled

type BlogCardProps = {
  blog: SelectBlog;
};

const MAX_CONTENT_LENGTH = 150;

// Strip HTML tags for preview
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function BlogCard({ blog }: BlogCardProps) {
  const plainTextContent = stripHtml(blog.content);
  const preview =
    plainTextContent.length > MAX_CONTENT_LENGTH
      ? `${plainTextContent.substring(0, MAX_CONTENT_LENGTH)}...`
      : plainTextContent;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{blog.title}</CardTitle>
        <CardDescription>YouTube ID: {blog.slug}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{preview}</p>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground text-xs">
          Created at: {new Date(blog.createdAt).toLocaleDateString()}
        </p>
      </CardFooter>
    </Card>
  );
}
