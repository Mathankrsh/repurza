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
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-3">
          YouTube to Blog
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform YouTube videos into blog posts and Twitter threads with AI
        </p>
      </div>
      <Form {...form}>
        <form
          className="flex w-full max-w-3xl mx-auto flex-col gap-6 px-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="youtubeUrl"
            render={({ field }) => (
              <FormItem className="relative">
                <FormControl>
                  <div className="relative flex items-center">
                    <Input
                      className="h-14 w-full rounded-2xl border-2 border-border bg-background px-6 py-4 text-lg text-center shadow-sm transition-all focus:border-primary focus:shadow-md focus:outline-none"
                      placeholder="Paste YouTube URL here..."
                      {...field}
                    />
                    <Button
                      type="submit"
                      aria-label="Generate"
                      disabled={isLoading}
                      className="absolute right-2 h-10 rounded-xl px-6 font-medium"
                    >
                      {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        "Generate"
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contentType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex justify-center mt-6">
                    <ButtonGroup className="w-fit rounded-full bg-muted/50 p-1">
                      <Button
                        type="button"
                        variant={field.value === "blog" ? "default" : "ghost"}
                        onClick={() => field.onChange("blog")}
                        className="rounded-full px-6 py-2 text-sm font-medium transition-all"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Blog
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "thread" ? "default" : "ghost"}
                        onClick={() => field.onChange("thread")}
                        className="rounded-full px-6 py-2 text-sm font-medium transition-all"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Thread
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "both" ? "default" : "ghost"}
                        onClick={() => field.onChange("both")}
                        className="rounded-full px-6 py-2 text-sm font-medium transition-all"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Both
                      </Button>
                    </ButtonGroup>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
}
