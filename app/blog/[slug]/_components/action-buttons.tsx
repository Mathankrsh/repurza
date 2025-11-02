"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

type ActionButtonsProps = {
  content: string;
  slug: string;
};

export default function ActionButtons({ content, slug }: ActionButtonsProps) {
  return (
    <div className="-translate-x-1/2 absolute top-4 left-1/2 mx-auto flex gap-2">
      <Button asChild variant="outline">
        <Link href="/">Back</Link>
      </Button>

      <Button asChild variant="outline">
        <Link href={`/blog/${slug}/edit`}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Link>
      </Button>

      <Button
        onClick={() => {
          navigator.clipboard.writeText(content || "");
          toast.success("Markdown has been copied to clipboard.");
        }}
        variant="outline"
      >
        Copy Markdown
      </Button>
    </div>
  );
}
