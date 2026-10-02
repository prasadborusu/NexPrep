import emailjs from '@emailjs/browser';

// EmailJS Environment Variables (can be configured in .env or Netlify / Vercel dashboard)
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export const isEmailJSConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

export interface SendOtpEmailParams {
  to_name: string;
  to_email: string;
  otp_code: string;
  message?: string;
}

/**
 * Sends a 4-digit verification code directly from the client via EmailJS HTTPS API.
 * This bypasses any cloud server port restrictions completely.
 */
export async function sendOtpViaEmailJS({
  to_name,
  to_email,
  otp_code,
  message
}: SendOtpEmailParams): Promise<{ success: boolean; error?: string }> {
  if (!isEmailJSConfigured) {
    return {
      success: false,
      error: 'EmailJS keys (VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY) are not set.'
    };
  }

  try {
    const templateParams = {
      to_name: to_name || 'Candidate',
      to_email: to_email.trim(),
      otp_code: otp_code.trim(),
      reply_to: 'support@nexprep.edu',
      message: message || `Your 4-digit verification code for NexPrep is ${otp_code}. Valid for 10 minutes.`
    };

    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
      publicKey: PUBLIC_KEY
    });

    console.log('✅ EmailJS OTP sent successfully:', response.status, response.text);
    return { success: true };
  } catch (err: any) {
    console.warn('⚠️ EmailJS delivery error:', err?.text || err?.message || err);
    return {
      success: false,
      error: err?.text || err?.message || 'Failed to send verification email via EmailJS'
    };
  }
}
