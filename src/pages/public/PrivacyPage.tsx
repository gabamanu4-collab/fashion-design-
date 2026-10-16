import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="space-y-3 pb-6 border-b border-[#E7E2D6]">
        <span className="text-xs font-mono tracking-widest text-[#78716A] uppercase">Legal &amp; Data Rights</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#141210]">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#78716A] font-mono">Last Updated: October 2026</p>
      </div>

      <div className="prose prose-neutral max-w-none space-y-6 text-xs sm:text-sm text-[#4A453E] leading-relaxed">
        <h2 className="text-xl font-serif font-bold text-[#141210]">1. Intellectual Property &amp; Designer Ownership</h2>
        <p>
          All fashion sketches, garment photographs, pattern flats, text commentary, and design assets uploaded to FD Atelier remain the sole intellectual property of the author/designer. We claim no ownership over your creative works.
        </p>

        <h2 className="text-xl font-serif font-bold text-[#141210]">2. Privacy of Drafts &amp; Unlisted Portfolios</h2>
        <p>
          Portfolios flagged as 'draft' or 'private' are secured through PostgreSQL Row Level Security (RLS) policies. Private drafts cannot be read or enumerated by unauthorized visitors, web crawlers, or search engine indexes.
        </p>

        <h2 className="text-xl font-serif font-bold text-[#141210]">3. Account Deletion &amp; Data Erasure</h2>
        <p>
          Users maintain full control over their personal records. In accordance with privacy rights, you may delete your account at any time via Account Settings, triggering the immediate purge of profile records, portfolios, and associated storage files.
        </p>
      </div>
    </div>
  );
};
