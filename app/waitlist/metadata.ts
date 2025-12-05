import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Repurpuz - Join Waitlist",
    template: "%s | Repurpuz",
  },
  description:
    "Transform YouTube videos into well-structured, professional blog posts, Twitter threads, and LinkedIn posts using AI. Join our waitlist to be the first to know when we launch!",
  keywords: [
    "Repurpuz",
    "YouTube to blog",
    "video to blog",
    "AI blog generator",
    "content creation",
    "waitlist",
    "launch",
    "Twitter threads",
    "LinkedIn posts",
    "content repurposing",
  ],
  authors: [{ name: "OrcDev" }],
  creator: "OrcDev",
  publisher: "OrcDev",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/waitlist",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/waitlist",
    title: "Repurpuz - Join Waitlist",
    description:
      "Transform YouTube videos into well-structured, professional blog posts, Twitter threads, and LinkedIn posts using AI. Join our waitlist to be the first to know when we launch!",
    siteName: "Repurpuz",
    images: [
      {
        url: "/icon.png",
        width: 1200,
        height: 630,
        alt: "Repurpuz - Join Waitlist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Repurpuz - Join Waitlist",
    description:
      "Transform YouTube videos into well-structured, professional blog posts, Twitter threads, and LinkedIn posts using AI. Join our waitlist to be the first to know when we launch!",
    images: ["/icon.png"],
    creator: "@orcdev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  category: "technology",
};