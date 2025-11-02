# Gemini API Setup for Blog Generation

## 🎯 Overview

This document explains how to configure your own Google Gemini API key for blog generation, replacing the Vercel AI Gateway that was causing authentication issues.

## ✅ Current Implementation

### **Technology Stack:**
- **Google GenAI SDK** - Direct API integration
- **Gemini 2.5 Flash** - AI model for content generation
- **Free Tier Available** - Generous free tier with Google AI Studio

## 🔑 Getting Your Gemini API Key

### **1. Get API Key from Google AI Studio:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key
5. (Optional) Give your key a name for easy identification

### **2. Add to Environment:**
```bash
# Add to your .env.local file
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

## 💰 Cost & Free Tier

### **Google Gemini Free Tier:**
- ✅ **Generous free tier** available
- ✅ **No credit card required** for initial usage
- ✅ **Fast setup** - immediate access
- ✅ **Good for development** and small projects

### **Free Tier Limits:**
- 60 requests per minute
- 15,000 requests per day
- Enough for development and moderate usage

### **Cost After Free Tier:**
- **Gemini 2.5 Flash:** ~$0.075 per 1 million characters
- **Very affordable** for most use cases

## 🚀 Implementation Details

### **Code Changes Made:**
```typescript
// Before: Using Vercel AI Gateway (causing auth issues)
const { text } = await generateText({
  model: "gemini-2.5-flash",
  prompt: "..."
});

// After: Using direct Google Gemini API
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const result = await genAI.models.generateContent({
  model: "gemini-2.5-flash",
  contents: [{ role: "user", parts: [{ text: prompt }] }],
});
const text = result.candidates[0].content.parts[0].text;
```

### **Error Handling Added:**
```typescript
if (!result.candidates || !result.candidates[0] || !result.candidates[0].content || !result.candidates[0].content.parts || !result.candidates[0].content.parts[0]) {
  throw new Error("Invalid response from Gemini API");
}
```

## 📋 Setup Checklist

### **Development Setup:**
1. ✅ Get API key from Google AI Studio
2. ✅ Add to `.env.local` file
3. ✅ Install `@google/genai` package
4. ✅ Update AI server implementation
5. ✅ Test with a YouTube video

### **Production Considerations:**
1. **API Key Security:**
   - Use environment variables (never commit to git)
   - Consider rotating keys periodically
   - Monitor usage in Google AI Studio

2. **Cost Management:**
   - Set up usage monitoring
   - Consider budget limits in Google Cloud Console
   - Monitor API usage patterns

3. **Error Handling:**
   - Implement retry logic for API failures
   - Add fallback content generation
   - Monitor API response times

## 🔧 Troubleshooting

### **Common Issues:**

#### **1. API Key Not Found:**
```bash
Error: Cannot find name 'GEMINI_API_KEY'
```
**Solution:** Ensure `GEMINI_API_KEY` is set in your `.env.local` file

#### **2. Authentication Failed:**
```bash
Error: Invalid API key
```
**Solution:** 
- Verify your API key is correct
- Check that it's not expired
- Ensure it has the necessary permissions

#### **3. Rate Limiting:**
```bash
Error: Rate limit exceeded
```
**Solution:**
- Wait for rate limit to reset
- Implement exponential backoff
- Consider upgrading to paid tier for higher limits

#### **4. Invalid Response:**
```bash
Error: Invalid response from Gemini API
```
**Solution:**
- Check your prompt formatting
- Ensure the model is available
- Verify API connectivity

## 🎯 Testing Your Setup

### **Test with a Simple Prompt:**
```typescript
// Test the API connection
const testPrompt = "Hello, can you help me write a blog post?";
const result = await genAI.models.generateContent({
  model: "gemini-2.5-flash",
  contents: [{ role: "user", parts: [{ text: testPrompt }] }],
});
console.log(result.candidates[0].content.parts[0].text);
```

### **Test with YouTube Video:**
1. Go to your application
2. Paste a YouTube URL with captions
3. Click "Convert to Blog"
4. Verify the blog is generated successfully

## 📞 Support

### **Google AI Studio Documentation:**
- [Google AI Studio](https://makersuite.google.com/app/apikey)
- [Gemini API Documentation](https://ai.google.dev/docs)

### **Common Issues:**
- API key authentication problems
- Rate limiting issues
- Model availability
- Prompt formatting

### **Monitoring:**
- Check Google AI Studio for usage stats
- Monitor API response times
- Track error rates

---

*Last Updated: November 2025*