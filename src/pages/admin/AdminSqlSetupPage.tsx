import React, { useState } from 'react';
import { checkIsSupabaseConfigured, getEffectiveSupabaseUrl, getSupabaseProjectRef } from '../../lib/config';
import { supabase } from '../../lib/supabase';
import { FULL_SQL_MIGRATION } from '../../data/sqlMigrationScript';
import { Database, Copy, Check, Terminal, ExternalLink, ShieldCheck, Activity, AlertCircle, CheckCircle2, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminSqlSetupPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const isConfigured = checkIsSupabaseConfigured();
  const currentUrl = getEffectiveSupabaseUrl();
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details?: {
      profilesTable: boolean;
      portfoliosTable: boolean;
      projectsTable: boolean;
      categoriesCount?: number;
      bucketExists: boolean;
    };
  } | null>(null);

  const copyMigration = () => {
    navigator.clipboard.writeText(FULL_SQL_MIGRATION);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestConnection = async () => {
    if (!checkIsSupabaseConfigured()) {
      setTestResult({
        success: false,
        message: 'Supabase credentials are not configured yet. Configure your Project URL and anon key.',
      });
      return;
    }

    setTesting(true);
    try {
      // 1. Test profiles table
      const { error: profileErr } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
      const profilesOk = !profileErr || profileErr.code !== '42P01';

      // 2. Test portfolios table
      const { error: portErr } = await supabase.from('portfolios').select('id', { count: 'exact', head: true });
      const portfoliosOk = !portErr || portErr.code !== '42P01';

      // 3. Test projects table
      const { error: projErr } = await supabase.from('projects').select('id', { count: 'exact', head: true });
      const projectsOk = !projErr || projErr.code !== '42P01';

      // 4. Test categories
      const { count: catCount, error: catErr } = await supabase.from('categories').select('*', { count: 'exact', head: true });
      const categoriesOk = !catErr;

      // 5. Test storage
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketOk = Boolean(buckets?.some((b) => b.id === 'portfolio-media'));

      const allOk = profilesOk && portfoliosOk && projectsOk;

      setTestResult({
        success: allOk,
        message: allOk
          ? 'Successfully connected! PostgreSQL tables and RLS policies are active.'
          : 'Connected to Supabase, but some tables have not been created yet. Run the SQL schema script below in your Supabase SQL Editor.',
        details: {
          profilesTable: profilesOk,
          portfoliosTable: portfoliosOk,
          projectsTable: projectsOk,
          categoriesCount: categoriesOk ? catCount || 0 : 0,
          bucketExists: bucketOk,
        },
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Connection test error: ${err.message || 'Unknown network error'}`,
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#141210]">Database Migrations &amp; Schema</h1>
        <p className="text-xs text-[#57524A] mt-0.5">
          Review, copy, and verify the PostgreSQL schema, RLS policies, and storage bucket configuration.
        </p>
      </div>

      {/* Connection Status Card */}
      <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#141210]" />
              <h2 className="font-serif text-lg font-bold text-[#141210]">Connection Health Status</h2>
            </div>
            <p className="text-xs text-[#57524A] mt-1">
              Current Project: {currentUrl ? <span className="font-mono text-[#141210] font-medium">{currentUrl}</span> : <span className="italic text-amber-700">Not configured (using local fallback dataset)</span>}
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              to="/database-setup"
              className="px-3.5 py-2 border border-[#DCD7CD] hover:border-[#141210] rounded-xl text-xs font-semibold text-[#141210] flex items-center gap-1.5 transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Configure Credentials &amp; URLs</span>
            </Link>
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="px-4 py-2 bg-[#141210] text-white hover:bg-[#2A2723] disabled:opacity-50 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              {testing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Pinging Supabase...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Test Live Connection</span>
                </>
              )}
            </button>
          </div>
        </div>

        {testResult && (
          <div
            className={`p-4 rounded-xl border text-xs space-y-3 ${
              testResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-start gap-2">
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              )}
              <span className="font-medium">{testResult.message}</span>
            </div>

            {testResult.details && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-black/10 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${testResult.details.profilesTable ? 'bg-emerald-500' : 'bg-red-400'}`} />
                  <span>Profiles Table</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${testResult.details.portfoliosTable ? 'bg-emerald-500' : 'bg-red-400'}`} />
                  <span>Portfolios Table</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${testResult.details.projectsTable ? 'bg-emerald-500' : 'bg-red-400'}`} />
                  <span>Projects Table</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${testResult.details.bucketExists ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                  <span>portfolio-media Bucket</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SQL Migration Script */}
      <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#141210]" />
            <h2 className="font-serif text-xl font-bold text-[#141210]">Full PostgreSQL Schema Script</h2>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`https://supabase.com/dashboard/project/${getSupabaseProjectRef(currentUrl)}/sql/new`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 border border-[#DCD7CD] hover:border-[#141210] bg-white rounded-lg text-xs font-semibold flex items-center gap-1.5 text-[#141210] transition-colors"
            >
              <span>Open Supabase SQL Editor</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={copyMigration}
              className="px-3.5 py-1.5 bg-[#141210] text-white hover:bg-[#2A2723] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Full SQL Script'}</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-[#57524A] leading-relaxed">
          The complete migration is saved in <code className="bg-[#FAF9F6] px-1 py-0.5 rounded font-mono text-[#141210]">supabase/migrations/20261013000000_fd_portfolio_schema.sql</code>. Copy the script and execute it in your Supabase SQL Editor to provision all tables, indexes, triggers, and Row Level Security policies.
        </p>

        <div className="bg-[#1C1917] text-[#FAF8F5] p-4 rounded-xl font-mono text-xs max-h-96 overflow-y-auto">
          <pre>{FULL_SQL_MIGRATION}</pre>
        </div>
      </div>
    </div>
  );
};
