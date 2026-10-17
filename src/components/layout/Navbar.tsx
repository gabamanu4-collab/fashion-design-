import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, LogOut, LayoutDashboard, Shield, FolderGit2, Plus, Menu, X, Database } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, profile, isAdmin, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Explore', path: '/explore' },
    { label: 'Features', path: '/features' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E7E5E0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single text wordmark */}
        <Link
          to="/"
          className="text-xl sm:text-2xl font-serif font-bold tracking-wider text-[#1A1A1A] whitespace-nowrap shrink-0"
        >
          FD ATELIER
        </Link>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#4A453E]">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#1A1A1A] pb-0.5 ${
                isActive(link.path)
                  ? 'text-[#1A1A1A] border-b border-[#1A1A1A]'
                  : 'text-[#5C554D]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Zone 3: 1 primary action or profile control */}
        <div className="flex items-center gap-3 shrink-0">

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border border-[#DCD7CD] hover:border-[#1A1A1A] bg-white rounded-lg text-xs font-medium text-[#1A1A1A] transition-colors whitespace-nowrap"
                aria-expanded={dropdownOpen}
              >
                <div className="w-5 h-5 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] uppercase font-bold">
                  {profile?.display_name?.charAt(0) || user.email?.charAt(0) || 'D'}
                </div>
                <span className="max-w-[120px] truncate">{profile?.display_name || user.email}</span>
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-[#E7E5E0] rounded-xl shadow-lg py-1.5 z-50 text-xs text-[#2E2924]"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-[#F0ECE1]">
                    <p className="font-semibold text-sm truncate">{profile?.display_name || 'Designer'}</p>
                    <p className="text-[#78716C] truncate text-[11px]">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono tracking-wider text-[#A8A29E] uppercase">
                      {profile?.role === 'admin' ? 'Administrator' : profile?.user_type || 'Designer'}
                    </span>
                  </div>

                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-[#F9F8F5] transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#78716C]" />
                    <span>User Dashboard</span>
                  </Link>

                  <Link
                    to="/dashboard/portfolios"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-[#F9F8F5] transition-colors"
                  >
                    <FolderGit2 className="w-3.5 h-3.5 text-[#78716C]" />
                    <span>My Portfolios</span>
                  </Link>

                  <Link
                    to="/dashboard/portfolios/new"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-[#F9F8F5] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#78716C]" />
                    <span>Create New Portfolio</span>
                  </Link>

                  <Link
                    to="/dashboard/profile"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-[#F9F8F5] transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-[#78716C]" />
                    <span>Profile & Specialization</span>
                  </Link>

                  {isAdmin && (
                    <>
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-3 py-2 hover:bg-[#F9F8F5] text-amber-900 font-medium transition-colors border-t border-[#F0ECE1]"
                      >
                        <Shield className="w-3.5 h-3.5 text-amber-700" />
                        <span>Admin Dashboard</span>
                      </Link>
                      <Link
                        to="/admin/sql-setup"
                        className="flex items-center gap-2 px-3 py-2 hover:bg-[#F9F8F5] text-[#78716C] hover:text-[#1A1A1A] transition-colors"
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>Database Setup & SQL</span>
                      </Link>
                    </>
                  )}

                  <div className="border-t border-[#F0ECE1] mt-1 pt-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden sm:inline-block text-xs font-medium text-[#4A453E] hover:text-[#1A1A1A] transition-colors whitespace-nowrap"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#1A1A1A] hover:bg-[#2E2924] rounded-lg transition-colors whitespace-nowrap shrink-0 tracking-wide"
              >
                Build Portfolio
              </Link>
            </div>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-[#4A453E] hover:text-[#1A1A1A]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E7E5E0] bg-[#FAF9F6] px-4 pt-3 pb-5 space-y-2 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#4A453E] hover:text-[#1A1A1A] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-amber-900 font-medium border-t border-stone-200 mt-1 pt-2"
            >
              <Shield className="w-4 h-4 text-amber-700" />
              <span>Admin Console</span>
            </Link>
          )}
          {!user && (
            <div className="pt-3 border-t border-[#E7E5E0] flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-center text-xs font-semibold text-[#1A1A1A] border border-[#DCD7CD] rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-center text-xs font-semibold text-white bg-[#1A1A1A] rounded-lg"
              >
                Build Portfolio
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
