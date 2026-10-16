import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SUPABASE_URL } from '../../lib/config';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signIn, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide your email and password.');
      return;
    }

    setLoading(true);
    const { error: signInError } = await signIn(email, password);
    setLoading(false);

    if (signInError) {
      setError(signInError.message || 'Invalid login credentials.');
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-6 sm:p-8 border border-[#E7E2D6] rounded-2xl bg-white shadow-xs space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono tracking-widest text-[#78716A] uppercase">Sign In</span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141210]">
          Enter Your Atelier
        </h1>
        <p className="text-xs text-[#57524A]">
          Access your fashion portfolios, project drafts, and media library.
        </p>
      </div>

      {!isConfigured ? (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>
              Supabase credentials not detected. The app is currently previewing sample collections.
            </span>
          </div>
          <Link
            to="/database-setup"
            className="inline-flex items-center gap-1 font-semibold text-amber-950 underline hover:text-black self-start"
          >
            Connect Supabase Database &amp; Run SQL Schema &rarr;
          </Link>
        </div>
      ) : (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium truncate">Supabase Connected: {SUPABASE_URL}</span>
          </div>
          <Link to="/database-setup" className="font-semibold underline hover:text-emerald-950 shrink-0 text-[11px] ml-2">
            Verify Schema
          </Link>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-[#141210]">Email Address</label>
            <button
              type="button"
              onClick={() => setEmail('gabamanu4@gmail.com')}
              className="text-[10px] font-mono text-amber-800 hover:text-amber-950 underline"
            >
              Fill Super Admin (gabamanu4@gmail.com)
            </button>
          </div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="designer@atelier.com"
            className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210] focus:outline-hidden focus:border-[#141210]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-[#141210]">Password</label>
            <Link
              to="/forgot-password"
              className="text-[11px] text-[#78716A] hover:text-[#141210] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210] focus:outline-hidden focus:border-[#141210]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#141210] text-white hover:bg-[#2A2723] rounded-lg text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-4"
        >
          {loading ? (
            <span>Verifying Credentials...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-[#F0ECE1] text-xs text-[#57524A]">
        New to FD Atelier?{' '}
        <Link to="/register" className="font-semibold text-[#141210] hover:underline">
          Create an Account
        </Link>
      </div>
    </div>
  );
};
