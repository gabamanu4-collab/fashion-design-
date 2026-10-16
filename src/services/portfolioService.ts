import { supabase } from '../lib/supabase';
import { isSupabaseConfigured } from '../lib/config';
import { Portfolio, PortfolioThemeConfig, PortfolioSection } from '../types/database';
import { defaultThemeConfig, defaultSections } from '../constants/portfolioDefaults';
import { SAMPLE_PORTFOLIOS } from '../data/samplePortfolios';

export { defaultThemeConfig, defaultSections };

export async function fetchUserPortfolios(userId: string): Promise<{ data: Portfolio[]; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { data: [], error: new Error('Supabase not configured') };
  }
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('owner_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return { data: (data as Portfolio[]) || [], error: null };
  } catch (err: any) {
    return { data: [], error: err };
  }
}

export async function fetchPortfolioById(id: string): Promise<{ data: Portfolio | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase not configured') };
  }
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select(`
        *,
        owner:profiles(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data: data as Portfolio, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}


export async function fetchPortfolioBySlug(slug: string): Promise<{ data: Portfolio | null; error: Error | null }> {
  // First check if matching record exists in Supabase
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          owner:profiles(*)
        `)
        .eq('slug', slug)
        .single();

      if (data && !error) {
        if (data.publication_status === 'published' && data.visibility === 'public') {
          supabase.from('portfolio_views').insert({
            portfolio_id: data.id,
            referrer_domain: document.referrer ? new URL(document.referrer).hostname : 'direct',
          }).then(() => {});
        }
        return { data: data as Portfolio, error: null };
      }
    } catch {
      // Continue to check sample collections
    }
  }

  // Check pre-designed sample portfolios
  const sample = SAMPLE_PORTFOLIOS.find((p) => p.slug === slug);
  if (sample) {
    return { data: sample, error: null };
  }

  return { data: null, error: new Error('Portfolio not found') };
}

export async function checkSlugAvailability(slug: string, currentId?: string): Promise<boolean> {
  if (!isSupabaseConfigured) return true;
  try {
    let query = supabase.from('portfolios').select('id').eq('slug', slug);
    if (currentId) {
      query = query.neq('id', currentId);
    }
    const { data } = await query;
    return !data || data.length === 0;
  } catch {
    return true;
  }
}

export async function createPortfolio(data: {
  owner_id: string;
  title: string;
  slug: string;
  specialization?: string;
  theme?: Portfolio['theme'];
}): Promise<{ data: Portfolio | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase not configured') };
  }
  try {
    const newRecord = {
      owner_id: data.owner_id,
      title: data.title,
      slug: data.slug,
      specialization: data.specialization || 'Haute Couture',
      theme: data.theme || 'minimal-editorial',
      theme_config: defaultThemeConfig,
      section_config: defaultSections,
      visibility: 'public',
      publication_status: 'draft',
      moderation_status: 'approved',
      featured: false,
    };

    const { data: created, error } = await supabase
      .from('portfolios')
      .insert(newRecord)
      .select()
      .single();

    if (error) throw error;
    return { data: created as Portfolio, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function updatePortfolio(
  id: string,
  updates: Partial<Portfolio>
): Promise<{ data: Portfolio | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase not configured') };
  }
  try {
    const payload = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('portfolios')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data: data as Portfolio, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function duplicatePortfolio(id: string, newTitle: string, newSlug: string, ownerId: string) {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase not configured') };
  }
  try {
    const { data: original, error: fetchErr } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr) throw fetchErr;

    const copyData = {
      owner_id: ownerId,
      title: newTitle,
      slug: newSlug,
      subtitle: original.subtitle,
      introduction: original.introduction,
      cover_image_path: original.cover_image_path,
      specialization: original.specialization,
      theme: original.theme,
      theme_config: original.theme_config,
      section_config: original.section_config,
      visibility: 'private',
      publication_status: 'draft',
      moderation_status: 'approved',
      featured: false,
    };

    const { data: created, error } = await supabase
      .from('portfolios')
      .insert(copyData)
      .select()
      .single();

    if (error) throw error;
    return { data: created as Portfolio, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function deletePortfolio(id: string): Promise<{ success: boolean; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: new Error('Supabase not configured') };
  }
  try {
    const { error } = await supabase.from('portfolios').delete().eq('id', id);
    if (error) throw error;
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

export async function fetchPublicPortfolios(options: {
  search?: string;
  specialization?: string;
  userType?: string;
  theme?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ data: Portfolio[]; count: number; error: Error | null }> {
  const { search, specialization, userType, theme, page = 1, pageSize = 12 } = options;

  if (isSupabaseConfigured) {
    try {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from('portfolios')
        .select(
          `
          *,
          owner:profiles!inner(*)
        `,
          { count: 'exact' }
        )
        .eq('publication_status', 'published')
        .eq('visibility', 'public')
        .eq('moderation_status', 'approved');

      if (specialization && specialization !== 'all') {
        query = query.eq('specialization', specialization);
      }

      if (theme && theme !== 'all') {
        query = query.eq('theme', theme);
      }

      if (userType && userType !== 'all') {
        query = query.eq('owner.user_type', userType);
      }

      if (search && search.trim()) {
        const term = `%${search.trim()}%`;
        query = query.or(`title.ilike.${term},introduction.ilike.${term},specialization.ilike.${term}`);
      }

      query = query.order('featured', { ascending: false }).order('published_at', { ascending: false }).range(from, to);

      const { data, count, error } = await query;
      if (!error && data && data.length > 0) {
        return { data: data as Portfolio[], count: count || data.length, error: null };
      }
    } catch {
      // Fallback to sample portfolios
    }
  }

  // Filter sample portfolios
  let filtered = [...SAMPLE_PORTFOLIOS];
  if (specialization && specialization !== 'all') {
    filtered = filtered.filter((p) => p.specialization?.toLowerCase() === specialization.toLowerCase());
  }
  if (theme && theme !== 'all') {
    filtered = filtered.filter((p) => p.theme === theme);
  }
  if (userType && userType !== 'all') {
    filtered = filtered.filter((p) => p.owner?.user_type === userType);
  }
  if (search && search.trim()) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        (p.introduction && p.introduction.toLowerCase().includes(term)) ||
        (p.owner?.display_name && p.owner.display_name.toLowerCase().includes(term))
    );
  }

  return { data: filtered, count: filtered.length, error: null };
}

export async function fetchFeaturedPortfolios(): Promise<{ data: Portfolio[]; error: Error | null }> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select(`
          *,
          owner:profiles(*)
        `)
        .eq('publication_status', 'published')
        .eq('visibility', 'public')
        .eq('moderation_status', 'approved')
        .order('featured', { ascending: false })
        .order('published_at', { ascending: false })
        .limit(6);

      if (!error && data && data.length > 0) {
        return { data: data as Portfolio[], error: null };
      }
    } catch {
      // Fallback
    }
  }

  // Pre-designed featured fashion portfolios
  return { data: SAMPLE_PORTFOLIOS, error: null };
}
