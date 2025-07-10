import { createClient } from '@supabase/supabase-js';

// Use environment variables or fallback to hardcoded values for development
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ozmwdkvxnxgjgkgxarht.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96bXdka3Z4bnhnamdrZ3hhcmh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNzYwMTIsImV4cCI6MjA2Nzc1MjAxMn0.Yz8qpdEe3HPytJyjXiQUfHAfLlYYQdMkhjxp88KMTjQ';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export default supabase;