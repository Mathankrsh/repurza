"use server";

import { GoogleGenAI } from "@google/genai";

import { extractYouTubeData } from "@/lib/youtube";
import { createBlog } from "./blogs";
import { getCurrentUser } from "./users";

const SECONDS_PER_MINUTE = 60;
const MIN_BLOG_LENGTH = 500; // Minimum blog post length to ensure quality
const MAX_CAPTION_LENGTH = 8000; // Maximum caption text length to include in prompt

function formatCaptionsForPrompt(
  captions: Array<{ start: string; dur: string; text: string }>
): string {
  // Combine all caption text
  const fullText = captions.map((caption) => caption.text).join(" ");

  // Truncate if too long
  if (fullText.length > MAX_CAPTION_LENGTH) {
    return `${fullText.substring(0, MAX_CAPTION_LENGTH)}...`;
  }

  return fullText;
}

export async function generateBlog(youtubeUrl: string) {
  try {
    console.log("🚀 Starting blog generation with Gemini API...");
    console.log("✅ Using Gemini API Key:", process.env.GEMINI_API_KEY ? "Present" : "Missing");
    
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("User not found");
    }

    // Extract YouTube video data
    const videoData = await extractYouTubeData(youtubeUrl);

    if (!videoData.captions || videoData.captions.length === 0) {
      // Validate that captions are available
      throw new Error(
        "No captions available for this video. The video must have captions (auto-generated or manual) to generate a blog post."
      );
    }

    // Format captions for the prompt
    const captionText = formatCaptionsForPrompt(videoData.captions);

    // Initialize Google Generative AI with your own API key
    console.log("🔑 Initializing Google GenAI client...");
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    console.log("✅ Google GenAI client initialized successfully");

    const prompt = `Generate a high-quality MDX blog post based on the following YouTube video transcript and information:

**Video Information:**
- Title: ${videoData.title}
- Author: ${videoData.author}
- Duration: ${Math.floor(Number.parseInt(videoData.duration, 10) / SECONDS_PER_MINUTE)} minutes

**Video Transcript (Primary Source):**
${captionText}

**Objective:** Create a personal, engaging MDX blog post based primarily on the video transcript above. Transform the spoken content into a first-person narrative that feels like you're sharing your experience and knowledge directly with the reader.

**Target Audience Detection:** Analyze the video's title and transcript content to automatically determine the appropriate target audience (e.g., developers, designers, marketers, general audience, etc.). Write the blog post for that specific audience.

**Style Guide:**
1.  **Content Creation:** Base the blog post primarily on the transcript content, writing in first person ("I", "my", "me") as if you're personally sharing your experience and knowledge
2.  **Structure & Formatting:**
    * Use Markdown for the main structure
    * Format as a single, valid **MDX** file
    * Start with a compelling title (adapt the video title if needed)
    * Use a clear **Introduction** section that explains what you'll be sharing
    * Organize content using level-2 headings ('##') for major sections and level-3 headings ('###') for sub-points
    * End with a **Conclusion** that summarizes your key takeaways
3.  **Code Inclusion:** Include relevant code examples mentioned in the transcript, presented as your own examples
4.  **Educational Value:** Ensure the content provides educational value by sharing your insights and experiences
5.  **Personal Tone:** Write in a conversational, personal tone - like you're talking to a friend or colleague about what you learned
6.  **Transcription Fidelity:** Stay true to the original content while making it sound personal and authentic

**Output Format:** Complete, ready-to-publish MDX content starting with the title and ending with the conclusion. NO frontmatter (YAML metadata with --- markers).`;

    console.log("🤖 Calling Gemini API with model: gemini-2.5-flash...");
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    
    console.log("✅ Gemini API call completed successfully");
    
    if (!result.candidates || !result.candidates[0] || !result.candidates[0].content || !result.candidates[0].content.parts || !result.candidates[0].content.parts[0]) {
      throw new Error("Invalid response from Gemini API");
    }
    
    const text = result.candidates[0].content.parts[0].text;
    if (!text) {
      throw new Error("Generated text is undefined");
    }
    console.log("📝 Generated blog content length:", text.length, "characters");

    if (!text || text.length < MIN_BLOG_LENGTH) {
      // Validate generated content quality
      throw new Error(
        `Generated blog post is too short or empty. Length: ${text?.length || 0} characters. Minimum required: ${MIN_BLOG_LENGTH} characters. Please try again with a different video.`
      );
    }

    // Check for potential hallucination indicators
    const hallucinationIndicators = [
      "according to the latest research",
      "recent studies show",
      "experts recommend",
      "best practices suggest",
      "industry standard",
      "as we know",
      "it's important to note that",
    ];

    const hasPotentialHallucination = hallucinationIndicators.some(
      (indicator) => text.toLowerCase().includes(indicator.toLowerCase())
    );

    if (hasPotentialHallucination) {
      // Note: Content may contain external knowledge not from the video transcript
      // In production, this could trigger additional validation or user notification
    }

    console.log("💾 Saving blog to database...");
    const blog = await createBlog({
      userId: currentUser.user.id,
      content: text,
      slug: videoData.slug,
      title: videoData.title,
      author: videoData.author,
    });
    console.log("✅ Blog saved successfully with ID:", blog.id);

    console.log("🎉 Blog generation completed using Gemini API!");
    return blog;
  } catch (error) {
    throw new Error("Failed to generate blog", { cause: error });
  }
}
