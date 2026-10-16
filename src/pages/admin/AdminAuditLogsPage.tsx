import React, { useEffect, useState } from 'react';
import { fetchAuditLogs } from '../../services/adminService';
import { AdminAuditLog } from '../../types/database';
import { Clock, Shield, Database } from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs().then((data) => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#141210]">Administrative Audit Trail</h1>
        <p className="text-xs text-[#57524A] mt-0.5">
          Immutable logs documenting privileged administrator actions, target identifiers, and rationale.
        </p>
      </div>

      <div className="bg-white border border-[#E7E2D6] rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#78716A]">Querying admin_audit_logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#78716A]">No audit logs recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F6] border-b border-[#E7E2D6] text-[#78716A] uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Type</th>
                  <th className="py-3 px-4">Target ID</th>
                  <th className="py-3 px-4">Reason / Notes</th>
                  <th className="py-3 px-4">Actor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0ECE1]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAF9F6]/50">
                    <td className="py-3 px-4 font-mono text-[11px] text-[#78716A]">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#141210]">{log.action}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#57524A] uppercase">{log.target_type}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#78716A]">{log.target_id.slice(0, 8)}...</td>
                    <td className="py-3 px-4 text-[#57524A]">{log.reason || '—'}</td>
                    <td className="py-3 px-4 text-[#57524A]">{log.actor?.display_name || 'System / Admin'}</td>
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
