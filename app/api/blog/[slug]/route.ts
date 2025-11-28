import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { updateBlogContent } from "@/server/blogs";

// Request validation schema
const UpdateRequestSchema = z.object({
  html: z.string().min(1, "HTML content is required"),
  json: z.any().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const validatedData = UpdateRequestSchema.parse(body);

    // Update the blog content
    const updated = await updateBlogContent(slug, {
      html: validatedData.html,
      json: validatedData.json,
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Content updated successfully",
    });
  } catch (error) {
    console.error("Update API error:", error);

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

    // Handle other errors
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        message: "Failed to update content. Please try again.",
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
