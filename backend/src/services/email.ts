import nodemailer from 'nodemailer';
import { config } from '../config';

export const isSmtpConfigured = Boolean(
  config.smtpUser &&
  config.smtpPass &&
  !config.smtpUser.includes('your-gmail') &&
  !config.smtpPass.includes('your-16')
);

export const transporter = isSmtpConfigured
  ? nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass
      }
    })
  : null;

if (isSmtpConfigured) {
  console.log(`📧 Gmail SMTP configured & active: ${config.smtpUser}`);
} else {
  console.log('⚠️ SMTP not configured in backend/.env');
}

export async function sendWelcomeEmail(to: string, fullName: string, role: string) {
  if (!transporter || !isSmtpConfigured) {
    console.warn('⚠️ Cannot send email: SMTP not configured');
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
            <a href="http://localhost:5173/login" style="background:#6D28D9;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700;display:inline-block;box-shadow:0 4px 12px rgba(109,40,217,0.25);">
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
      from: `"${config.smtpFromName || 'NexPrep Placement Cell'}" <${config.smtpUser}>`,
      to,
      subject: '🎉 Welcome to NexPrep — Your Account is Ready!',
      text: `Welcome to NexPrep, ${fullName}!\n\nYour account has been registered and verified.\n\nSign in to your dashboard: http://localhost:5173/login\n\nNexPrep Placement Cell`,
      html
    });
    console.log(`✅ Welcome email sent to ${to} (MessageId: ${info.messageId})`);
    return true;
  } catch (err: any) {
    console.error(`❌ Failed to send welcome email to ${to}:`, err.message);
    return false;
  }
}
