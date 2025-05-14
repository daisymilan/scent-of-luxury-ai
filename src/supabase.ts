
// src/supabase.ts

import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://izmgpyqiiuuoulbtjhxb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6bWdweXFpaXV1b3VsYnRqaHhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3MzA2OTksImV4cCI6MjA1MjMwNjY5OX0.twZha1kvvBGQ_wk9r-R8hCIz5vLWVY6CskIerFYx6sw';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

// Create a single supabase client for the entire app with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export default supabase;
