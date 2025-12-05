import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import VerifyEmail from "@/components/emails/verify-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    console.log("🧪 [TEST EMAIL] Starting test email send process");
    console.log("🧪 [TEST EMAIL] Target email:", email);
    console.log("🧪 [TEST EMAIL] Resend API Key exists:", !!process.env.RESEND_API_KEY);
    console.log("🧪 [TEST EMAIL] Email Sender Name:", process.env.EMAIL_SENDER_NAME);
    console.log("🧪 [TEST EMAIL] Email Sender Address:", process.env.EMAIL_SENDER_ADDRESS);

    const emailData = {
      from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
      to: email,
      subject: "Test Email - YouTube to Blog",
      react: VerifyEmail({ 
        username: "Test User", 
        verifyUrl: "https://example.com/verify" 
      }),
    };

    console.log("🧪 [TEST EMAIL] Email data prepared:", emailData);

    const result = await resend.emails.send(emailData);
    
    console.log("✅ [TEST EMAIL] Test email sent successfully:", result);
    
    return NextResponse.json({ 
      success: true, 
      message: "Test email sent successfully",
      result 
    });
  } catch (error) {
    console.error("❌ [TEST EMAIL] Failed to send test email:", error);
    console.error("❌ [TEST EMAIL] Error details:", JSON.stringify(error, null, 2));
    
    return NextResponse.json({ 
      error: "Failed to send test email",
      details: error 
    }, { status: 500 });
  }
}