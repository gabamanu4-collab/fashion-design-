import { supabase, deleteMediaFile } from '../lib/supabase';
import { isSupabaseConfigured } from '../lib/config';
import { Project, ProjectImage, Category } from '../types/database';

export async function fetchUserProjects(userId: string): Promise<{ data: Project[]; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { data: [], error: new Error('Supabase not configured') };
  }
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        category:categories(*),
        images:project_images(*)
      `)
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data: (data as Project[]) || [], error: null };
  } catch (err: any) {
    return { data: [], error: err };
  }
}

export async function fetchProjectById(id: string): Promise<{ data: Project | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase not configured') };
  }
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        category:categories(*),
        images:project_images(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data: data as Project, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function createProject(
  payload: Partial<Project> & { owner_id: string; title: string; slug: string }
): Promise<{ data: Project | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase not configured') };
  }
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...payload,
        publication_status: payload.publication_status || 'published',
        tags: payload.tags || [],
        tools: payload.tools || [],
        credits: payload.credits || {},
      })
      .select(`
        *,
        category:categories(*)
      `)
      .single();

    if (error) throw error;
    return { data: data as Project, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function updateProject(
  id: string,
  updates: Partial<Project>
): Promise<{ data: Project | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase not configured') };
  }
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        category:categories(*),
        images:project_images(*)
      `)
      .single();

    if (error) throw error;
    return { data: data as Project, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function deleteProject(id: string): Promise<{ success: boolean; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { success: false, error: new Error('Supabase not configured') };
  }
  try {
    // 1. Fetch images to cleanup storage
    const { data: images } = await supabase
      .from('project_images')
      .select('storage_path')
      .eq('project_id', id);

    if (images && images.length > 0) {
      for (const img of images) {
        if (img.storage_path) {
          await deleteMediaFile(img.storage_path);
        }
      }
    }

    // 2. Delete project from DB (cascades to project_images and portfolio_projects)
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

export async function addProjectImage(payload: {
  project_id: string;
  owner_id: string;
  storage_path: string;
  alt_text?: string;
  caption?: string;
  display_order?: number;
}): Promise<{ data: ProjectImage | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase not configured') };
  }
  try {
    const { data, error } = await supabase
      .from('project_images')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return { data: data as ProjectImage, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

export async function deleteProjectImage(imageId: string, storagePath: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    await deleteMediaFile(storagePath);
    const { error } = await supabase.from('project_images').delete().eq('id', imageId);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) {
    return [
      { id: '1', name: 'Haute Couture', slug: 'haute-couture', description: 'Bespoke runway garments', enabled: true, created_at: '', updated_at: '' },
      { id: '2', name: 'Ready-to-Wear (RTW)', slug: 'ready-to-wear', description: 'Commercial fashion collections', enabled: true, created_at: '', updated_at: '' },
      { id: '3', name: 'Avant-Garde & Wearable Art', slug: 'avant-garde', description: 'Conceptual sculptural fashion', enabled: true, created_at: '', updated_at: '' },
      { id: '4', name: 'Sustainable & Circular Fashion', slug: 'sustainable', description: 'Zero-waste and eco-conscious', enabled: true, created_at: '', updated_at: '' },
      { id: '5', name: 'Knitwear & Textile Design', slug: 'knitwear-textiles', description: 'Engineered knits and surfaces', enabled: true, created_at: '', updated_at: '' },
    ];
  }
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('enabled', true)
      .order('name');

    if (error) throw error;
    return (data as Category[]) || [];
  } catch {
    return [];
  }
}
