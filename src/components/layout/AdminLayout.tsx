import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Shield,
  Users,
  FolderGit2,
  AlertTriangle,
  Tag,
  FileText,
  Settings,
  Database,
  ArrowLeft,
  Lock,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, profile, isAdmin, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <p className="font-serif italic text-sm text-[#78716A]">Verifying Administrative Authority...</p>
      </div>
    );
  }

  // Enforce server-authorized role check
  if (!user || !isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-[#E7E2D6] rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#141210]">Administrative Access Required</h2>
          <p className="text-xs text-[#57524A] leading-relaxed">
            The <code className="bg-[#FAF9F6] px-1 py-0.5 rounded font-mono">/admin</code> console is restricted to administrators.
            <br />
            Configured Super Admin: <strong className="text-[#141210]">gabamanu4@gmail.com</strong>
          </p>

          {!user ? (
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2">
              <Link
                to="/login"
                state={{ from: location }}
                className="px-4 py-2 bg-[#141210] text-white rounded-lg text-xs font-semibold hover:bg-[#2A2723]"
              >
                Sign In as Administrator &rarr;
              </Link>
            </div>
          ) : (
            <div className="bg-[#FAF9F6] border border-[#E7E2D6] rounded-lg p-3 text-[11px] text-[#78716A] text-left space-y-2">
              <p className="font-semibold text-[#141210]">Signed in as: {user.email}</p>
              <p className="text-[11px]">
                To grant admin rights to this account in Supabase, run this in your Supabase SQL editor:
              </p>
              <p className="font-mono text-[10px] break-all bg-white p-2 rounded border border-[#E7E2D6]">
                UPDATE public.profiles SET role = 'admin' WHERE id = '{user.id}';
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-[#141210] text-white rounded-lg text-xs font-semibold hover:bg-[#2A2723]"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const adminNav = [
    { label: 'Overview', path: '/admin', icon: Shield },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Portfolios', path: '/admin/portfolios', icon: FolderGit2 },
    { label: 'Reports', path: '/admin/reports', icon: AlertTriangle },
    { label: 'Categories', path: '/admin/categories', icon: Tag },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: FileText },
    { label: 'Platform Settings', path: '/admin/settings', icon: Settings },
    { label: 'SQL & Database', path: '/admin/sql-setup', icon: Database },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#141210]">
      {/* Admin Top Banner */}
      <div className="bg-[#1C1917] text-white border-b border-[#292524] px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 flex-wrap">
            <Shield className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold tracking-wider">ADMINISTRATIVE CONSOLE</span>
            <span className="text-[#A8A29E] hidden md:inline">·</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono text-[10px] font-semibold border border-amber-400/30">
              Super Admin: {user?.email || 'gabamanu4@gmail.com'}
            </span>
          </div>
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-xs text-[#D6D3D1] hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to User Dashboard</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Admin Navigation Pills / Bar */}
        <div className="bg-white border border-[#E7E2D6] rounded-xl p-2 shadow-xs overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#141210] text-white font-semibold'
                      : 'text-[#57524A] hover:bg-[#FAF9F6] hover:text-[#141210]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
};
