import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getEffectiveSupabaseUrl,
  getEffectiveSupabaseKey,
  checkIsSupabaseConfigured,
  saveCustomSupabaseConfig,
  clearCustomSupabaseConfig,
  getSupabaseProjectRef,
  normalizeSupabaseUrl,
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_KEY,
  DEFAULT_SUPABASE_PROJECT_REF,
  APP_DEV_URL,
  APP_PRE_URL,
} from '../../lib/config';
import { supabase, reinitSupabaseClient } from '../../lib/supabase';
import { FULL_SQL_MIGRATION } from '../../data/sqlMigrationScript';
import {
  Database,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Activity,
  AlertCircle,
  CheckCircle2,
  Key,
  Server,
  ArrowRight,
  Globe,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

export const DatabaseSetupPage: React.FC = () => {
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : APP_DEV_URL;

  // Connection inputs state
  const [supabaseUrlInput, setSupabaseUrlInput] = useState('');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isConfigured, setIsConfigured] = useState(() => checkIsSupabaseConfigured());
  const [activeUrl, setActiveUrl] = useState(() => getEffectiveSupabaseUrl());

  // Copy feedback states
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedSiteUrl, setCopiedSiteUrl] = useState(false);
  const [copiedWildcardUrl, setCopiedWildcardUrl] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  // Connection testing state
  const [testing, setTesting] = useState(false);
  const [connectMessage, setConnectMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details?: {
      authService: boolean;
      profilesTable: boolean;
      portfoliosTable: boolean;
      projectsTable: boolean;
      categoriesCount?: number;
      bucketExists: boolean;
    };
  } | null>(null);

  useEffect(() => {
    const currentUrl = getEffectiveSupabaseUrl();
    const currentKey = getEffectiveSupabaseKey();
    setActiveUrl(currentUrl);
    setIsConfigured(checkIsSupabaseConfigured());

    if (!supabaseUrlInput && currentUrl) {
      setSupabaseUrlInput(currentUrl);
    }
    if (!supabaseKeyInput && currentKey) {
      setSupabaseKeyInput(currentKey);
    }
  }, []);

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const handleSaveAndConnect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setConnectMessage(null);
    setTestResult(null);

    const cleanUrl = normalizeSupabaseUrl(supabaseUrlInput);
    const cleanKey = supabaseKeyInput.trim();

    if (!cleanUrl || !cleanKey) {
      setConnectMessage({
        type: 'error',
        text: 'Please enter both your Supabase Project URL and Public Anon Key.',
      });
      return;
    }

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      setConnectMessage({
        type: 'error',
        text: 'Supabase URL must start with https:// (e.g., https://your-project-id.supabase.co)',
      });
      return;
    }

    try {
      setSupabaseUrlInput(cleanUrl);
      saveCustomSupabaseConfig(cleanUrl, cleanKey);
      reinitSupabaseClient();
      setIsConfigured(true);
      setActiveUrl(cleanUrl);

      setConnectMessage({
        type: 'success',
        text: 'Credentials saved! Running live database diagnostics...',
      });

      // Run live test immediately
      await runDiagnosticTest();
    } catch (err: any) {
      setConnectMessage({
        type: 'error',
        text: `Failed to configure: ${err.message || 'Unknown error'}`,
      });
    }
  };

  const handleFillDefaultProject = async () => {
    setSupabaseUrlInput(DEFAULT_SUPABASE_URL);
    setSupabaseKeyInput(DEFAULT_SUPABASE_KEY);
    saveCustomSupabaseConfig(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_KEY);
    reinitSupabaseClient();
    setIsConfigured(true);
    setActiveUrl(DEFAULT_SUPABASE_URL);
    setConnectMessage({
      type: 'success',
      text: `Loaded project "${DEFAULT_SUPABASE_PROJECT_REF}". Running live diagnostic test...`,
    });
    await runDiagnosticTest();
  };

  const handleDisconnect = () => {
    clearCustomSupabaseConfig();
    reinitSupabaseClient();
    setIsConfigured(false);
    setActiveUrl('');
    setSupabaseUrlInput('');
    setSupabaseKeyInput('');
    setTestResult(null);
    setConnectMessage({
      type: 'info',
      text: 'Custom Supabase connection removed. App is now using in-memory demo data.',
    });
  };

  const runDiagnosticTest = async () => {
    if (!checkIsSupabaseConfigured()) {
      setTestResult({
        success: false,
        message: 'No Supabase credentials detected. Please enter your Project URL and Anon Key above.',
      });
      return;
    }

    setTesting(true);
    try {
      // 1. Auth service ping
      let authOk = false;
      try {
        const { error: sessionError } = await supabase.auth.getSession();
        authOk = !sessionError;
      } catch {
        authOk = false;
      }

      // 2. Test profiles table
      const { error: profileErr } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
      const profilesOk = !profileErr || profileErr.code !== '42P01';

      // 3. Test portfolios table
      const { error: portErr } = await supabase.from('portfolios').select('id', { count: 'exact', head: true });
      const portfoliosOk = !portErr || portErr.code !== '42P01';

      // 4. Test projects table
      const { error: projErr } = await supabase.from('projects').select('id', { count: 'exact', head: true });
      const projectsOk = !projErr || projErr.code !== '42P01';

      // 5. Test categories
      const { count: catCount, error: catErr } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });
      const categoriesOk = !catErr && catErr !== '42P01';

      // 6. Test storage bucket
      let bucketOk = false;
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        bucketOk = Boolean(buckets?.some((b) => b.id === 'portfolio-media'));
      } catch {
        bucketOk = false;
      }

      const allTablesOk = profilesOk && portfoliosOk && projectsOk;

      setTestResult({
        success: allTablesOk,
        message: allTablesOk
          ? 'Live connection verified! Supabase PostgreSQL tables, Row-Level Security, and storage are ready.'
          : 'Connected to Supabase endpoint, but the SQL schema tables have not been created yet. Copy and run the SQL Schema script below in your Supabase SQL Editor.',
        details: {
          authService: authOk,
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
        message: `Connection test error: ${err.message || 'Unable to communicate with Supabase API. Check Project URL and CORS settings.'}`,
      });
    } finally {
      setTesting(false);
    }
  };

  const sampleEnvText = `# Supabase Environment Configuration
VITE_SUPABASE_URL=${activeUrl || 'https://your-project-id.supabase.co'}
VITE_SUPABASE_ANON_KEY=${supabaseKeyInput || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      {/* Page Header */}
      <div className="border-b border-[#E7E2D6] pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141210] text-[#FAF8F5] text-xs font-mono uppercase tracking-wider">
          <Server className="w-3.5 h-3.5" />
          <span>Supabase Integration Manager</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#141210]">
          Connect Your Supabase Database
        </h1>
        <p className="text-sm text-[#57524A] max-w-2xl leading-relaxed">
          Link your Supabase PostgreSQL project with this FD Atelier web application. Configure your Supabase Auth Redirect URLs, connect credentials, and deploy the fashion portfolio schema.
        </p>
      </div>

      {/* SECTION 1: Connect Form */}
      <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-[#141210]" />
              <h2 className="text-xl font-serif font-bold text-[#141210]">Supabase Project Credentials</h2>
            </div>
            <p className="text-xs text-[#57524A] mt-1">
              Find these in your <strong>Supabase Dashboard &rarr; Project Settings &rarr; API</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isConfigured
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span>{isConfigured ? 'Connected' : 'Not Connected'}</span>
            </span>
          </div>
        </div>

        {connectMessage && (
          <div
            className={`p-4 rounded-xl border text-xs flex items-center gap-2.5 ${
              connectMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : connectMessage.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-900'
                : 'bg-stone-50 border-stone-200 text-stone-900'
            }`}
          >
            {connectMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {connectMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
            {connectMessage.type === 'info' && <Activity className="w-4 h-4 text-stone-600 shrink-0" />}
            <span className="font-medium">{connectMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSaveAndConnect} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#141210] uppercase tracking-wider font-mono">
              Supabase Project URL
            </label>
            <input
              type="url"
              value={supabaseUrlInput}
              onChange={(e) => setSupabaseUrlInput(e.target.value)}
              placeholder="https://xyzabcdefghijklm.supabase.co"
              className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#DCD7CD] focus:border-[#141210] focus:bg-white rounded-xl text-xs font-mono transition-colors outline-none"
              required
            />
            <p className="text-[11px] text-[#78716A]">
              Example: <code className="bg-stone-100 px-1 py-0.5 rounded">https://your-project-id.supabase.co</code>
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#141210] uppercase tracking-wider font-mono">
              Supabase Anon / Public Key (API Key)
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={supabaseKeyInput}
                onChange={(e) => setSupabaseKeyInput(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-4 py-2.5 pr-10 bg-[#FAF9F6] border border-[#DCD7CD] focus:border-[#141210] focus:bg-white rounded-xl text-xs font-mono transition-colors outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                tabIndex={-1}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-[#78716A]">
              This is the safe-for-browser <strong>anon public</strong> key from Supabase API settings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={testing}
              className="px-5 py-2.5 bg-[#141210] text-white hover:bg-[#2A2723] disabled:opacity-50 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              {testing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying Connection...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Connect &amp; Test Live</span>
                </>
              )}
            </button>

            {isConfigured && (
              <button
                type="button"
                onClick={runDiagnosticTest}
                disabled={testing}
                className="px-4 py-2.5 border border-[#DCD7CD] hover:border-[#141210] bg-white rounded-xl text-xs font-semibold text-[#141210] flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5 text-stone-600" />
                <span>Re-run Test</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleFillDefaultProject}
              disabled={testing}
              className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset to the project credentials provided in conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Use Project {DEFAULT_SUPABASE_PROJECT_REF}</span>
            </button>

            {isConfigured && (
              <button
                type="button"
                onClick={handleDisconnect}
                className="px-4 py-2.5 text-red-700 hover:bg-red-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ml-auto cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            )}
          </div>
        </form>

        {/* Live Diagnostics Card */}
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
              <span className="font-medium text-sm">{testResult.message}</span>
            </div>

            {testResult.details && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-black/10">
                <div className="bg-white/70 p-2.5 rounded-lg border border-black/5">
                  <div className="text-[10px] text-gray-500 font-mono uppercase">Auth API</div>
                  <div className="flex items-center gap-1.5 mt-0.5 font-semibold text-xs">
                    <span className={`w-2 h-2 rounded-full ${testResult.details.authService ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span>{testResult.details.authService ? 'Online' : 'Failed'}</span>
                  </div>
                </div>

                <div className="bg-white/70 p-2.5 rounded-lg border border-black/5">
                  <div className="text-[10px] text-gray-500 font-mono uppercase">Profiles</div>
                  <div className="flex items-center gap-1.5 mt-0.5 font-semibold text-xs">
                    <span className={`w-2 h-2 rounded-full ${testResult.details.profilesTable ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span>{testResult.details.profilesTable ? 'Active' : 'Missing Table'}</span>
                  </div>
                </div>

                <div className="bg-white/70 p-2.5 rounded-lg border border-black/5">
                  <div className="text-[10px] text-gray-500 font-mono uppercase">Portfolios</div>
                  <div className="flex items-center gap-1.5 mt-0.5 font-semibold text-xs">
                    <span className={`w-2 h-2 rounded-full ${testResult.details.portfoliosTable ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span>{testResult.details.portfoliosTable ? 'Active' : 'Missing Table'}</span>
                  </div>
                </div>

                <div className="bg-white/70 p-2.5 rounded-lg border border-black/5">
                  <div className="text-[10px] text-gray-500 font-mono uppercase">Projects</div>
                  <div className="flex items-center gap-1.5 mt-0.5 font-semibold text-xs">
                    <span className={`w-2 h-2 rounded-full ${testResult.details.projectsTable ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span>{testResult.details.projectsTable ? 'Active' : 'Missing Table'}</span>
                  </div>
                </div>

                <div className="bg-white/70 p-2.5 rounded-lg border border-black/5">
                  <div className="text-[10px] text-gray-500 font-mono uppercase">Media Bucket</div>
                  <div className="flex items-center gap-1.5 mt-0.5 font-semibold text-xs">
                    <span className={`w-2 h-2 rounded-full ${testResult.details.bucketExists ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span>{testResult.details.bucketExists ? 'Ready' : 'Pending'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SECTION 2: Project URLs to Set in Supabase Dashboard */}
      <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#141210]" />
          <div>
            <h2 className="text-xl font-serif font-bold text-[#141210]">Configure Supabase Auth URL Settings</h2>
            <p className="text-xs text-[#57524A] mt-0.5">
              In your Supabase project, navigate to <strong>Authentication &rarr; URL Configuration</strong> and add these exact URLs:
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Site URL */}
          <div className="p-4 bg-[#FAF9F6] border border-[#E7E2D6] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#141210] uppercase">1. Site URL</span>
              <button
                onClick={() => copyToClipboard(currentOrigin, setCopiedSiteUrl)}
                className="px-3 py-1 bg-white hover:bg-stone-50 border border-[#DCD7CD] rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedSiteUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSiteUrl ? 'Copied!' : 'Copy Site URL'}</span>
              </button>
            </div>
            <code className="block bg-white p-2.5 rounded-lg text-xs font-mono text-[#141210] border border-stone-200 break-all select-all">
              {currentOrigin}
            </code>
            <p className="text-[11px] text-[#78716A]">
              Set this as the primary <strong>Site URL</strong> in Supabase Auth.
            </p>
          </div>

          {/* Redirect URLs */}
          <div className="p-4 bg-[#FAF9F6] border border-[#E7E2D6] rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#141210] uppercase">2. Redirect URLs</span>
              <button
                onClick={() => copyToClipboard(`${currentOrigin}/**`, setCopiedWildcardUrl)}
                className="px-3 py-1 bg-white hover:bg-stone-50 border border-[#DCD7CD] rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedWildcardUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWildcardUrl ? 'Copied Wildcard!' : 'Copy Wildcard Redirect'}</span>
              </button>
            </div>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="bg-white p-2 rounded border border-stone-200 select-all">{currentOrigin}/**</div>
              {APP_PRE_URL !== currentOrigin && (
                <div className="bg-white p-2 rounded border border-stone-200 select-all">{APP_PRE_URL}/**</div>
              )}
              <div className="bg-white p-2 rounded border border-stone-200 select-all">http://localhost:3000/**</div>
            </div>
            <p className="text-[11px] text-[#78716A]">
              Add each of these entries under <strong>Redirect URLs</strong> in Supabase Auth to allow logins and email verification links.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: Step-by-Step Guide */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-[#141210]">3-Step Setup Walkthrough</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#141210] text-white flex items-center justify-center text-xs font-bold font-mono">
              01
            </div>
            <h3 className="font-serif font-bold text-[#141210]">Create Project</h3>
            <p className="text-xs text-[#57524A] leading-relaxed">
              Create a free project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold text-[#141210]">supabase.com</a>. Copy your Project URL &amp; anon key from Project Settings &rarr; API.
            </p>
          </div>

          <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#141210] text-white flex items-center justify-center text-xs font-bold font-mono">
              02
            </div>
            <h3 className="font-serif font-bold text-[#141210]">Connect In App</h3>
            <p className="text-xs text-[#57524A] leading-relaxed">
              Paste the Project URL and anon key into the input fields above and click <strong>Connect &amp; Test Live</strong>.
            </p>
            <button
              onClick={() => copyToClipboard(sampleEnvText, setCopiedEnv)}
              className="mt-2 w-full py-1.5 px-3 border border-[#DCD7CD] hover:border-[#141210] rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedEnv ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEnv ? 'Copied .env Format' : 'Copy .env Format'}</span>
            </button>
          </div>

          <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-8 h-8 rounded-full bg-[#141210] text-white flex items-center justify-center text-xs font-bold font-mono">
              03
            </div>
            <h3 className="font-serif font-bold text-[#141210]">Run SQL Schema</h3>
            <p className="text-xs text-[#57524A] leading-relaxed">
              Open your Supabase SQL Editor and run the script below to generate all tables, RLS security policies, and media buckets.
            </p>
            <a
              href={`https://supabase.com/dashboard/project/${getSupabaseProjectRef(activeUrl)}/sql/new`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full py-1.5 px-3 bg-[#141210] text-white hover:bg-[#2A2723] rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Open Project SQL Editor</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 4: Complete SQL Migration Script */}
      <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#141210]" />
            <h2 className="font-serif text-xl font-bold text-[#141210]">Complete PostgreSQL Schema Script</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`https://supabase.com/dashboard/project/${getSupabaseProjectRef(activeUrl)}/sql/new`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-[#DCD7CD] hover:border-[#141210] bg-white rounded-xl text-xs font-semibold text-[#141210] flex items-center gap-1.5 transition-colors"
            >
              <span>Open Supabase SQL</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => copyToClipboard(FULL_SQL_MIGRATION, setCopiedSql)}
              className="px-4 py-2 bg-[#141210] text-white hover:bg-[#2A2723] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedSql ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedSql ? 'Copied Complete SQL!' : 'Copy Complete SQL Script'}</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-[#57524A] leading-relaxed">
          This script creates the <code className="bg-[#FAF9F6] px-1 py-0.5 rounded font-mono text-[#141210]">profiles</code>, <code className="bg-[#FAF9F6] px-1 py-0.5 rounded font-mono text-[#141210]">portfolios</code>, <code className="bg-[#FAF9F6] px-1 py-0.5 rounded font-mono text-[#141210]">projects</code>, <code className="bg-[#FAF9F6] px-1 py-0.5 rounded font-mono text-[#141210]">portfolio_projects</code>, <code className="bg-[#FAF9F6] px-1 py-0.5 rounded font-mono text-[#141210]">project_images</code>, <code className="bg-[#FAF9F6] px-1 py-0.5 rounded font-mono text-[#141210]">categories</code>, <code className="bg-[#FAF9F6] px-1 py-0.5 rounded font-mono text-[#141210]">reports</code>, and <code className="bg-[#FAF9F6] px-1 py-0.5 rounded font-mono text-[#141210]">platform_settings</code> tables, configures Row-Level Security (RLS), and sets up the <code className="bg-[#FAF9F6] px-1 py-0.5 rounded font-mono text-[#141210]">portfolio-media</code> storage bucket.
        </p>

        <div className="bg-[#1C1917] text-[#FAF8F5] p-5 rounded-xl font-mono text-xs max-h-96 overflow-y-auto leading-relaxed border border-stone-800">
          <pre>{FULL_SQL_MIGRATION}</pre>
        </div>
      </div>

      {/* SECTION 5: Next Actions */}
      <div className="p-6 bg-[#FAF9F6] border border-[#E7E2D6] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif font-bold text-base text-[#141210]">Ready to test authentication &amp; portfolios?</h3>
          <p className="text-xs text-[#57524A] mt-0.5">
            Once connected and migrated, create an account or sign in to verify real database persistence.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/register"
            className="px-5 py-2.5 bg-[#141210] text-white hover:bg-[#2A2723] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Create Atelier Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/login"
            className="px-4 py-2.5 border border-[#DCD7CD] hover:border-[#141210] bg-white rounded-xl text-xs font-semibold text-[#141210] transition-colors"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
