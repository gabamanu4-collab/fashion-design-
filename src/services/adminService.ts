import { supabase } from '../lib/supabase';
import { isSupabaseConfigured } from '../lib/config';
import { Profile, Portfolio, Category, Report, AdminAuditLog, PlatformSetting, ContactSubmission } from '../types/database';

export interface AdminStats {
  totalUsers: number;
  verifiedUsers: number;
  activeUsers: number;
  totalPortfolios: number;
  publishedPortfolios: number;
  draftPortfolios: number;
  pendingReports: number;
  totalViews: number;
}

export async function fetchPlatformStats(): Promise<AdminStats> {
  const fallbackStats: AdminStats = {
    totalUsers: 0,
    verifiedUsers: 0,
    activeUsers: 0,
    totalPortfolios: 0,
    publishedPortfolios: 0,
    draftPortfolios: 0,
    pendingReports: 0,
    totalViews: 0,
  };

  if (!isSupabaseConfigured) return fallbackStats;

  try {
    const [usersRes, activeUsersRes, portfoliosRes, publishedPortRes, draftsRes, reportsRes, viewsRes] =
      await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('account_status', 'active'),
        supabase.from('portfolios').select('id', { count: 'exact', head: true }),
        supabase.from('portfolios').select('id', { count: 'exact', head: true }).eq('publication_status', 'published'),
        supabase.from('portfolios').select('id', { count: 'exact', head: true }).eq('publication_status', 'draft'),
        supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('portfolio_views').select('id', { count: 'exact', head: true }),
      ]);

    return {
      totalUsers: usersRes.count || 0,
      verifiedUsers: activeUsersRes.count || 0,
      activeUsers: activeUsersRes.count || 0,
      totalPortfolios: portfoliosRes.count || 0,
      publishedPortfolios: publishedPortRes.count || 0,
      draftPortfolios: draftsRes.count || 0,
      pendingReports: reportsRes.count || 0,
      totalViews: viewsRes.count || 0,
    };
  } catch (err) {
    console.error('Error fetching admin statistics:', err);
    return fallbackStats;
  }
}

export async function fetchUsersAdmin(searchTerm?: string): Promise<Profile[]> {
  if (!isSupabaseConfigured) return [];
  try {
    let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (searchTerm && searchTerm.trim()) {
      query = query.or(`display_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%,institution.ilike.%${searchTerm}%`);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data as Profile[]) || [];
  } catch (err) {
    console.error('Error fetching users:', err);
    return [];
  }
}

export async function updateUserRole(
  adminId: string,
  targetUserId: string,
  newRole: 'user' | 'admin',
  reason?: string
): Promise<{ success: boolean; error: Error | null }> {
  if (!isSupabaseConfigured) return { success: false, error: new Error('Supabase not configured') };
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', targetUserId);

    if (error) throw error;

    // Record audit log
    await recordAuditLog({
      actorId: adminId,
      action: 'UPDATE_USER_ROLE',
      targetType: 'profile',
      targetId: targetUserId,
      reason: reason || `Updated role to ${newRole}`,
      metadata: { new_role: newRole },
    });

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

export async function updateUserStatus(
  adminId: string,
  targetUserId: string,
  newStatus: 'active' | 'suspended',
  reason?: string
): Promise<{ success: boolean; error: Error | null }> {
  if (!isSupabaseConfigured) return { success: false, error: new Error('Supabase not configured') };
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ account_status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', targetUserId);

    if (error) throw error;

    await recordAuditLog({
      actorId: adminId,
      action: 'UPDATE_ACCOUNT_STATUS',
      targetType: 'profile',
      targetId: targetUserId,
      reason: reason || `Changed status to ${newStatus}`,
      metadata: { new_status: newStatus },
    });

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

export async function fetchPortfoliosAdmin(): Promise<Portfolio[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select(`
        *,
        owner:profiles(*)
      `)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return (data as Portfolio[]) || [];
  } catch (err) {
    console.error('Error fetching admin portfolios:', err);
    return [];
  }
}

export async function moderatePortfolio(
  adminId: string,
  portfolioId: string,
  newStatus: 'approved' | 'rejected',
  reason?: string
): Promise<{ success: boolean; error: Error | null }> {
  if (!isSupabaseConfigured) return { success: false, error: new Error('Supabase not configured') };
  try {
    const { error } = await supabase
      .from('portfolios')
      .update({ moderation_status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', portfolioId);

    if (error) throw error;

    await recordAuditLog({
      actorId: adminId,
      action: 'MODERATE_PORTFOLIO',
      targetType: 'portfolio',
      targetId: portfolioId,
      reason: reason || `Moderation status set to ${newStatus}`,
      metadata: { moderation_status: newStatus },
    });

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

export async function toggleFeaturePortfolio(
  adminId: string,
  portfolioId: string,
  featured: boolean
): Promise<{ success: boolean; error: Error | null }> {
  if (!isSupabaseConfigured) return { success: false, error: new Error('Supabase not configured') };
  try {
    const { error } = await supabase
      .from('portfolios')
      .update({ featured, updated_at: new Date().toISOString() })
      .eq('id', portfolioId);

    if (error) throw error;

    await recordAuditLog({
      actorId: adminId,
      action: 'TOGGLE_FEATURED_PORTFOLIO',
      targetType: 'portfolio',
      targetId: portfolioId,
      reason: featured ? 'Featured in editorial showcase' : 'Removed from featured showcase',
      metadata: { featured },
    });

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

export async function fetchReports(): Promise<Report[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        reporter:profiles(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as Report[]) || [];
  } catch (err) {
    console.error('Error fetching reports:', err);
    return [];
  }
}

export async function updateReportStatus(
  adminId: string,
  reportId: string,
  status: Report['status'],
  notes?: string
): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('reports')
      .update({
        status,
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', reportId);

    if (error) throw error;

    await recordAuditLog({
      actorId: adminId,
      action: 'UPDATE_REPORT_STATUS',
      targetType: 'report',
      targetId: reportId,
      reason: notes || `Report status updated to ${status}`,
      metadata: { status },
    });

    return true;
  } catch {
    return false;
  }
}

export async function fetchAuditLogs(): Promise<AdminAuditLog[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('admin_audit_logs')
      .select(`
        *,
        actor:profiles(*)
      `)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return (data as AdminAuditLog[]) || [];
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    return [];
  }
}

export async function recordAuditLog(payload: {
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  reason?: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.from('admin_audit_logs').insert({
      actor_id: payload.actorId,
      action: payload.action,
      target_type: payload.targetType,
      target_id: payload.targetId,
      reason: payload.reason || null,
      metadata: payload.metadata || {},
    });
  } catch (err) {
    console.warn('Failed to record admin audit log:', err);
  }
}

export async function fetchPlatformSettings(): Promise<PlatformSetting[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase.from('platform_settings').select('*');
    if (error) throw error;
    return (data as PlatformSetting[]) || [];
  } catch {
    return [];
  }
}

export async function updatePlatformSetting(key: string, value: any, adminId: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase
      .from('platform_settings')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString(),
        updated_by: adminId,
      });

    if (error) throw error;
    return true;
  } catch {
    return false;
  }
}

export async function fetchContactSubmissions(): Promise<ContactSubmission[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as ContactSubmission[]) || [];
  } catch {
    return [];
  }
}
