import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ozmwdkvxnxgjgkgxarht.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96bXdka3Z4bnhnamdrZ3hhcmh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNzYwMTIsImV4cCI6MjA2Nzc1MjAxMn0.Yz8qpdEe3HPytJyjXiQUfHAfLlYYQdMkhjxp88KMTjQ';

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export default supabase;