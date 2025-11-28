"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { blogs, type InsertBlog } from "@/db/schema";
import { cleanYouTubeUrl, extractVideoId } from "@/lib/youtube";
import { getCurrentUser } from "./users";

export async function getBlogs() {
  try {
    return await db.select().from(blogs);
  } catch (error) {
    throw new Error("Failed to get posts", { cause: error });
  }
}

export async function getBlogsByUser() {
  try {
    const currentUser = await getCurrentUser();

    return await db
      .select()
      .from(blogs)
      .where(eq(blogs.userId, currentUser.user.id));
  } catch (error) {
    throw new Error("Failed to get posts", { cause: error });
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const [post] = await db.select().from(blogs).where(eq(blogs.slug, slug));
    return post;
  } catch (error) {
    throw new Error("Failed to get post by slug", { cause: error });
  }
}

export async function createBlog(blog: InsertBlog) {
  try {
    const currentUser = await getCurrentUser();
    const [newBlog] = await db
      .insert(blogs)
      .values({ ...blog, userId: currentUser.user.id })
      .returning();
    return newBlog;
  } catch (error) {
    throw new Error("Failed to create blog", { cause: error });
  }
}

export async function createContent(
  data: Omit<InsertBlog, "userId">
): Promise<typeof blogs.$inferSelect> {
  try {
    const currentUser = await getCurrentUser();
    const [newContent] = await db
      .insert(blogs)
      .values({
        ...data,
        userId: currentUser.user.id,
        contentType: data.contentType || "blog",
      })
      .returning();
    return newContent;
  } catch (error) {
    throw new Error("Failed to create content", { cause: error });
  }
}

export async function createBothContentTypes(
  videoData: { title: string; author: string; slug: string },
  blogContent: string,
  threadContent: string
): Promise<{
  blog: typeof blogs.$inferSelect;
  thread: typeof blogs.$inferSelect;
}> {
  try {
    const currentUser = await getCurrentUser();

    // Create blog content
    const [blog] = await db
      .insert(blogs)
      .values({
        userId: currentUser.user.id,
        slug: `${videoData.slug}-blog`,
        title: `${videoData.title} (Blog)`,
        content: blogContent,
        tiptapContent: {},
        contentType: "blog",
        author: videoData.author,
      })
      .returning();

    // Create thread content
    const [thread] = await db
      .insert(blogs)
      .values({
        userId: currentUser.user.id,
        slug: `${videoData.slug}-thread`,
        title: `${videoData.title} (Thread)`,
        content: threadContent,
        tiptapContent: {},
        contentType: "thread",
        author: videoData.author,
      })
      .returning();

    return { blog, thread };
  } catch (error) {
    throw new Error("Failed to create both content types", { cause: error });
  }
}

export async function checkBlogExists(youtubeUrl: string) {
  try {
    // Clean the URL and extract video ID as slug
    const cleanedUrl = cleanYouTubeUrl(youtubeUrl);
    const slug = extractVideoId(cleanedUrl);

    if (!slug) {
      throw new Error("Invalid YouTube URL");
    }

    const [blog] = await db.select().from(blogs).where(eq(blogs.slug, slug));
    return blog;
  } catch (error) {
    throw new Error("Failed to check blog exists", { cause: error });
  }
}

export async function updateBlogContent(
  slug: string,
  data: { html: string; json: unknown }
) {
  try {
    const [updated] = await db
      .update(blogs)
      .set({
        content: data.html,
        tiptapContent: data.json as any,
        updatedAt: new Date(),
      })
      .where(eq(blogs.slug, slug))
      .returning();

    return updated;
  } catch (error) {
    throw new Error("Failed to update blog content", { cause: error });
  }
}

// Helper function to extract base video ID from slug
function extractBaseVideoId(slug: string): string {
  return slug.replace(/-blog$|-thread$/, "");
}

// Group content by base video ID
export async function getVideosByUser() {
  try {
    const currentUser = await getCurrentUser();
    const allContent = await db
      .select()
      .from(blogs)
      .where(eq(blogs.userId, currentUser.user.id));

    // Group by base video ID
    const videosMap = new Map<string, typeof allContent>();

    allContent.forEach((content) => {
      const baseVideoId = extractBaseVideoId(content.slug);
      
      if (!videosMap.has(baseVideoId)) {
        videosMap.set(baseVideoId, []);
      }
      
      videosMap.get(baseVideoId)!.push(content);
    });

    // Convert to array and sort by most recent content
    const videos = Array.from(videosMap.entries()).map(([videoId, contents]) => {
      const sortedContents = contents.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      return {
        videoId,
        contents: sortedContents,
        latestContent: sortedContents[0],
        hasBlog: contents.some(c => c.contentType === "blog"),
        hasThread: contents.some(c => c.contentType === "thread"),
      };
    });

    // Sort videos by latest content creation date
    return videos.sort((a, b) => 
      new Date(b.latestContent.createdAt).getTime() - 
      new Date(a.latestContent.createdAt).getTime()
    );
  } catch (error) {
    throw new Error("Failed to get videos by user", { cause: error });
  }
}

// Get all content for a specific video
export async function getVideoContent(videoId: string) {
  try {
    const currentUser = await getCurrentUser();
    
    const allContent = await db
      .select()
      .from(blogs)
      .where(eq(blogs.userId, currentUser.user.id));

    // Filter content that belongs to this video
    const videoContent = allContent.filter(content => {
      const baseVideoId = extractBaseVideoId(content.slug);
      return baseVideoId === videoId;
    });

    if (videoContent.length === 0) {
      return null;
    }

    // Separate blog and thread content
    const blogContent = videoContent.find(c => c.contentType === "blog");
    const threadContent = videoContent.find(c => c.contentType === "thread");

    return {
      videoId,
      blog: blogContent || null,
      thread: threadContent || null,
      allContent: videoContent,
    };
  } catch (error) {
    throw new Error("Failed to get video content", { cause: error });
  }
}
