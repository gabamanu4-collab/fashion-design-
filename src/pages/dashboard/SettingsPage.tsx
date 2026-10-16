import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AlertTriangle, Lock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updatePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordError('Password must contain at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    setPasswordError(null);

    const { error } = await updatePassword(newPassword);
    setPasswordLoading(false);

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;

    setDeleteLoading(true);
    setDeleteError(null);

    const { error } = await deleteAccount();
    setDeleteLoading(false);

    if (error) {
      setDeleteError(error.message);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-[#E7E2D6]">
        <span className="text-xs font-mono tracking-widest uppercase text-[#78716A]">
          Security &amp; Account
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141210]">
          Account Settings
        </h1>
        <p className="text-xs text-[#57524A] mt-1">
          Manage your atelier authentication credentials, privacy configurations, and data retention.
        </p>
      </div>

      {/* Password Update */}
      <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#141210]" />
          <h2 className="font-serif text-xl font-bold text-[#141210]">Update Atelier Password</h2>
        </div>

        {passwordSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Password successfully updated.</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-[#141210] mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
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
              className="w-full text-xs p-3 rounded-lg border border-[#DCD7CD] bg-[#FAF9F6] text-[#141210]"
            />
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="px-5 py-2.5 bg-[#141210] text-white hover:bg-[#2A2723] rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Privacy and Data Protection Notice */}
      <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <h2 className="font-serif text-xl font-bold text-[#141210]">Data Privacy &amp; RLS Protection</h2>
        </div>
        <p className="text-xs text-[#57524A] leading-relaxed">
          Your account is secured by PostgreSQL Row Level Security (RLS). Private portfolios, unpublished draft projects, and internal notes are not accessible to public visitors. When you publish a portfolio, only approved fields and project images are made queryable by external clients.
        </p>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="bg-red-50/50 border border-red-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="font-serif text-xl font-bold">Delete Atelier Account</h2>
        </div>
        <p className="text-xs text-red-800 leading-relaxed max-w-xl">
          Deleting your account will permanently remove your designer profile, all created fashion portfolios, design project technical specs, and uploaded images from Supabase Storage. This action is irreversible.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition-colors"
        >
          Initiate Account Deletion
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E7E2D6] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-serif text-xl font-bold text-[#141210]">Permanently Delete Account?</h3>
            </div>
            <p className="text-xs text-[#57524A] leading-relaxed">
              To confirm account erasure and purge all portfolios from Supabase PostgreSQL, please type <strong className="text-red-600 font-mono">DELETE</strong> in the field below:
            </p>

            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full text-xs p-3 rounded-lg border border-red-300 bg-red-50/30 font-mono text-[#141210]"
            />

            {deleteError && (
              <p className="text-xs text-red-600">{deleteError}</p>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-[#F0ECE1]">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                className="px-4 py-2 border border-[#DCD7CD] rounded-lg text-xs font-semibold hover:bg-[#FAF9F6]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 disabled:opacity-40"
              >
                {deleteLoading ? 'Erasing Account...' : 'Confirm Permanent Deletion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
