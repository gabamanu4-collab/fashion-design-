import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto my-16 p-8 border border-[#E7E2D6] rounded-2xl bg-white text-center space-y-4 shadow-xs">
      <div className="w-12 h-12 rounded-full bg-[#F5F2EB] border border-[#E7E2D6] flex items-center justify-center mx-auto text-[#141210]">
        <Mail className="w-6 h-6" />
      </div>
      <h2 className="font-serif text-2xl font-bold text-[#141210]">Confirm Your Email</h2>
      <p className="text-xs text-[#57524A] leading-relaxed">
        If you registered with email verification enabled, a confirmation email has been dispatched. Once confirmed, you can log in and begin building your runway portfolios.
      </p>
      <div className="pt-4 border-t border-[#F0ECE1] flex items-center justify-center gap-4 text-xs font-semibold">
        <Link to="/login" className="text-[#141210] hover:underline">
          Go to Sign In &rarr;
        </Link>
      </div>
    </div>
  );
};
