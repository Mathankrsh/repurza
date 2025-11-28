"use server";

import { GoogleGenAI } from "@google/genai";

import { extractYouTubeData } from "@/lib/youtube";
import { createBlog, createBothContentTypes } from "./blogs";
import { getCurrentUser } from "./users";

const SECONDS_PER_MINUTE = 60;
const MIN_BLOG_LENGTH = 500; // Minimum blog post length to ensure quality
const MAX_CAPTION_LENGTH = 8000; // Maximum caption text length to include in prompt
const MAX_CHUNK_LENGTH = 10000; // Maximum transcript length for first API call
const MIN_THREAD_LENGTH = 280; // Minimum thread length (at least 1 tweet)

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

function chunkTranscriptForFirstCall(
  captions: Array<{ start: string; dur: string; text: string }>
): string {
  // Combine all caption text
  const fullText = captions.map((caption) => caption.text).join(" ");

  // Truncate to MAX_CHUNK_LENGTH for first API call
  if (fullText.length > MAX_CHUNK_LENGTH) {
    return `${fullText.substring(0, MAX_CHUNK_LENGTH)}...[transcript truncated for analysis]`;
  }

  return fullText;
}

function getFullTranscript(
  captions: Array<{ start: string; dur: string; text: string }>
): string {
  // Return complete transcript for second API call
  return captions.map((caption) => caption.text).join(" ");
}

function createBlogPrompt(videoData: any, captionText: string): string {
  return `Generate a high-quality MDX blog post based on the following YouTube video transcript:

**Video Information:**
- Title: ${videoData.title}
- Author: ${videoData.author}
- Duration: ${Math.floor(Number.parseInt(videoData.duration, 10) / SECONDS_PER_MINUTE)} minutes

**Video Transcript:**
${captionText}

**Requirements:**
1. Transform into first-person narrative ("I", "my", "me")
2. Use Markdown format with clear structure
3. Include: Introduction, main sections with ## headings, Conclusion
4. Add relevant code examples from transcript
5. Target: ${videoData.title.includes("code") || videoData.title.includes("tutorial") ? "developers" : "general audience"}
6. Length: 500+ words
7. Personal, conversational tone

**Output:** Complete MDX content with title. NO frontmatter.`;
}

function createThreadPrompt(videoData: any, captionText: string): string {
  return `Generate a high-quality Twitter thread based on following YouTube video transcript and information:

**Video Information:**
- Title: ${videoData.title}
- Author: ${videoData.author}
- Duration: ${Math.floor(Number.parseInt(videoData.duration, 10) / SECONDS_PER_MINUTE)} minutes

**Video Transcript (Primary Source):**
${captionText}

**Objective:** Create an engaging Twitter thread based primarily on the video transcript above. Transform the spoken content into a compelling thread format that captures attention and provides value in bite-sized pieces.

**Target Audience Detection:** Analyze the video's title and transcript content to automatically determine the appropriate target audience (e.g., developers, designers, marketers, general audience, etc.). Write the thread for that specific audience.

**Style Guide:**
1. **Content Creation:** Base the thread primarily on the transcript content, writing in first person ("I", "my", "me") as if you're personally sharing your experience and insights
2. **Thread Structure:**
   * Start with a compelling hook tweet that grabs attention
   * Follow with 5-15 tweets that build upon each other
   * Each tweet should be under 280 characters
   * Use numbered format (1/n, 2/n, etc.) for thread continuity
   * End with a strong conclusion/CTA tweet
3. **Content Elements:**
   * Include key insights and takeaways from the video
   * Add relevant hashtags (2-4 per thread)
   * Use emojis sparingly to enhance engagement
   * Include bullet points or numbered lists where appropriate
4. **Engagement Tactics:**
   * Ask questions to encourage interaction
   * Share personal experiences and lessons learned
   * Provide actionable tips or advice
   * Create curiosity for subsequent tweets
5. **Transcription Fidelity:** Stay true to the original content while making it suitable for Twitter's format

**Output Format:** Complete Twitter thread with each tweet clearly numbered (1/n, 2/n, etc.). Each tweet should be on a new line with the character count in parentheses. Format as:

1/n [Tweet content] (XXX chars)
2/n [Tweet content] (XXX chars)
...

NO additional commentary or explanations, just the thread content.`;
}

function createUnifiedPrompt(videoData: any, captionText: string): string {
  return `Analyze the following YouTube video transcript and prepare to generate both a blog post and a Twitter thread:

**Video Information:**
- Title: ${videoData.title}
- Author: ${videoData.author}
- Duration: ${Math.floor(Number.parseInt(videoData.duration, 10) / SECONDS_PER_MINUTE)} minutes

**Video Transcript (Analysis Source):**
${captionText}

**Analysis Task:** 
1. Identify the main topics, key insights, and target audience
2. Determine the best structure for both a detailed blog post and an engaging Twitter thread
3. Extract the most valuable content points that should be highlighted in both formats

**Content Strategy:**
- For Blog: Educational, in-depth exploration with examples and detailed explanations
- For Thread: Bite-sized insights, key takeaways, and engaging hooks

**Response Format:** 
Provide a brief analysis confirming you understand the content and are ready to generate both formats. Include:
1. Main topic summary (1-2 sentences)
2. Target audience identification
3. Key themes to cover in both formats

Keep your response concise (under 200 words total).`;
}

async function analyzeTranscript(videoData: any, captions: any[]) {
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const chunkedTranscript = chunkTranscriptForFirstCall(captions);
  const unifiedPrompt = createUnifiedPrompt(videoData, chunkedTranscript);

  const result = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: unifiedPrompt }] }],
  });

  if (!result.candidates?.[0]?.content?.parts?.[0]) {
    throw new Error("Invalid response from Gemini API for transcript analysis");
  }

  return result.candidates[0].content.parts[0].text;
}

async function generateBothContentTypesFromAI(videoData: any, captions: any[]) {
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const fullTranscript = getFullTranscript(captions);

  // Create both prompts
  const blogPrompt = createBlogPrompt(videoData, fullTranscript);
  const threadPrompt = createThreadPrompt(videoData, fullTranscript);

  // Generate both content types in parallel
  const [blogResult, threadResult] = await Promise.all([
    genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: blogPrompt }] }],
    }),
    genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: threadPrompt }] }],
    }),
  ]);

  if (!blogResult.candidates?.[0]?.content?.parts?.[0]) {
    throw new Error("Invalid response from Gemini API for blog generation");
  }

  if (!threadResult.candidates?.[0]?.content?.parts?.[0]) {
    throw new Error("Invalid response from Gemini API for thread generation");
  }

  const blogContent = blogResult.candidates[0].content.parts[0].text;
  const threadContent = threadResult.candidates[0].content.parts[0].text;

  // Validate content lengths
  if (!blogContent || blogContent.length < MIN_BLOG_LENGTH) {
    throw new Error(
      `Generated blog is too short: ${blogContent?.length || 0} characters`
    );
  }

  if (!threadContent || threadContent.length < MIN_THREAD_LENGTH) {
    throw new Error(
      `Generated thread is too short: ${threadContent?.length || 0} characters`
    );
  }

  return { blogContent, threadContent };
}

export async function generateBothContentTypes(youtubeUrl: string) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("User not found");
    }

    // Extract YouTube video data
    const videoData = await extractYouTubeData(youtubeUrl);

    if (!videoData.captions || videoData.captions.length === 0) {
      throw new Error(
        "No captions available for this video. The video must have captions (auto-generated or manual) to generate content."
      );
    }

    // Step 1: Analyze transcript with chunked data
    console.log("Step 1: Analyzing transcript...");
    const analysis = await analyzeTranscript(videoData, videoData.captions);
    console.log("Analysis complete:", analysis);

    // Step 2: Generate both content types in parallel
    console.log("Step 2: Generating blog and thread content...");
    const { blogContent, threadContent } = await generateBothContentTypesFromAI(
      videoData,
      videoData.captions
    );
    console.log("Content generation complete");

    // Step 3: Save both content types to database
    console.log("Step 3: Saving to database...");
    const result = await createBothContentTypes(
      videoData,
      blogContent,
      threadContent
    );
    console.log("Database save complete");

    return result;
  } catch (error) {
    throw new Error("Failed to generate both content types", { cause: error });
  }
}

export async function generateBlog(youtubeUrl: string) {
  try {
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
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const prompt = createBlogPrompt(videoData, captionText);
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    if (!result.candidates?.[0]?.content?.parts?.[0]) {
      throw new Error("Invalid response from Gemini API");
    }

    const text = result.candidates[0].content.parts[0].text;
    if (!text) {
      throw new Error("Generated text is undefined");
    }

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

    const blog = await createBlog({
      userId: currentUser.user.id,
      content: text,
      slug: videoData.slug,
      title: videoData.title,
      author: videoData.author,
    });
    return blog;
  } catch (error) {
    throw new Error("Failed to generate blog", { cause: error });
  }
}
