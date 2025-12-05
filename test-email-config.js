// This script can be run with: node test-email-config.js
// Make sure to run it from the project root directory

const { Resend } = require('resend');

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

async function testEmailConfig() {
  console.log('🧪 Testing Resend Email Configuration');
  console.log('=====================================');
  
  // Check environment variables
  console.log('🔍 Environment Variables:');
  console.log('- RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
  console.log('- EMAIL_SENDER_NAME:', process.env.EMAIL_SENDER_NAME);
  console.log('- EMAIL_SENDER_ADDRESS:', process.env.EMAIL_SENDER_ADDRESS);
  
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is missing!');
    return;
  }
  
  if (!process.env.EMAIL_SENDER_ADDRESS) {
    console.error('❌ EMAIL_SENDER_ADDRESS is missing!');
    return;
  }
  
  try {
    // Initialize Resend client
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Test API connection by getting domains
    console.log('\n🔍 Testing Resend API connection...');
    const { data: domains, error } = await resend.domains.list();
    
    if (error) {
      console.error('❌ Failed to connect to Resend API:', error);
      return;
    }
    
    console.log('✅ Successfully connected to Resend API');
    console.log('📧 Verified domains:', domains?.data?.length || 0);
    
    if (domains?.data?.length > 0) {
      console.log('Available domains:');
      domains.data.forEach(domain => {
        console.log(`- ${domain.name} (verified: ${domain.verified})`);
      });
    }
    
    // Check if the sender email is from a verified domain
    const senderDomain = process.env.EMAIL_SENDER_ADDRESS.split('@')[1];
    const isDomainVerified = domains?.data?.some(domain => 
      domain.name === senderDomain && domain.verified
    );
    
    if (isDomainVerified) {
      console.log(`✅ Sender domain ${senderDomain} is verified`);
    } else {
      console.log(`⚠️  Sender domain ${senderDomain} might not be verified`);
      console.log('   Using @resend.dev domain should work for testing');
    }
    
  } catch (error) {
    console.error('❌ Error testing email configuration:', error);
  }
}

testEmailConfig();