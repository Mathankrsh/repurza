# Email Verification Debugging Guide

This guide will help you debug the email verification issue in your YouTube to Blog application.

## 🔍 What We've Added for Debugging

1. **Enhanced Logging**: Added detailed console logs to track the email sending process
2. **Test Email Endpoint**: Created `/api/test-email` to test email sending directly
3. **Configuration Test Script**: Created `test-email-config.js` to verify Resend setup
4. **Test HTML Page**: Created `test-email.html` for easy testing

## 🧪 Step-by-Step Debugging Process

### Step 1: Test Your Resend Configuration

First, let's verify your Resend API key and domain configuration:

```bash
node test-email-config.js
```

This will check:
- If your RESEND_API_KEY is valid
- If your sender domain is verified
- Available domains in your Resend account

### Step 2: Start Your Development Server

Make sure your Next.js app is running:

```bash
npm run dev
```

Keep an eye on the terminal for the new debug logs we've added.

### Step 3: Test Email Sending Directly

Open `test-email.html` in your browser (you can open it directly or serve it through your app):

1. Open the HTML file: `http://localhost:3000/test-email.html` (if you move it to public folder) or just open the file directly
2. Enter your email address
3. Click "Send Test Email"
4. Check both:
   - Your email inbox (and spam folder)
   - The browser console (F12)
   - Your terminal where the server is running

### Step 4: Test the Full Signup Flow

1. Go to your signup page: `http://localhost:3000/signup`
2. Try signing up with a new email
3. Watch the terminal for debug logs with these patterns:
   - `🔍 [SIGNUP FORM]` - Signup process logs
   - `🔍 [EMAIL VERIFICATION]` - Email verification process logs
   - `✅ [EMAIL VERIFICATION]` - Success logs
   - `❌ [EMAIL VERIFICATION]` - Error logs

## 🔍 What to Look For in the Logs

### Successful Email Sending:
```
🔍 [EMAIL VERIFICATION] Starting email verification process
🔍 [EMAIL VERIFICATION] User: { id: "...", email: "user@example.com", ... }
🔍 [EMAIL VERIFICATION] Verification URL: http://localhost:3000/verify?token=...
🔍 [EMAIL VERIFICATION] Resend API Key exists: true
🔍 [EMAIL VERIFICATION] Email data prepared: { from: "...", to: "...", ... }
✅ [EMAIL VERIFICATION] Email sent successfully: { id: "resend_email_id" }
```

### Common Issues and Error Messages:

1. **API Key Issues:**
   ```
   ❌ [EMAIL VERIFICATION] Failed to send verification email: { message: "Invalid API key" }
   ```

2. **Domain Not Verified:**
   ```
   ❌ [EMAIL VERIFICATION] Failed to send verification email: { message: "From address domain not verified" }
   ```

3. **Rate Limiting:**
   ```
   ❌ [EMAIL VERIFICATION] Failed to send verification email: { message: "Rate limit exceeded" }
   ```

## 🛠️ Common Solutions

### Issue 1: Using @resend.dev Domain
You're currently using `onboarding@resend.dev` which is Resend's default domain. This should work for testing, but has limitations.

**Solution:** For production, you should:
1. Add your own domain in Resend dashboard
2. Verify the domain with DNS records
3. Update `.env.local` to use your verified domain

### Issue 2: API Key Permissions
Make sure your Resend API key has the necessary permissions.

**Solution:** 
1. Go to Resend dashboard
2. Check your API key permissions
3. Generate a new key if needed

### Issue 3: Email Going to Spam
Sometimes emails go to spam folder, especially with default domains.

**Solution:**
1. Check spam/junk folder thoroughly
2. Try with a different email provider (Gmail, Outlook, etc.)
3. Add the sender to your contacts if found in spam

### Issue 4: Environment Variables Not Loading
Sometimes environment variables don't load properly in development.

**Solution:**
1. Ensure `.env.local` is in the project root
2. Restart your development server after changing env vars
3. Check that the variables are loaded with the test script

## 📊 Testing Checklist

- [ ] Run `node test-email-config.js` and verify Resend setup
- [ ] Start development server and watch for logs
- [ ] Test email sending via `test-email.html`
- [ ] Test full signup flow and check terminal logs
- [ ] Check email inbox AND spam folder
- [ ] Verify all environment variables are loaded correctly

## 🚨 If Issues Persist

If you've tried all the above and still don't receive emails:

1. **Check Resend Dashboard:** Look at your email sending history in the Resend dashboard
2. **Verify Domain Status:** Ensure your sending domain is verified
3. **Check Rate Limits:** Resend has free tier limits (100 emails/day)
4. **Try Different Email:** Test with different email providers
5. **Check Network:** Ensure your server can reach Resend's API

## 📝 Next Steps

Once you identify the issue from the logs:

1. **If API Key Issue:** Update the RESEND_API_KEY in `.env.local`
2. **If Domain Issue:** Add and verify your domain in Resend dashboard
3. **If Configuration Issue:** Update EMAIL_SENDER_ADDRESS in `.env.local`
4. **If Rate Limit Issue:** Wait or upgrade your Resend plan

Remember to restart your development server after making any changes to environment variables!