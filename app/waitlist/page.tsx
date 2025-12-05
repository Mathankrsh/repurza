import Image from "next/image";
import { WaitlistForm } from "@/components/forms/waitlist-form";
import {
  Zap,
  Clock,
  FileText,
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-7xl xl:max-w-7xl 2xl:max-w-7xl">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <div className="w-fit mb-6">
              <Image
                src="/images/logo.webp"
                alt="Repurpuz logo"
                width={56}
                height={56}
                className="h-12 w-12 rounded-full object-cover shadow-sm"
                priority
              />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Repurpose YouTube videos into
              <span className="text-primary"> blogs, threads and LinkedIn posts</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              Save hours of work with AI-powered content conversion. Turn your YouTube videos
              into well-structured blog posts, Twitter threads, and LinkedIn posts with just one click.
            </p>
            
            {/* Email Signup Form */}
            <div className="max-w-md">
              <WaitlistForm />
            </div>
          </div>
          
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-xl aspect-square">
              <Image
                src="/images/hero-repurpose.webp"
                alt="Repurpose a YouTube video into blog posts and threads"
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className="rounded-2xl object-cover border bg-card shadow-xl"
                priority
              />
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center group">
            <div className="rounded-xl bg-card border p-6 h-full transition-all hover:shadow-lg hover:border-primary/20">
              <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Save Time</h3>
              <p className="text-sm text-muted-foreground">
                Convert hours of video content into minutes of reading
              </p>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="rounded-xl bg-card border p-6 h-full transition-all hover:shadow-lg hover:border-primary/20">
              <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">
                Advanced AI creates professional, well-structured content
              </p>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="rounded-xl bg-card border p-6 h-full transition-all hover:shadow-lg hover:border-primary/20">
              <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Multiple Formats</h3>
              <p className="text-sm text-muted-foreground">
                Create blogs, Twitter threads, and LinkedIn posts from one video
              </p>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="rounded-xl bg-card border p-6 h-full transition-all hover:shadow-lg hover:border-primary/20">
              <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Grow Reach</h3>
              <p className="text-sm text-muted-foreground">
                Repurpose content for different audiences and platforms
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Repurpuz. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}