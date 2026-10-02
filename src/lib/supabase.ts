import { createClient, SupabaseClient } from '@supabase/supabase-js';

function sanitizeUrl(str: string): string {
  let clean = (str || '').trim().replace(/^['"]|['"]$/g, '');
  if (clean.includes('=')) {
    clean = clean.split('=').pop()?.trim() || clean;
  }
  return clean.replace(/^['"]|['"]$/g, '');
}

function sanitizeKey(str: string): string {
  let clean = (str || '').trim().replace(/^['"]|['"]$/g, '');
  if (clean.includes('=')) {
    clean = clean.split('=').pop()?.trim() || clean;
  }
  return clean.replace(/^['"]|['"]$/g, '');
}

const rawUrl = sanitizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || '');
const rawKey = sanitizeKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

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
