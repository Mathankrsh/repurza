CREATE TYPE "public"."content_type" AS ENUM('blog', 'thread');--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "content_type" "content_type" DEFAULT 'blog' NOT NULL;