import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchPlatformSettings, updatePlatformSetting } from '../../services/adminService';
import { PlatformSetting } from '../../types/database';
import { Save, CheckCircle2, Shield } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<PlatformSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [platformName, setPlatformName] = useState('FD Design Portfolio Builder');
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [maxFileSize, setMaxFileSize] = useState(10);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchPlatformSettings().then((data) => {
      setSettings(data);
      const general = data.find((s) => s.key === 'general');
      if (general?.value?.platform_name) setPlatformName(general.value.platform_name);
      if (general?.value?.allow_registration !== undefined) setAllowRegistration(general.value.allow_registration);
      const uploads = data.find((s) => s.key === 'uploads');
      if (uploads?.value?.max_file_size_mb) setMaxFileSize(uploads.value.max_file_size_mb);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    await updatePlatformSetting('general', { platform_name: platformName, allow_registration: allowRegistration }, user.id);
    await updatePlatformSetting('uploads', { max_file_size_mb: maxFileSize }, user.id);

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#141210]">Platform Configuration &amp; Governance</h1>
        <p className="text-xs text-[#57524A] mt-0.5">
          Global platform parameters persisted in the platform_settings table.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Platform configuration persisted.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-[#E7E2D6] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div>
          <label className="block text-xs font-semibold text-[#141210] mb-1">Platform Name</label>
          <input
            type="text"
            value={platformName}
            onChange={(e) => setPlatformName(e.target.value)}
            className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#141210] mb-1">
            Max Media Upload Size (MB)
          </label>
          <input
            type="number"
            value={maxFileSize}
            onChange={(e) => setMaxFileSize(parseInt(e.target.value, 10) || 10)}
            className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-[#141210] cursor-pointer">
            <input
              type="checkbox"
              checked={allowRegistration}
              onChange={(e) => setAllowRegistration(e.target.checked)}
              className="rounded border-[#DCD7CD] text-[#141210]"
            />
            <span>Allow Public Designer Account Registration</span>
          </label>
        </div>

        <div className="pt-2 border-t border-[#F0ECE1] flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#141210] text-white hover:bg-[#2A2723] rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
