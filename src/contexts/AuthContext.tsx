import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { checkIsSupabaseConfigured, isSupabaseConfigured, isSuperAdminEmail } from '../lib/config';
import { Profile, UserType } from '../types/database';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  isAdmin: boolean;
  signUp: (params: {
    email: string;
    password: string;
    fullName: string;
    userType: UserType;
  }) => Promise<{ error: AuthError | Error | null; needsEmailVerification: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<{ error: AuthError | Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | Error | null }>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null; profile?: Profile }>;
  deleteAccount: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isConfigured, setIsConfigured] = useState<boolean>(() => checkIsSupabaseConfigured());

  const fetchProfile = useCallback(
    async (userId: string, userEmail?: string | null, userMetadata?: Record<string, any> | null) => {
      if (!checkIsSupabaseConfigured()) return null;
      const isSuper = isSuperAdminEmail(userEmail);

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user profile:', error.message);
          // If super admin and table is not created yet or RLS blocked, supply synthetic admin profile
          if (isSuper) {
            return {
              id: userId,
              email: userEmail || null,
              display_name: userMetadata?.full_name || userMetadata?.name || (userEmail ? userEmail.split('@')[0] : 'Admin'),
              role: 'admin',
              account_status: 'active',
              user_type: 'professional',
              specialties: ['Creative Direction'],
              skills: ['Administration'],
              onboarding_completed: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            } as unknown as Profile;
          }
          return null;
        }

        // If profile does not exist in DB yet (for ANY user), automatically create it in public.profiles!
        if (!data) {
          const derivedName =
            userMetadata?.full_name ||
            userMetadata?.display_name ||
            userMetadata?.name ||
            (userEmail ? userEmail.split('@')[0] : 'Designer');

          const initialProfile: Partial<Profile> = {
            id: userId,
            email: userEmail || undefined,
            display_name: derivedName,
            role: isSuper ? 'admin' : 'user',
            account_status: 'active',
            user_type: (userMetadata?.user_type as UserType) || (isSuper ? 'professional' : 'student'),
            specialties: isSuper ? ['Creative Direction', 'Platform Governance'] : [],
            skills: isSuper ? ['Fashion Design', 'Administration'] : [],
            onboarding_completed: isSuper,
          };

          try {
            const { data: created, error: insertErr } = await supabase
              .from('profiles')
              .upsert(initialProfile, { onConflict: 'id' })
              .select()
              .single();

            if (created) return created as Profile;
            if (insertErr) {
              console.warn('Profile auto-insert note:', insertErr.message);
            }
          } catch (e) {
            console.warn('Upsert fallback profile exception:', e);
          }

          return initialProfile as unknown as Profile;
        }

        const prof = data as Profile;

        // Sync email if missing in public.profiles record
        if (prof && userEmail && (!prof.email || prof.email !== userEmail)) {
          try {
            await supabase.from('profiles').update({ email: userEmail }).eq('id', userId);
            prof.email = userEmail;
          } catch {
            // best-effort
          }
        }

        // Auto-promote super admin in DB if their profile exists but role is not admin yet
        if (prof && isSuper && prof.role !== 'admin') {
          try {
            await supabase.from('profiles').update({ role: 'admin', account_status: 'active' }).eq('id', userId);
            prof.role = 'admin';
          } catch (e) {
            console.warn('Super admin role promotion notice:', e);
            prof.role = 'admin';
          }
        }

        return prof;
      } catch (err) {
        console.error('Exception fetching profile:', err);
        if (isSuper) {
          return {
            id: userId,
            email: userEmail || null,
            display_name: userMetadata?.full_name || userMetadata?.name || (userEmail ? userEmail.split('@')[0] : 'Admin'),
            role: 'admin',
            account_status: 'active',
            user_type: 'professional',
            specialties: [],
            skills: [],
            onboarding_completed: true,
          } as unknown as Profile;
        }
        return null;
      }
    },
    []
  );

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      const p = await fetchProfile(user.id, user.email, user.user_metadata);
      if (p) setProfile(p);
    }
  }, [user?.id, user?.email, user?.user_metadata, fetchProfile]);

  useEffect(() => {
    const handleConfigChange = () => {
      const nowConfigured = checkIsSupabaseConfigured();
      setIsConfigured(nowConfigured);
      if (!nowConfigured) {
        setUser(null);
        setProfile(null);
        setSession(null);
        setLoading(false);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('supabase-config-changed', handleConfigChange);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('supabase-config-changed', handleConfigChange);
      }
    };
  }, []);

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    // Initial session load
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (!isMounted) return;
      if (error) {
        console.error('Failed to get session:', error.message);
      }
      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        fetchProfile(initialSession.user.id, initialSession.user.email, initialSession.user.user_metadata).then((p) => {
          if (isMounted) {
            setProfile(p);
            setLoading(false);
          }
        });
      } else {
        setLoading(false);
      }
    });

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        const p = await fetchProfile(newSession.user.id, newSession.user.email, newSession.user.user_metadata);
        if (isMounted) setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [isConfigured, fetchProfile]);

  const signUp = async ({
    email,
    password,
    fullName,
    userType,
  }: {
    email: string;
    password: string;
    fullName: string;
    userType: UserType;
  }) => {
    if (!isSupabaseConfigured) {
      return {
        error: new Error('Supabase is not configured. Please supply VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.'),
        needsEmailVerification: false,
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            display_name: fullName,
            user_type: userType,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        return { error, needsEmailVerification: false };
      }

      // Check if user was created and whether session is returned or verification is needed
      const needsEmailVerification = !data.session;

      // In case DB trigger didn't fire or needs manual upsert:
      if (data.user) {
        try {
          const isSuper = isSuperAdminEmail(email);
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: email,
            display_name: fullName,
            user_type: userType,
            role: isSuper ? 'admin' : 'user',
            account_status: 'active',
            onboarding_completed: false,
            specialties: [],
            skills: [],
          }, { onConflict: 'id' });
        } catch (e) {
          console.warn('Upsert profile notice:', e);
        }
      }

      return { error: null, needsEmailVerification };
    } catch (err: any) {
      return { error: err, needsEmailVerification: false };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return {
        error: new Error('Supabase is not configured. Please set your credentials in .env'),
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error };

      if (data?.user) {
        const p = await fetchProfile(data.user.id, data.user.email, data.user.user_metadata);
        if (p) setProfile(p);
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const resetPasswordForEmail = async (email: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured.') };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured.') };
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!isSupabaseConfigured || !user) {
      return { error: new Error('User not logged in or Supabase not configured.') };
    }

    try {
      // Disallow non-admins from changing role and account_status from client side
      const safeUpdates = { ...updates };
      if (profile?.role !== 'admin') {
        delete safeUpdates.role;
        delete safeUpdates.account_status;
      }
      safeUpdates.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('profiles')
        .update(safeUpdates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { error: new Error(error.message) };
      }

      setProfile(data as Profile);
      return { error: null, profile: data as Profile };
    } catch (err: any) {
      return { error: err };
    }
  };

  const deleteAccount = async () => {
    if (!isSupabaseConfigured || !user) {
      return { error: new Error('Not logged in') };
    }

    try {
      // Call Edge Function or RPC if available; otherwise delete user data in public tables
      const { error: dataError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (dataError) {
        console.warn('Profile deletion notice:', dataError.message);
      }

      await signOut();
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const isSuperAdmin = isSuperAdminEmail(user?.email);
  const isAdmin = profile?.role === 'admin' || isSuperAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isConfigured,
        isAdmin,
        signUp,
        signIn,
        signOut,
        resetPasswordForEmail,
        updatePassword,
        refreshProfile,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
