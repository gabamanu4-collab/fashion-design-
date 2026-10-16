import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchReports, updateReportStatus } from '../../services/adminService';
import { Report } from '../../types/database';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReports = () => {
    setLoading(true);
    fetchReports().then((data) => {
      setReports(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleUpdateStatus = async (reportId: string, status: Report['status']) => {
    if (!user?.id) return;
    await updateReportStatus(user.id, reportId, status);
    loadReports();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#141210]">Content Reports &amp; Abuse Moderation</h1>
        <p className="text-xs text-[#57524A] mt-0.5">
          Review complaints filed regarding intellectual property copyright, content abuse, or guidelines.
        </p>
      </div>

      <div className="bg-white border border-[#E7E2D6] rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#78716A]">Checking reports...</div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#78716A]">
            No reports filed. Community standards are well-maintained.
          </div>
        ) : (
          <div className="divide-y divide-[#F0ECE1]">
            {reports.map((r) => (
              <div key={r.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold">
                      {r.target_type}
                    </span>
                    <span className="font-semibold text-[#141210]">Reason: {r.reason}</span>
                    <span className="text-[#78716A]">· Target ID: {r.target_id.slice(0, 8)}...</span>
                  </div>
                  {r.description && <p className="text-[#57524A] text-xs">{r.description}</p>}
                  <p className="text-[11px] font-mono text-[#78716A]">
                    Reported by {r.reporter?.display_name || 'Anonymous'} · {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                    {r.status}
                  </span>
                  {r.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(r.id, 'actioned')}
                        className="px-2.5 py-1 bg-[#141210] text-white hover:bg-[#2A2723] rounded text-[11px] font-medium"
                      >
                        Action Report
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(r.id, 'dismissed')}
                        className="px-2.5 py-1 border border-[#DCD7CD] hover:bg-[#FAF9F6] rounded text-[11px] font-medium"
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
