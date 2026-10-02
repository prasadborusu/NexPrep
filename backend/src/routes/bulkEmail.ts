import { Router, Request, Response } from 'express';
import multer from 'multer';
import { memoryStore, persistStore } from '../services/db';
import { BulkEmailLog } from '../types';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const EMAIL_TEMPLATES: Record<string, { subject: string; body: string }> = {
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

// Get available templates
router.get('/templates', (req: Request, res: Response) => {
  return res.json(EMAIL_TEMPLATES);
});

// Parse uploaded CSV and preview recipients
router.post('/parse-csv', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please upload a CSV file' });
  }

  const content = req.file.buffer.toString('utf-8');
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);

  if (lines.length < 2) {
    return res.status(400).json({ error: 'CSV file must have at least a header and 1 row' });
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
    recipients: recipients.slice(0, 50) // preview first 50
  });
});

// Preview email with template and variables
router.post('/preview', (req: Request, res: Response) => {
  const { template_key, variables, custom_subject, custom_body } = req.body;
  const template = EMAIL_TEMPLATES[template_key] || {
    subject: custom_subject || 'Placement Update',
    body: custom_body || 'Hello {{name}}'
  };

  let renderedSubject = template.subject;
  let renderedBody = template.body;

  const vars = { name: 'Candidate Name', company: 'Company', role: 'Software Engineer', cgpa: '7.5', deadline: 'Upcoming Date', assessment_title: 'Assessment', ...variables };

  Object.entries(vars).forEach(([k, v]) => {
    const reg = new RegExp(`{{${k}}}`, 'g');
    renderedSubject = renderedSubject.replace(reg, String(v));
    renderedBody = renderedBody.replace(reg, String(v));
  });

  return res.json({
    subject: renderedSubject,
    body: renderedBody
  });
});

// Send Bulk Email (processes list, records delivery metrics, logs)
router.post('/send', (req: Request, res: Response) => {
  const { admin_id = 'institutional-admin', template_name, subject, recipients } = req.body;

  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ error: 'No recipients provided' });
  }

  // Simulate enterprise dispatch with tracking
  const preview = recipients.slice(0, 20).map((r: any) => ({
    email: r.email,
    name: r.name || r.email.split('@')[0],
    status: (r.email.includes('invalid') ? 'failed' : 'sent') as 'sent' | 'failed'
  }));

  const failedCount = preview.filter(p => p.status === 'failed').length;
  const successCount = recipients.length - failedCount;

  const log: BulkEmailLog = {
    id: `email-${Date.now()}`,
    admin_id,
    subject: subject || 'Placement Communication',
    template_name: template_name || 'Custom',
    recipients_count: recipients.length,
    success_count: successCount,
    failed_count: failedCount,
    recipients_preview: preview,
    sent_at: new Date().toISOString()
  };

  memoryStore.bulk_email_logs.unshift(log);
  persistStore();

  return res.status(201).json({
    message: `Dispatched ${successCount} emails successfully`,
    log
  });
});

// Get Bulk Email Logs
router.get('/logs', (req: Request, res: Response) => {
  return res.json(memoryStore.bulk_email_logs);
});

export default router;
