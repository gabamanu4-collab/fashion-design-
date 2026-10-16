import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPasswordForEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);

    const { error: resetErr } = await resetPasswordForEmail(email.trim());
    setLoading(false);

    if (resetErr) {
      setError(resetErr.message);
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 border border-[#E7E2D6] rounded-2xl bg-white text-center space-y-4 shadow-xs">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-[#141210]">Password Reset Dispatched</h2>
        <p className="text-xs text-[#57524A] leading-relaxed">
          If an account exists for <strong className="text-[#141210]">{email}</strong>, a password reset link has been sent. Please inspect your inbox.
        </p>
        <div className="pt-4 border-t border-[#F0ECE1]">
          <Link to="/login" className="text-xs font-semibold text-[#141210] hover:underline">
            Return to Sign In &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-16 p-6 sm:p-8 border border-[#E7E2D6] rounded-2xl bg-white shadow-xs space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono tracking-widest text-[#78716A] uppercase">Password Recovery</span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141210]">
          Reset Your Password
        </h1>
        <p className="text-xs text-[#57524A]">
          Enter your registered email address to receive password reset instructions.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#141210] mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="designer@atelier.com"
            className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210] focus:outline-hidden focus:border-[#141210]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#141210] text-white hover:bg-[#2A2723] rounded-lg text-xs font-semibold tracking-wide transition-colors disabled:opacity-50 mt-4"
        >
          {loading ? 'Sending Recovery Instructions...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-[#F0ECE1]">
        <Link
          to="/login"
          className="text-xs font-semibold text-[#78716A] hover:text-[#141210] flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </div>
  );
};
