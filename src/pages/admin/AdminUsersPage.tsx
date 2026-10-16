import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUsersAdmin, updateUserRole, updateUserStatus } from '../../services/adminService';
import { Profile } from '../../types/database';
import { Search, Shield, UserCheck, UserX, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const loadUsers = () => {
    setLoading(true);
    fetchUsersAdmin(search).then((data) => {
      setUsers(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadUsers();
  }, [search]);

  const handleToggleRole = async (targetUser: Profile) => {
    if (!user?.id) return;
    if (targetUser.id === user.id) {
      alert('You cannot modify your own administrative role.');
      return;
    }
    const nextRole = targetUser.role === 'admin' ? 'user' : 'admin';
    setActionLoading(true);
    const { success, error } = await updateUserRole(
      user.id,
      targetUser.id,
      nextRole,
      `Administrative role change to ${nextRole}`
    );
    setActionLoading(false);

    if (success) {
      setNotification(`Role updated to ${nextRole} for ${targetUser.display_name}`);
      loadUsers();
      setTimeout(() => setNotification(null), 3000);
    } else if (error) {
      alert(error.message);
    }
  };

  const handleToggleStatus = async (targetUser: Profile) => {
    if (!user?.id) return;
    if (targetUser.id === user.id) {
      alert('You cannot suspend your own administrative account.');
      return;
    }
    const nextStatus = targetUser.account_status === 'active' ? 'suspended' : 'active';
    setActionLoading(true);
    const { success, error } = await updateUserStatus(
      user.id,
      targetUser.id,
      nextStatus,
      `Administrative status change to ${nextStatus}`
    );
    setActionLoading(false);

    if (success) {
      setNotification(`Status updated to ${nextStatus} for ${targetUser.display_name}`);
      loadUsers();
      setTimeout(() => setNotification(null), 3000);
    } else if (error) {
      alert(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#141210]">Designer Account Management</h1>
          <p className="text-xs text-[#57524A] mt-0.5">
            Manage authenticated users, grant administrative roles, or suspend policy-violating accounts.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-[#A3998F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, institution..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#DCD7CD] rounded-lg text-xs text-[#141210] focus:outline-hidden"
          />
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white border border-[#E7E2D6] rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#78716A]">Querying user accounts...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#78716A]">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F6] border-b border-[#E7E2D6] text-[#78716A] uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Designer</th>
                  <th className="py-3 px-4">User Type</th>
                  <th className="py-3 px-4">Institution</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE1]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#FAF9F6]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <p className="font-semibold text-[#141210]">{u.display_name}</p>
                        <p className="text-[11px] font-mono text-[#78716A]">{u.id.slice(0, 8)}...</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 capitalize text-[#57524A]">{u.user_type || 'student'}</td>
                    <td className="py-3.5 px-4 text-[#57524A]">{u.institution || '—'}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded font-bold ${
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded ${
                          u.account_status === 'active'
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-red-50 text-red-800'
                        }`}
                      >
                        {u.account_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleRole(u)}
                        disabled={actionLoading}
                        className="px-2.5 py-1 border border-[#DCD7CD] hover:border-[#141210] rounded text-[11px] font-medium transition-colors"
                      >
                        {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                      </button>
                      <button
                        onClick={() => handleToggleStatus(u)}
                        disabled={actionLoading}
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                          u.account_status === 'active'
                            ? 'bg-red-50 text-red-700 hover:bg-red-100'
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        }`}
                      >
                        {u.account_status === 'active' ? 'Suspend' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
