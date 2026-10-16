import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  FolderGit2,
  Scissors,
  Image as ImageIcon,
  User,
  Settings,
  Shield,
  LogOut,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Portfolios', path: '/dashboard/portfolios', icon: FolderGit2 },
    { label: 'Design Projects', path: '/dashboard/projects', icon: Scissors },
    { label: 'Media Library', path: '/dashboard/media', icon: ImageIcon },
    { label: 'Profile & Specs', path: '/dashboard/profile', icon: User },
    { label: 'Account Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#141210] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#E7E2D6] bg-white shrink-0 p-5 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Atelier Brand & User info */}
          <div className="border-b border-[#F0ECE1] pb-4">
            <Link to="/" className="text-lg font-serif font-bold tracking-wider block text-[#141210]">
              FD ATELIER
            </Link>
            <div className="mt-3 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#141210] text-white flex items-center justify-center text-xs font-bold font-mono">
                {profile?.display_name?.charAt(0) || user?.email?.charAt(0) || 'D'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#141210] truncate">
                  {profile?.display_name || user?.email}
                </p>
                <p className="text-[10px] font-mono tracking-wider uppercase text-[#78716A] truncate">
                  {profile?.user_type || 'Designer'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    active
                      ? 'bg-[#141210] text-white font-semibold'
                      : 'text-[#57524A] hover:bg-[#FAF9F6] hover:text-[#141210]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {isAdmin && (
              <div className="pt-3 border-t border-[#F0ECE1]">
                <Link
                  to="/admin"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-amber-900 bg-amber-50 hover:bg-amber-100 font-semibold transition-colors"
                >
                  <Shield className="w-4 h-4 shrink-0 text-amber-700" />
                  <span>Admin Console</span>
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-[#F0ECE1] space-y-2">
          <Link
            to="/explore"
            className="flex items-center justify-between px-3 py-2 text-xs text-[#78716A] hover:text-[#141210] transition-colors"
          >
            <span>Explore Runway</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-700 hover:bg-red-50 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
