/**
 * Supabase configuration module
 * Validates environment variables and local credentials and provides connection status.
 */

export const DEFAULT_SUPABASE_PROJECT_REF = 'dipdxptwolhrlwylawlh';
export const DEFAULT_SUPABASE_URL = 'https://dipdxptwolhrlwylawlh.supabase.co';
export const DEFAULT_SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpcGR4cHR3b2xocmx3eWxhd2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4Njk2NzYsImV4cCI6MjEwNzQ0NTY3Nn0.Dy-omCazmKOc7Kom7xNmyccz645a5FYrF3O3ajo77kE';
export const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_4foqEOhNy0QWwTiNJdH0HQ_pPxFlqHt';

/**
 * Super Administrator identities
 * The platform grants full administrative privileges to these emails.
 */
export const SUPER_ADMIN_EMAILS = ['gabamanu4@gmail.com'];

export const isSuperAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === email.trim().toLowerCase());
};

/**
 * Normalizes user-provided or environment Supabase URL.
 * Strips accidental trailing slashes and REST / auth endpoints.
 */
export const normalizeSupabaseUrl = (rawUrl: string): string => {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  url = url.replace(/\/+$/, '');
  url = url.replace(/\/rest\/v1\/?$/, '');
  url = url.replace(/\/auth\/v1\/?$/, '');
  url = url.replace(/\/storage\/v1\/?$/, '');
  return url;
};

const getStoredItem = (key: string): string => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return (localStorage.getItem(key) || '').trim();
    } catch {
      return '';
    }
  }
  return '';
};

export const getEffectiveSupabaseUrl = (): string => {
  const custom = getStoredItem('supabase_custom_url');
  if (custom && custom.startsWith('http') && !custom.includes('your-project-id') && !custom.includes('placeholder')) {
    return normalizeSupabaseUrl(custom);
  }
  const envVal = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || '';
  if (envVal && envVal.startsWith('http') && !envVal.includes('your-project-id') && !envVal.includes('placeholder')) {
    return normalizeSupabaseUrl(envVal);
  }
  return DEFAULT_SUPABASE_URL;
};

export const getEffectiveSupabaseKey = (): string => {
  const custom = getStoredItem('supabase_custom_key');
  if (custom && custom.length > 20 && !custom.includes('your-anon-key') && !custom.includes('placeholder')) {
    return custom;
  }
  const envVal = (
    (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
    (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)
  )?.trim() || '';
  if (envVal && envVal.length > 20 && !envVal.includes('your-anon-key') && !envVal.includes('placeholder')) {
    return envVal;
  }
  return DEFAULT_SUPABASE_KEY;
};

export const getSupabaseProjectRef = (url?: string): string => {
  const targetUrl = url || getEffectiveSupabaseUrl();
  try {
    const parsed = new URL(targetUrl);
    const hostParts = parsed.hostname.split('.');
    if (hostParts.length >= 3 && hostParts[1] === 'supabase') {
      return hostParts[0];
    }
  } catch {
    // fallback
  }
  return DEFAULT_SUPABASE_PROJECT_REF;
};

export const SUPABASE_URL = getEffectiveSupabaseUrl();
export const SUPABASE_KEY = getEffectiveSupabaseKey();

export const isSupabaseConfigured = Boolean(
  getEffectiveSupabaseUrl() && getEffectiveSupabaseKey()
);

export const checkIsSupabaseConfigured = (): boolean => {
  return Boolean(getEffectiveSupabaseUrl() && getEffectiveSupabaseKey());
};

export const saveCustomSupabaseConfig = (url: string, key: string): void => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const cleanUrl = normalizeSupabaseUrl(url);
    localStorage.setItem('supabase_custom_url', cleanUrl);
    localStorage.setItem('supabase_custom_key', key.trim());
    window.dispatchEvent(new CustomEvent('supabase-config-changed'));
  }
};

export const clearCustomSupabaseConfig = (): void => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('supabase_custom_url');
    localStorage.removeItem('supabase_custom_key');
    window.dispatchEvent(new CustomEvent('supabase-config-changed'));
  }
};

export const BUCKET_NAME = 'portfolio-media';

// Application hosting URLs for Supabase Auth redirect configuration
export const APP_CURRENT_URL = typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-umnv4isp5zaivxubnrpadm-188113982292.asia-southeast1.run.app';
export const APP_DEV_URL = 'https://ais-dev-umnv4isp5zaivxubnrpadm-188113982292.asia-southeast1.run.app';
export const APP_PRE_URL = 'https://ais-pre-umnv4isp5zaivxubnrpadm-188113982292.asia-southeast1.run.app';

export const configErrorMessage = !isSupabaseConfigured
  ? `Supabase is not configured yet. Please provide your Supabase URL and anon key in the Database Setup page or environment variables.`
  : null;
