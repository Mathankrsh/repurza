import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { lastLoginMethod } from "better-auth/plugins";
import { Resend } from "resend";
import ForgotPasswordEmail from "@/components/emails/reset-password";
import VerifyEmail from "@/components/emails/verify-email";
import { db } from "@/db/drizzle";
import { schema } from "@/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export const auth = betterAuth({
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      console.log("🔍 [EMAIL VERIFICATION] Starting email verification process");
      console.log("🔍 [EMAIL VERIFICATION] User:", user);
      console.log("🔍 [EMAIL VERIFICATION] Verification URL:", url);
      console.log("🔍 [EMAIL VERIFICATION] Resend API Key exists:", !!process.env.RESEND_API_KEY);
      console.log("🔍 [EMAIL VERIFICATION] Email Sender Name:", process.env.EMAIL_SENDER_NAME);
      console.log("🔍 [EMAIL VERIFICATION] Email Sender Address:", process.env.EMAIL_SENDER_ADDRESS);
      
      try {
        const emailData = {
          from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
          to: user.email,
          subject: "Verify your email",
          react: VerifyEmail({ username: user.name, verifyUrl: url }),
        };
        
        console.log("🔍 [EMAIL VERIFICATION] Email data prepared:", emailData);
        
        const result = await resend.emails.send(emailData);
        
        console.log("✅ [EMAIL VERIFICATION] Email sent successfully:", result);
      } catch (error) {
        console.error("❌ [EMAIL VERIFICATION] Failed to send verification email:", error);
        console.error("❌ [EMAIL VERIFICATION] Error details:", JSON.stringify(error, null, 2));
        throw error; // Re-throw to ensure the error is propagated
      }
    },
    sendOnSignUp: true,
  },

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      console.log("🔍 [PASSWORD RESET] Starting password reset email process");
      console.log("🔍 [PASSWORD RESET] User:", user);
      console.log("🔍 [PASSWORD RESET] Reset URL:", url);
      
      try {
        const emailData = {
          from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
          to: user.email,
          subject: "Reset your password",
          react: ForgotPasswordEmail({
            username: user.name,
            resetUrl: url,
            userEmail: user.email,
          }),
        };
        
        console.log("🔍 [PASSWORD RESET] Email data prepared:", emailData);
        
        const result = await resend.emails.send(emailData);
        
        console.log("✅ [PASSWORD RESET] Password reset email sent successfully:", result);
      } catch (error) {
        console.error("❌ [PASSWORD RESET] Failed to send password reset email:", error);
        console.error("❌ [PASSWORD RESET] Error details:", JSON.stringify(error, null, 2));
        throw error;
      }
    },
    requireEmailVerification: true,
  },

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  plugins: [lastLoginMethod(), nextCookies()],
});
