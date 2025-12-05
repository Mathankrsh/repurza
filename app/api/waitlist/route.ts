import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { waitlist } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = waitlistSchema.parse(body);
    const { email } = validatedData;

    // Check if email already exists in waitlist
    const existingEntry = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.email, email))
      .limit(1);

    if (existingEntry.length > 0) {
      return NextResponse.json(
        { error: "This email is already on the waitlist" },
        { status: 409 }
      );
    }

    // Add email to waitlist
    await db.insert(waitlist).values({
      email: email.toLowerCase(),
    });

    return NextResponse.json(
      { message: "Successfully added to waitlist!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Waitlist submission error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid email format", details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to add to waitlist. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}