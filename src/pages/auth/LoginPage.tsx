import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    const { error: signInError } = await signIn(email.trim(), password);
    setLoading(false);

    if (signInError) {
      setError(signInError.message || 'Invalid email or password. Please try again.');
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 sm:p-10 border border-[#E7E2D6] rounded-2xl bg-white shadow-xs space-y-7">
      <div className="text-center space-y-2">
        <span className="text-[11px] font-mono tracking-widest text-[#78716A] uppercase">
          Designer Access
        </span>
        <h1 className="text-3xl font-serif font-bold text-[#141210] tracking-tight">
          Enter Your Atelier
        </h1>
        <p className="text-xs text-[#57524A] max-w-xs mx-auto leading-relaxed">
          Access your curated collections, project archives, and client presentations.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50/80 border border-red-200/80 rounded-xl text-xs text-red-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#141210] mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="designer@atelier.com"
            className="w-full text-xs p-3.5 rounded-xl border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210] placeholder:text-[#A8A29E] focus:outline-hidden focus:border-[#141210] focus:bg-white transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-[#141210]">Password</label>
            <Link
              to="/forgot-password"
              className="text-[11px] text-[#78716A] hover:text-[#141210] transition-colors hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full text-xs p-3.5 pr-10 rounded-xl border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210] placeholder:text-[#A8A29E] focus:outline-hidden focus:border-[#141210] focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716A] hover:text-[#141210] p-1 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#141210] text-white hover:bg-[#2A2723] rounded-xl text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-5 shadow-xs cursor-pointer"
        >
          {loading ? (
            <span>Signing in to atelier...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-3 border-t border-[#F0ECE1] text-xs text-[#57524A]">
        New to FD Atelier?{' '}
        <Link to="/register" className="font-semibold text-[#141210] hover:underline ml-1">
          Create an Account
        </Link>
      </div>
    </div>
  );
};

