"use cache";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostHeader } from "@/components/post-header";
import { getPostBySlug } from "@/server/blogs";
import ActionButtons from "../_components/action-buttons";
import BlogEditorClient from "./blog-editor-client";

export default async function EditPost(props: Params) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  return (
    <main className="mt-20">
      <ActionButtons content={post.content || ""} slug={post.slug} />
      <div className="container mx-auto px-5">
        <article className="mb-32">
          <PostHeader
            author={post.author}
            date={post.createdAt.toLocaleDateString()}
            title={post.title}
          />
          <div className="mx-auto max-w-4xl">
            <BlogEditorClient content={post.content || ""} />
          </div>
        </article>
      </div>
    </main>
  );
}

type Params = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `Edit: ${post.title} | ${post.author}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}