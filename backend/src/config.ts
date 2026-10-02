import dotenv from 'dotenv';
import path from 'path';
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath, override: true });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  supabaseUrl: process.env.SUPABASE_URL || 'https://mock-supabase.nexprep.internal',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'mock-anon-key',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  huggingfaceApiKey: process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY || '',
  hfModel: process.env.HF_MODEL || 'Qwen/Qwen3.5-9B',
  pistonApiUrl: process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston',
  nodeEnv: process.env.NODE_ENV || 'development',
  // SMTP / Email
  smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  smtpFromName: process.env.SMTP_FROM_NAME || 'NexPrep Placement Cell',
};
