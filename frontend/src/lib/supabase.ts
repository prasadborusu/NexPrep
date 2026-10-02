import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-supabase.nexprep.internal';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key';

export const isLiveSupabase = Boolean(
  supabaseUrl &&
  !supabaseUrl.includes('mock-supabase') &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'mock-anon-key'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
