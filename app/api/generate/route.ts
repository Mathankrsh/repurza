import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateBlog, generateBothContentTypes } from "@/server/ai";
import { extractVideoId } from "@/lib/youtube";

// Request validation schema
const GenerateRequestSchema = z.object({
  url: z.string().url("Invalid YouTube URL"),
  contentType: z.enum(["blog", "thread", "both"]),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = GenerateRequestSchema.parse(body);

    const { url, contentType } = validatedData;

    // Generate content based on type
    switch (contentType) {
      case "blog": {
        const blogResult = await generateBlog(url);
        return NextResponse.json({
          success: true,
          data: {
            type: "blog",
            content: blogResult,
            videoId: extractVideoId(blogResult.slug),
            message: "Blog generated successfully",
          },
        });
      }

      case "thread": {
        // For thread-only generation, we still need to generate both and extract thread
        const bothResult = await generateBothContentTypes(url);
        return NextResponse.json({
          success: true,
          data: {
            type: "thread",
            content: bothResult.thread,
            videoId: extractVideoId(bothResult.thread.slug),
            message: "Thread generated successfully",
          },
        });
      }

      case "both": {
        const bothContentResult = await generateBothContentTypes(url);
        return NextResponse.json({
          success: true,
          data: {
            type: "both",
            blog: bothContentResult.blog,
            thread: bothContentResult.thread,
            videoId: extractVideoId(bothContentResult.blog.slug),
            message: "Both blog and thread generated successfully",
          },
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: "Invalid content type" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Generation API error:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle generation errors
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        message: "Failed to generate content. Please try again.",
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export function GET() {
  return NextResponse.json(
    { success: false, error: "Method not allowed" },
    { status: 405 }
  );
}
