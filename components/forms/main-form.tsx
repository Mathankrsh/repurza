"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, FileText, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { SelectBlog } from "@/db/schema";
import { authClient } from "@/lib/auth-client";
import { checkBlogExists } from "@/server/blogs";
import { extractVideoId } from "@/lib/youtube";
import { BlogCard } from "../blog-card";
import { ButtonGroup } from "../ui/button-group";

const formSchema = z.object({
  youtubeUrl: z.url().min(1, {
    message: "YouTube URL must be at least 2 characters.",
  }),
  contentType: z.enum(["blog", "thread", "both"], {
    message: "Please select a content type",
  }),
});

type GenerateResponse = {
  success: boolean;
  data?: {
    type: string;
    content?: SelectBlog;
    blog?: SelectBlog;
    thread?: SelectBlog;
    videoId?: string;
    message: string;
  };
  error?: string;
  details?: Array<{ field: string; message: string }>;
};

export function MainForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [blog, setBlog] = useState<SelectBlog | null>(null);
  const [thread, setThread] = useState<SelectBlog | null>(null);
  const [bothContent, setBothContent] = useState<{
    blog: SelectBlog;
    thread: SelectBlog;
  } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      youtubeUrl: "",
      contentType: "blog",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const user = await authClient.getSession();

      if (!user.data) {
        toast.error("Please login to create content.");
        return;
      }

      setIsLoading(true);

      // Check if content already exists
      const check = await checkBlogExists(values.youtubeUrl);
      if (check) {
        setBlog(check);
        toast.success("Content already exists for this video.");
        return;
      }

      // Call new API endpoint
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: values.youtubeUrl,
          contentType: values.contentType,
        }),
      });

      const result: GenerateResponse = await response.json();

      if (!result.success) {
        toast.error(result.error || "Error generating content.");
        return;
      }

      // Handle different response types
      switch (result.data?.type) {
        case "blog":
          if (result.data?.videoId) {
            router.push(`/content/${result.data.videoId}`);
            toast.success("Blog has been created.");
          } else {
            setBlog(result.data.content || null);
            toast.success("Blog has been created.");
          }
          break;
        case "thread":
          if (result.data?.videoId) {
            router.push(`/content/${result.data.videoId}`);
            toast.success("Thread has been created.");
          } else {
            setThread(result.data.content || null);
            toast.success("Thread has been created.");
          }
          break;
        case "both":
          if (result.data?.videoId) {
            router.push(`/content/${result.data.videoId}`);
            toast.success("Both blog and thread have been created.");
          } else if (result.data.blog && result.data.thread) {
            setBothContent({
              blog: result.data.blog,
              thread: result.data.thread,
            });
            toast.success("Both blog and thread have been created.");
          }
          break;
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Error generating content.");
    } finally {
      setIsLoading(false);
    }
  }

  const contentType = form.watch("contentType");

  return (
    <>
      <Form {...form}>
        <form
          className="flex w-full gap-2 px-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="contentType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ButtonGroup className="w-full">
                    <Button
                      type="button"
                      variant={field.value === "blog" ? "default" : "outline"}
                      onClick={() => field.onChange("blog")}
                      className="flex-1"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Blog
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "thread" ? "default" : "outline"}
                      onClick={() => field.onChange("thread")}
                      className="flex-1"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Thread
                    </Button>
                    <Button
                      type="button"
                      variant={field.value === "both" ? "default" : "outline"}
                      onClick={() => field.onChange("both")}
                      className="flex-1"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Both
                    </Button>
                  </ButtonGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="youtubeUrl"
            render={({ field }) => (
              <FormItem className="flex-1 mt-2">
                <FormControl>
                  <ButtonGroup className="w-full">
                    <Input
                      className="flex-1"
                      placeholder="YouTube URL"
                      {...field}
                    />
                    <Button
                      type="submit"
                      aria-label="Generate"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        "Generate"
                      )}
                    </Button>
                  </ButtonGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      {/* Blog Content Display */}
      {blog && (
        <div className="absolute mt-3 flex max-w-3xl flex-col gap-4">
          <div className="flex justify-end gap-2">
            <Button asChild variant="outline">
              <Link href={`/content/${extractVideoId(blog.slug)}`}>View & Edit</Link>
            </Button>

            <Button
              onClick={() => {
                navigator.clipboard.writeText(blog.content);
                toast.success("Blog has been copied to clipboard.");
              }}
              variant="outline"
            >
              Copy Markdown
            </Button>
          </div>

          <BlogCard blog={blog} />
        </div>
      )}

      {/* Thread Content Display */}
      {thread && (
        <div className="absolute mt-3 flex max-w-3xl flex-col gap-4">
          <div className="flex justify-end gap-2">
            <Button asChild variant="outline">
              <Link href={`/content/${extractVideoId(thread.slug)}`}>View & Edit</Link>
            </Button>

            <Button
              onClick={() => {
                navigator.clipboard.writeText(thread.content);
                toast.success("Thread has been copied to clipboard.");
              }}
              variant="outline"
            >
              Copy Thread
            </Button>
          </div>

          <BlogCard blog={thread} />
        </div>
      )}

      {/* Both Content Display */}
      {bothContent && (
        <div className="absolute mt-3 flex max-w-3xl flex-col gap-4">
          <div className="flex justify-end gap-2">
            <Button asChild variant="outline">
              <Link href={`/content/${extractVideoId(bothContent.blog.slug)}`}>
                View & Edit Both
              </Link>
            </Button>

            <Button
              onClick={() => {
                navigator.clipboard.writeText(bothContent.blog.content);
                toast.success("Blog has been copied to clipboard.");
              }}
              variant="outline"
            >
              Copy Blog
            </Button>

            <Button
              onClick={() => {
                navigator.clipboard.writeText(bothContent.thread.content);
                toast.success("Thread has been copied to clipboard.");
              }}
              variant="outline"
            >
              Copy Thread
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Blog Content</h3>
              <BlogCard blog={bothContent.blog} />
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Thread Content</h3>
              <BlogCard blog={bothContent.thread} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
