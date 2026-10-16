import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="space-y-3 pb-6 border-b border-[#E7E2D6]">
        <span className="text-xs font-mono tracking-widest text-[#78716A] uppercase">Platform Terms</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#141210]">
          Terms of Service
        </h1>
        <p className="text-xs text-[#78716A] font-mono">Effective: October 2026</p>
      </div>

      <div className="prose prose-neutral max-w-none space-y-6 text-xs sm:text-sm text-[#4A453E] leading-relaxed">
        <h2 className="text-xl font-serif font-bold text-[#141210]">1. Portfolio Content Standards</h2>
        <p>
          FD Design Portfolio Builder is dedicated to legitimate fashion design work, academic student presentations, and creative ateliers. Users agree not to post infringing, defamatory, or abusive material.
        </p>

        <h2 className="text-xl font-serif font-bold text-[#141210]">2. Platform Moderation</h2>
        <p>
          Administrators reserve the right to review reported portfolios and take corrective action, including unpublishing content that violates community standards or copyright guidelines.
        </p>

        <h2 className="text-xl font-serif font-bold text-[#141210]">3. Account Responsibility</h2>
        <p>
          You are responsible for maintaining the confidentiality of your credentials and all activity conducted through your authenticated account.
        </p>
      </div>
    </div>
  );
};
