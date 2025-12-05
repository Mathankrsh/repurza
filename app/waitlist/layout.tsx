import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Repurpuz - Join the Waitlist",
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
    title: "Repurpuz - Join the Waitlist",
    description:
      "Transform YouTube videos into well-structured, professional blog posts, Twitter threads, and LinkedIn posts using AI. Join our waitlist to be the first to know when we launch!",
    siteName: "Repurpuz",
    images: [
      {
        url: "/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "Repurpuz",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Repurpuz - Join the Waitlist",
    description:
      "Transform YouTube videos into well-structured, professional blog posts, Twitter threads, and LinkedIn posts using AI. Join our waitlist to be the first to know when we launch!",
    images: ["/images/logo.webp"],
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
    icon: "/images/logo.webp",
    shortcut: "/images/logo.webp",
    apple: "/images/logo.webp",
  },
  category: "technology",
};

export default function WaitlistLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/logo.webp" sizes="any" />
        <link rel="apple-touch-icon" href="/images/logo.webp" />
      </head>
      <body
        className={`${manrope.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
          enableSystem={false}
          forcedTheme="light"
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}