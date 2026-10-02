import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  supabaseUrl: process.env.SUPABASE_URL || 'https://mock-supabase.nexprep.internal',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'mock-anon-key',
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY || '',
  hfModel: process.env.HF_MODEL || 'Qwen/Qwen3-8B',
  pistonApiUrl: process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston',
  nodeEnv: process.env.NODE_ENV || 'development'
};
