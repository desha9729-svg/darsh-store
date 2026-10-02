import { createClient, SupabaseClient } from '@supabase/supabase-js';

const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
const rawKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && !url.includes('your-project-id');
  } catch {
    return false;
  }
}

export const isSupabaseConfigured: boolean = Boolean(
  rawUrl &&
  rawKey &&
  isValidUrl(rawUrl)
);

function getSafeClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  try {
    return createClient(rawUrl, rawKey);
  } catch (err) {
    console.warn('Safe Supabase Client Catch:', err);
    return null;
  }
}

export const supabase: SupabaseClient | null = getSafeClient();
