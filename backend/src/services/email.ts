import nodemailer from 'nodemailer';
import { config } from '../config';

export function getTransporter() {
  const user = (process.env.SMTP_USER || config.smtpUser)?.trim();
  const pass = (process.env.SMTP_PASS || config.smtpPass)?.trim().replace(/\s+/g, '');

  if (!user || !pass || user.includes('your-gmail') || pass.includes('your-16')) {
    return null;
  }

  // If user is Gmail, use nodemailer's dedicated 'gmail' service which handles Port 465/SSL cleanly across Linux cloud providers
  if (user.endsWith('@gmail.com') || (process.env.SMTP_HOST || config.smtpHost)?.includes('gmail')) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass
      }
    });
  }

  const host = process.env.SMTP_HOST || config.smtpHost || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || String(config.smtpPort) || '587', 10);
  const secure = port === 465 || (process.env.SMTP_SECURE || String(config.smtpSecure)) === 'true';

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

export const isSmtpConfigured = Boolean(
  (process.env.SMTP_USER || config.smtpUser) &&
  (process.env.SMTP_PASS || config.smtpPass) &&
  !(process.env.SMTP_USER || config.smtpUser).includes('your-gmail')
);

export async function sendOtpEmail(to: string, fullName: string, otp: string): Promise<{ success: boolean; error?: string }> {
  const transporter = getTransporter();
  const user = (process.env.SMTP_USER || config.smtpUser)?.trim();
  const fromName = process.env.SMTP_FROM_NAME || config.smtpFromName || 'NexPrep Placement Cell';

  if (!transporter || !user) {
    const msg = 'SMTP is not configured on the server. Please add SMTP_USER and SMTP_PASS to Render Environment Variables.';
    console.warn(`⚠️ Cannot send OTP email to ${to}: ${msg}`);
    return { success: false, error: msg };
  }

  const digits = otp.split('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#FBFAFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <div style="max-width:540px;margin:36px auto;background:#ffffff;border:1px solid #EAE6F5;border-radius:20px;overflow:hidden;box-shadow:0 8px 30px rgba(109,40,217,0.07);">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%);padding:32px 28px;text-align:center;color:white;">
          <h1 style="margin:0;font-size:26px;font-weight:900;letter-spacing:-0.5px;">NexPrep</h1>
          <p style="margin:6px 0 0;font-size:13px;color:#E9D5FF;font-weight:500;">Placement & Career Intelligence Platform</p>
        </div>

        <!-- Body Content -->
        <div style="padding:36px 32px;color:#181525;line-height:1.6;text-align:center;">
          <div style="width:56px;height:56px;border-radius:50%;background:#F3E8FF;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
            <span style="font-size:28px;">🔐</span>
          </div>

          <h2 style="margin:0 0 8px;font-size:22px;color:#181525;font-weight:800;">Verify Your Email Address</h2>
          <p style="margin:0 0 24px;font-size:14px;color:#6B7280;line-height:1.5;">
            Hi <strong>${fullName}</strong>, use the 4-digit verification code below to complete your NexPrep registration:
          </p>

          <!-- 4-Digit OTP Box -->
          <div style="margin:28px 0;text-align:center;">
            <div style="display:inline-flex;gap:12px;align-items:center;justify-content:center;">
              ${digits.map(d => `
                <div style="display:inline-block;width:56px;height:64px;line-height:64px;font-size:32px;font-weight:900;color:#6D28D9;background:#F5F3FF;border:2px solid #C4B5FD;border-radius:14px;text-align:center;font-family:monospace;box-shadow:0 2px 8px rgba(109,40,217,0.1);">
                  ${d}
                </div>
              `).join('')}
            </div>
          </div>

          <p style="margin:24px 0 0;font-size:13px;color:#6B7280;">
            ⏱️ This code is valid for <strong>10 minutes</strong>.<br>
            Never share this code with anyone.
          </p>

          <div style="margin-top:28px;padding-top:20px;border-top:1px solid #F3F4F6;font-size:12px;color:#9CA3AF;">
            If you didn't request this code, you can safely ignore this email.
          </div>
        </div>

        <!-- Footer -->
        <div style="background:#F9FAFB;padding:16px 28px;font-size:11px;color:#9CA3AF;text-align:center;border-top:1px solid #EAE6F5;">
          © ${new Date().getFullYear()} NexPrep · Career & Campus Placement Platform
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${user}>`,
      to,
      subject: `🔐 ${otp} is your NexPrep verification code`,
      text: `Your NexPrep 4-digit verification code is: ${otp}\n\nValid for 10 minutes.\n\nNexPrep Placement Cell`,
      html
    });
    console.log(`✅ 4-Digit OTP (${otp}) sent to ${to} (MessageId: ${info.messageId})`);
    return { success: true };
  } catch (err: any) {
    console.error(`❌ Failed to send OTP email to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
}

export async function sendWelcomeEmail(to: string, fullName: string, role: string) {
  const transporter = getTransporter();
  const user = (process.env.SMTP_USER || config.smtpUser)?.trim();
  const fromName = process.env.SMTP_FROM_NAME || config.smtpFromName || 'NexPrep Placement Cell';

  if (!transporter || !user) {
    console.warn('⚠️ Cannot send welcome email: SMTP not configured');
    return false;
  }

  const roleDisplay = role === 'admin' ? 'Placement Officer / Administrator' : 'Student Candidate';

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#FBFAFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <div style="max-width:600px;margin:30px auto;background:#ffffff;border:1px solid #EAE6F5;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(109,40,217,0.06);">
        <div style="background:linear-gradient(135deg, #6D28D9 0%, #8B5CF6 100%);padding:32px 28px;text-align:center;color:white;">
          <h1 style="margin:0;font-size:26px;font-weight:800;letter-spacing:-0.5px;">NexPrep</h1>
          <p style="margin:6px 0 0;font-size:14px;color:#E9D5FF;">Career & Campus Placement Platform</p>
        </div>
        <div style="padding:32px 28px;color:#181525;line-height:1.6;">
          <h2 style="margin:0 0 16px;font-size:20px;color:#181525;font-weight:700;">Welcome to NexPrep, ${fullName}! 🎉</h2>
          <p style="margin:0 0 16px;font-size:15px;color:#4B5563;">
            Your account has been successfully registered and activated as a <strong>${roleDisplay}</strong>.
          </p>
          <div style="background:#F5F3FF;border-left:4px solid #6D28D9;border-radius:8px;padding:16px;margin:20px 0;">
            <p style="margin:0;font-size:14px;color:#5B21B6;">
              <strong>Account Email:</strong> ${to}<br>
              <strong>Status:</strong> Active & Verified ✅
            </p>
          </div>
          <p style="margin:0 0 24px;font-size:14px;color:#4B5563;">
            You can now access your personalized dashboard, practice AI-powered mock interviews, take skill assessments, and apply for campus drives.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="https://nex-prep1.netlify.app/login" style="background:#6D28D9;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700;display:inline-block;box-shadow:0 4px 12px rgba(109,40,217,0.25);">
              Sign In to Your Dashboard →
            </a>
          </div>
          <p style="margin:0;font-size:13px;color:#9CA3AF;border-top:1px solid #F3F4F6;padding-top:20px;">
            If you did not create this account, please ignore this email.
          </p>
        </div>
        <div style="background:#F9FAFB;padding:16px 28px;font-size:12px;color:#9CA3AF;text-align:center;border-top:1px solid #EAE6F5;">
          © ${new Date().getFullYear()} NexPrep · Placement Cell & Career Intelligence
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${user}>`,
      to,
      subject: '🎉 Welcome to NexPrep — Your Account is Ready!',
      text: `Welcome to NexPrep, ${fullName}!\n\nYour account has been registered and verified.\n\nSign in to your dashboard: https://nex-prep1.netlify.app/login\n\nNexPrep Placement Cell`,
      html
    });
    console.log(`✅ Welcome email sent to ${to} (MessageId: ${info.messageId})`);
    return true;
  } catch (err: any) {
    console.error(`❌ Failed to send welcome email to ${to}:`, err.message);
    return false;
  }
}
