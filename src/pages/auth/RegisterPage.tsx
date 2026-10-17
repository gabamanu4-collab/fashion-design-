import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserType } from '../../types/database';
import { AlertCircle, CheckCircle2, ArrowRight, Eye, EyeOff } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      email: email.trim(),
      password,
      fullName: fullName.trim(),
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
      <div className="max-w-md mx-auto my-16 p-8 sm:p-10 border border-[#E7E2D6] rounded-2xl bg-white text-center space-y-5 shadow-xs">
        <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#141210]">Verify Your Email</h2>
        <p className="text-xs text-[#57524A] leading-relaxed">
          We have sent a verification confirmation to <strong className="text-[#141210] font-semibold">{email}</strong>.
          Please click the confirmation link in your inbox to activate your atelier account.
        </p>
        <div className="pt-4 border-t border-[#F0ECE1]">
          <Link
            to="/login"
            className="text-xs font-semibold text-[#141210] hover:underline inline-flex items-center gap-1.5"
          >
            <span>Return to Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-12 p-8 sm:p-10 border border-[#E7E2D6] rounded-2xl bg-white shadow-xs space-y-7">
      <div className="text-center space-y-2">
        <span className="text-[11px] font-mono tracking-widest text-[#78716A] uppercase">
          Atelier Membership
        </span>
        <h1 className="text-3xl font-serif font-bold text-[#141210] tracking-tight">
          Create Your Designer Profile
        </h1>
        <p className="text-xs text-[#57524A] max-w-xs mx-auto leading-relaxed">
          Join fashion design students, graduates, and independent ateliers showcasing visionary collections.
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
          <label className="block text-xs font-semibold text-[#141210] mb-1.5">Full Name</label>
          <input
            type="text"
            required
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jeanne Lanvin"
            className="w-full text-xs p-3.5 rounded-xl border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210] placeholder:text-[#A8A29E] focus:outline-hidden focus:border-[#141210] focus:bg-white transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#141210] mb-1.5">Email Address</label>
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
          <label className="block text-xs font-semibold text-[#141210] mb-1.5">Designer Category</label>
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value as UserType)}
            className="w-full text-xs p-3.5 rounded-xl border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210] focus:outline-hidden focus:border-[#141210] focus:bg-white transition-all"
          >
            <option value="student">Fashion Design Student</option>
            <option value="graduate">Recent Graduate / Alumni</option>
            <option value="professional">Professional Designer / Independent Atelier</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#141210] mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 chars"
                className="w-full text-xs p-3.5 pr-9 rounded-xl border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210] placeholder:text-[#A8A29E] focus:outline-hidden focus:border-[#141210] focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#78716A] hover:text-[#141210] p-1 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#141210] mb-1.5">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full text-xs p-3.5 rounded-xl border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210] placeholder:text-[#A8A29E] focus:outline-hidden focus:border-[#141210] focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#57524A]">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-[#DCD7CD] text-[#141210] focus:ring-0 cursor-pointer"
            />
            <span className="leading-relaxed">
              I accept the{' '}
              <Link to="/terms" className="underline text-[#141210] font-medium hover:text-black">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="underline text-[#141210] font-medium hover:text-black">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#141210] text-white hover:bg-[#2A2723] rounded-xl text-xs font-semibold tracking-wide flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-5 shadow-xs cursor-pointer"
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

      <div className="text-center pt-3 border-t border-[#F0ECE1] text-xs text-[#57524A]">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-[#141210] hover:underline ml-1">
          Sign In
        </Link>
      </div>
    </div>
  );
};

