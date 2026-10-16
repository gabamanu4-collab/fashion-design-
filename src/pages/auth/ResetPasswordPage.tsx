import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: updateErr } = await updatePassword(password);
    setLoading(false);

    if (updateErr) {
      setError(updateErr.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 border border-[#E7E2D6] rounded-2xl bg-white text-center space-y-4 shadow-xs">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-[#141210]">Password Updated</h2>
        <p className="text-xs text-[#57524A]">
          Your password has been securely reset. Redirecting to your atelier dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-16 p-6 sm:p-8 border border-[#E7E2D6] rounded-2xl bg-white shadow-xs space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono tracking-widest text-[#78716A] uppercase">Security Update</span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141210]">
          Set New Password
        </h1>
        <p className="text-xs text-[#57524A]">
          Enter your updated atelier account password below.
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
          <label className="block text-xs font-semibold text-[#141210] mb-1">New Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210] focus:outline-hidden focus:border-[#141210]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#141210] mb-1">Confirm New Password</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210] focus:outline-hidden focus:border-[#141210]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#141210] text-white hover:bg-[#2A2723] rounded-lg text-xs font-semibold tracking-wide transition-colors disabled:opacity-50 mt-4"
        >
          {loading ? 'Updating Password...' : 'Save New Password'}
        </button>
      </form>
    </div>
  );
};
