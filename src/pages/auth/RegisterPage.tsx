import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserType } from '../../types/database';
import { AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { signUp, isConfigured } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('student');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter your full designer name.');
      return;
    }
    if (!email.trim() || !password) {
      setError('Please provide an email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);

    const { error: signUpError, needsEmailVerification } = await signUp({
      email,
      password,
      fullName,
      userType,
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
    } else if (needsEmailVerification) {
      setNeedsVerification(true);
    } else {
      navigate('/dashboard/onboarding');
    }
  };

  if (needsVerification) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 border border-[#E7E2D6] rounded-2xl bg-white text-center space-y-4 shadow-xs">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-[#141210]">Verify Your Email</h2>
        <p className="text-xs text-[#57524A] leading-relaxed">
          We have sent a verification confirmation to <strong className="text-[#141210]">{email}</strong>.
          Please click the confirmation link in your inbox to activate your atelier account.
        </p>
        <div className="pt-4 border-t border-[#F0ECE1]">
          <Link
            to="/login"
            className="text-xs font-semibold text-[#141210] hover:underline"
          >
            Return to Sign In &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 p-6 sm:p-8 border border-[#E7E2D6] rounded-2xl bg-white shadow-xs space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono tracking-widest text-[#78716A] uppercase">Atelier Registration</span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141210]">
          Create Your Designer Profile
        </h1>
        <p className="text-xs text-[#57524A]">
          Join fashion design students, alumni, and independent ateliers.
        </p>
      </div>

      {!isConfigured && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex flex-col gap-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>
              Supabase credentials are not detected. Live account creation and portfolio saving requires connecting your Supabase database.
            </span>
          </div>
          <Link
            to="/database-setup"
            className="inline-flex items-center gap-1 font-semibold text-amber-950 underline hover:text-black self-start"
          >
            Open Supabase Connection &amp; SQL Setup Guide &rarr;
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
          <label className="block text-xs font-semibold text-[#141210] mb-1">Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jeanne Lanvin"
            className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210] focus:outline-hidden focus:border-[#141210]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-[#141210]">Email Address</label>
            <button
              type="button"
              onClick={() => {
                setEmail('gabamanu4@gmail.com');
                setFullName('Admin Manu');
                setUserType('professional');
              }}
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
          <label className="block text-xs font-semibold text-[#141210] mb-1">Designer Category</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value as UserType)}
            className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210] focus:outline-hidden focus:border-[#141210]"
          >
            <option value="student">Fashion Design Student</option>
            <option value="graduate">Recent Graduate / Alumni</option>
            <option value="professional">Professional Designer / Independent Atelier</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#141210] mb-1">Password</label>
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
            <label className="block text-xs font-semibold text-[#141210] mb-1">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210] focus:outline-hidden focus:border-[#141210]"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-start gap-2 cursor-pointer text-xs text-[#57524A]">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-[#DCD7CD] text-[#141210] focus:ring-0"
            />
            <span>
              I accept the{' '}
              <Link to="/terms" className="underline text-[#141210]">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="underline text-[#141210]">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#141210] text-white hover:bg-[#2A2723] rounded-lg text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-4"
        >
          {loading ? (
            <span>Creating Atelier Account...</span>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-[#F0ECE1] text-xs text-[#57524A]">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-[#141210] hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
