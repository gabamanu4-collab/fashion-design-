import React, { useState } from 'react';
import { isSupabaseConfigured } from '../../lib/config';
import { AlertCircle, CheckCircle2, Copy, Check, Terminal, ExternalLink, X } from 'lucide-react';

export const ConfigNotice: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isSupabaseConfigured) {
    return null;
  }

  const sampleEnv = `VITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-or-publishable-key`;

  const copyEnv = () => {
    navigator.clipboard.writeText(sampleEnv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="bg-[#1C1917] text-[#FAF8F5] border-b border-[#292524] px-4 py-2.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#EAB308] shrink-0" />
            <span className="font-medium">
              Supabase Backend Setup Required:
            </span>
            <span className="text-[#A8A29E] hidden md:inline">
              Add your Supabase project credentials in .env to enable real authentication, database storage, and image uploads.
            </span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-2.5 py-1 bg-[#FAF8F5] text-[#1C1917] hover:bg-[#E7E5E4] rounded text-xs font-semibold whitespace-nowrap transition-colors"
          >
            Setup Guide & SQL Migration
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF9F6] border border-[#E7E5E4] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-[#1C1917]">
            <div className="flex items-center justify-between pb-4 border-b border-[#E7E5E4]">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#1C1917]" />
                <h3 className="font-serif text-xl font-bold">Supabase Backend Configuration</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-[#78716C] hover:text-[#1C1917] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 pt-4 text-sm">
              <div>
                <h4 className="font-semibold text-base mb-1">1. Configure Environment Variables</h4>
                <p className="text-[#57534E] text-xs mb-2">
                  Create or edit your <code className="bg-[#F5F5F4] px-1 py-0.5 rounded font-mono">.env</code> file in the project root:
                </p>
                <div className="relative bg-[#1C1917] text-[#FAF8F5] p-3 rounded-lg font-mono text-xs">
                  <pre className="overflow-x-auto">{sampleEnv}</pre>
                  <button
                    onClick={copyEnv}
                    className="absolute top-2 right-2 p-1.5 bg-[#292524] hover:bg-[#44403C] rounded text-white flex items-center gap-1 text-[11px]"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-base mb-1">2. Run PostgreSQL Migration in Supabase</h4>
                <p className="text-[#57534E] text-xs mb-2">
                  A full migration file has already been prepared in <code className="bg-[#F5F5F4] px-1 py-0.5 rounded font-mono">supabase/migrations/20261013000000_fd_portfolio_schema.sql</code>.
                  It creates all tables, Row Level Security policies, storage bucket <code className="bg-[#F5F5F4] px-1 py-0.5 rounded font-mono">portfolio-media</code>, triggers, and default categories.
                </p>
                <div className="bg-[#F5F5F4] border border-[#E7E5E4] p-3 rounded-lg text-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Go to your <strong>Supabase Dashboard &gt; SQL Editor</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Paste the contents of <code className="font-mono">supabase/migrations/20261013000000_fd_portfolio_schema.sql</code></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Click <strong>Run</strong></span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-base mb-1">3. Grant First Administrator</h4>
                <p className="text-[#57534E] text-xs mb-2">
                  After registering your account in the app, promote yourself to platform admin in the Supabase SQL editor:
                </p>
                <div className="bg-[#1C1917] text-[#FAF8F5] p-3 rounded-lg font-mono text-xs overflow-x-auto">
                  UPDATE public.profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'your-email@domain.com');
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 border border-[#D6D3D1] hover:bg-[#F5F5F4] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  Supabase Dashboard <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-[#1C1917] text-white hover:bg-[#292524] rounded-lg text-xs font-semibold transition-colors"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
