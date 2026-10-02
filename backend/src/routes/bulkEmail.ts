import { Router, Request, Response } from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import { memoryStore, persistStore } from '../services/db';
import { BulkEmailLog } from '../types';
import { config } from '../config';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// ─── Create Nodemailer Transporter ───────────────────────
const isSmtpConfigured = Boolean(config.smtpUser && config.smtpPass &&
  !config.smtpUser.includes('your-gmail') && !config.smtpPass.includes('your-16'));

const transporter = isSmtpConfigured
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
  console.log(`📧 Gmail SMTP configured: ${config.smtpUser}`);
} else {
  console.log('⚠️  SMTP not configured. Add SMTP_USER & SMTP_PASS to backend/.env to enable real emails.');
}

// ─── Email Templates ─────────────────────────────────────
const EMAIL_TEMPLATES: Record<string, { subject: string; body: string; html?: string }> = {
  drive_announcement: {
    subject: 'New Placement Drive Alert: {{company}} - {{role}}',
    body: 'Dear {{name}},\n\nA new campus placement drive for {{company}} (Role: {{role}}) is now open on NexPrep.\n\nEligibility: Min CGPA {{cgpa}}\nDeadline: {{deadline}}\n\nPlease review the drive guidelines and apply promptly via your student portal.\n\nBest regards,\nNexPrep Placement & Training Cell'
  },
  assessment_reminder: {
    subject: 'Upcoming Assessment: {{assessment_title}}',
    body: 'Hi {{name}},\n\nThis is a friendly reminder that {{assessment_title}} is scheduled to begin soon. Ensure your workstation meets technical criteria and check the practice coding problems on NexPrep.\n\nGood luck,\nNexPrep Team'
  },
  shortlist_notification: {
    subject: 'Congratulations! You are shortlisted for {{company}}',
    body: 'Dear {{name}},\n\nWe are pleased to inform you that based on your performance in the online screening, you have been shortlisted for the next technical round at {{company}}.\n\nCheck your portal for interview schedule details.\n\nWarm regards,\nNexPrep Placement Office'
  }
};

// ─── Render template variables ────────────────────────────
function renderTemplate(template: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce((result, [k, v]) => {
    return result.replace(new RegExp(`{{${k}}}`, 'g'), v);
  }, template);
}

// ─── Build HTML email body ────────────────────────────────
function buildHtmlEmail(subject: string, bodyText: string, recipientName: string): string {
  const bodyHtml = bodyText.replace(/\n/g, '<br>');
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:Inter,Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#6D28D9,#8B5CF6);padding:28px 32px;">
      <div style="color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">NexPrep</div>
      <div style="color:#DDD6FE;font-size:12px;margin-top:2px;">Career & Placement Platform</div>
    </div>
    <!-- Body -->
    <div style="padding:32px;color:#1F2937;font-size:15px;line-height:1.7;">
      <h2 style="margin:0 0 16px;font-size:18px;color:#111827;">${subject}</h2>
      <p style="margin:0 0 24px;">${bodyHtml}</p>
      <a href="https://nexprep.vercel.app/student/dashboard"
         style="display:inline-block;background:#6D28D9;color:#fff;padding:12px 28px;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none;">
        Open NexPrep Portal →
      </a>
    </div>
    <!-- Footer -->
    <div style="background:#F9FAFB;border-top:1px solid #E5E7EB;padding:20px 32px;font-size:12px;color:#9CA3AF;">
      © ${new Date().getFullYear()} NexPrep · Career & Placement Preparation Platform<br>
      This email was sent to ${recipientName}. <a href="#" style="color:#6D28D9;">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`;
}

// ─── GET /templates ───────────────────────────────────────
router.get('/templates', (req: Request, res: Response) => {
  return res.json(EMAIL_TEMPLATES);
});

// ─── GET /status ──────────────────────────────────────────
router.get('/status', (req: Request, res: Response) => {
  return res.json({
    configured: isSmtpConfigured,
    provider: isSmtpConfigured ? `Gmail (${config.smtpUser})` : 'Not configured',
    message: isSmtpConfigured
      ? 'SMTP is ready to send real emails'
      : 'Add SMTP_USER and SMTP_PASS to backend/.env to enable real email sending'
  });
});

// ─── POST /test ───────────────────────────────────────────
router.post('/test', async (req: Request, res: Response) => {
  const { to } = req.body;
  if (!to) return res.status(400).json({ error: 'Provide a "to" email address' });

  if (!transporter || !isSmtpConfigured) {
    return res.status(503).json({
      error: 'SMTP not configured',
      message: 'Add SMTP_USER and SMTP_PASS to backend/.env. See instructions below.',
      instructions: [
        '1. Go to myaccount.google.com',
        '2. Security → 2-Step Verification (enable it)',
        '3. Security → App Passwords → Generate for "Mail"',
        '4. Copy the 16-char password into SMTP_PASS in backend/.env',
        '5. Set SMTP_USER to your Gmail address',
        '6. Restart backend'
      ]
    });
  }

  try {
    await transporter.verify();
    await transporter.sendMail({
      from: `"${config.smtpFromName}" <${config.smtpUser}>`,
      to,
      subject: '✅ NexPrep Email Test — SMTP is Working!',
      text: `This is a test email from NexPrep.\n\nIf you received this, your SMTP configuration is working correctly.\n\nSMTP: ${config.smtpHost}:${config.smtpPort}\nSender: ${config.smtpUser}`,
      html: buildHtmlEmail(
        '✅ NexPrep Email Test — SMTP is Working!',
        `This is a test email from NexPrep.\n\nIf you received this, your Gmail SMTP configuration is working correctly.\n\nSMTP Host: ${config.smtpHost}\nPort: ${config.smtpPort}\nSender: ${config.smtpUser}`,
        to
      )
    });
    return res.json({ success: true, message: `Test email sent to ${to}` });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message,
      hint: err.code === 'EAUTH'
        ? 'Authentication failed. Make sure you are using a Gmail App Password (not your regular Gmail password).'
        : 'Check your SMTP credentials in backend/.env'
    });
  }
});

// ─── POST /parse-csv ──────────────────────────────────────
router.post('/parse-csv', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ error: 'Please upload a CSV file' });

  const content = req.file.buffer.toString('utf-8');
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);

  if (lines.length < 2) {
    return res.status(400).json({ error: 'CSV must have at least a header row and 1 data row' });
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const emailIdx = headers.findIndex(h => h.includes('email'));
  const nameIdx = headers.findIndex(h => h.includes('name'));

  if (emailIdx === -1) {
    return res.status(400).json({ error: 'CSV must contain an "email" column' });
  }

  const recipients = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
    if (cols[emailIdx]) {
      recipients.push({
        email: cols[emailIdx],
        name: nameIdx !== -1 ? cols[nameIdx] : cols[emailIdx].split('@')[0],
        meta: cols
      });
    }
  }

  return res.json({
    total_parsed: recipients.length,
    headers,
    recipients: recipients.slice(0, 50)
  });
});

// ─── POST /preview ────────────────────────────────────────
router.post('/preview', (req: Request, res: Response) => {
  const { template_key, variables, custom_subject, custom_body } = req.body;
  const template = EMAIL_TEMPLATES[template_key] || {
    subject: custom_subject || 'Placement Update',
    body: custom_body || 'Hello {{name}}'
  };

  const vars = {
    name: 'Candidate Name', company: 'Accenture', role: 'Software Engineer',
    cgpa: '7.5', deadline: 'Oct 15, 2026', assessment_title: 'Core CS Screening',
    ...variables
  };

  const renderedSubject = renderTemplate(template.subject, vars);
  const renderedBody = renderTemplate(template.body, vars);

  return res.json({
    subject: renderedSubject,
    body: renderedBody,
    html: buildHtmlEmail(renderedSubject, renderedBody, vars.name)
  });
});

// ─── POST /send ───────────────────────────────────────────
router.post('/send', async (req: Request, res: Response) => {
  const { admin_id = 'institutional-admin', template_name, template_key, subject, body, recipients, variables = {} } = req.body;

  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ error: 'No recipients provided' });
  }

  // Get template content
  const template = EMAIL_TEMPLATES[template_key];
  const finalSubject = subject || template?.subject || 'NexPrep Notification';
  const finalBody = body || template?.body || 'Hello {{name}}';

  let successCount = 0;
  let failedCount = 0;
  const preview: { email: string; name: string; status: 'sent' | 'failed' | 'simulated' }[] = [];

  if (transporter && isSmtpConfigured) {
    // ── REAL sending via Gmail SMTP ──
    for (const recipient of recipients) {
      const vars = { name: recipient.name || recipient.email.split('@')[0], ...variables };
      const personalizedSubject = renderTemplate(finalSubject, vars);
      const personalizedBody = renderTemplate(finalBody, vars);

      try {
        await transporter.sendMail({
          from: `"${config.smtpFromName}" <${config.smtpUser}>`,
          to: recipient.email,
          subject: personalizedSubject,
          text: personalizedBody,
          html: buildHtmlEmail(personalizedSubject, personalizedBody, vars.name)
        });
        successCount++;
        preview.push({ email: recipient.email, name: vars.name, status: 'sent' });
      } catch (err: any) {
        failedCount++;
        preview.push({ email: recipient.email, name: vars.name, status: 'failed' });
        console.error(`Failed to send to ${recipient.email}:`, err.message);
      }
    }
  } else {
    // ── SIMULATED sending (no SMTP configured) ──
    successCount = recipients.length;
    recipients.slice(0, 20).forEach((r: any) => {
      preview.push({ email: r.email, name: r.name || r.email.split('@')[0], status: 'simulated' });
    });
    console.log(`[SIMULATED] Would send ${recipients.length} emails. Configure SMTP to send real emails.`);
  }

  const log: BulkEmailLog = {
    id: `email-${Date.now()}`,
    admin_id,
    subject: finalSubject,
    template_name: template_name || template_key || 'Custom',
    recipients_count: recipients.length,
    success_count: successCount,
    failed_count: failedCount,
    recipients_preview: preview,
    sent_at: new Date().toISOString()
  };

  memoryStore.bulk_email_logs.unshift(log);
  persistStore();

  return res.status(201).json({
    message: isSmtpConfigured
      ? `✅ Sent ${successCount} real emails via Gmail SMTP`
      : `📋 Simulated ${successCount} emails (SMTP not configured — add credentials to send real emails)`,
    real_send: isSmtpConfigured,
    log
  });
});

// ─── GET /logs ────────────────────────────────────────────
router.get('/logs', (req: Request, res: Response) => {
  return res.json(memoryStore.bulk_email_logs);
});

export default router;
