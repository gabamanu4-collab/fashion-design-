import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPlatformStats, fetchAuditLogs, AdminStats } from '../../services/adminService';
import { AdminAuditLog } from '../../types/database';
import { Users, FolderGit2, AlertTriangle, Eye, Shield, ArrowRight, Clock } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    verifiedUsers: 0,
    activeUsers: 0,
    totalPortfolios: 0,
    publishedPortfolios: 0,
    draftPortfolios: 0,
    pendingReports: 0,
    totalViews: 0,
  });
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchPlatformStats(), fetchAuditLogs()]).then(([st, logs]) => {
      setStats(st);
      setAuditLogs(logs);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#141210]">
          Platform Administration Overview
        </h1>
        <p className="text-xs text-[#57524A] mt-1">
          Real-time metrics calculated from PostgreSQL tables via Supabase service queries.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 border border-[#E7E2D6] rounded-xl bg-white space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-[#78716A]">
            <span>TOTAL USERS</span>
            <Users className="w-4 h-4" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#141210]">{stats.totalUsers}</p>
          <span className="text-[11px] text-[#78716A] block">
            {stats.activeUsers} Active Accounts
          </span>
        </div>

        <div className="p-5 border border-[#E7E2D6] rounded-xl bg-white space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-[#78716A]">
            <span>RUNWAY PORTFOLIOS</span>
            <FolderGit2 className="w-4 h-4" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#141210]">{stats.totalPortfolios}</p>
          <span className="text-[11px] text-[#78716A] block">
            {stats.publishedPortfolios} Published · {stats.draftPortfolios} Drafts
          </span>
        </div>

        <div className="p-5 border border-[#E7E2D6] rounded-xl bg-white space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-[#78716A]">
            <span>PENDING REPORTS</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#141210]">{stats.pendingReports}</p>
          <span className="text-[11px] text-[#78716A] block">
            {stats.pendingReports === 0 ? 'No actions required' : 'Requires moderator review'}
          </span>
        </div>

        <div className="p-5 border border-[#E7E2D6] rounded-xl bg-white space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-[#78716A]">
            <span>PUBLIC VIEWS</span>
            <Eye className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#141210]">{stats.totalViews}</p>
          <span className="text-[11px] text-[#78716A] block">Privacy-conscious hits</span>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="p-6 border border-[#E7E2D6] rounded-xl bg-white hover:border-[#141210] transition-colors space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-[#141210]">User Accounts</h3>
            <ArrowRight className="w-4 h-4 text-[#78716A] group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-[#57524A]">
            Review registered designers, promote administrators, and manage account restrictions or suspensions.
          </p>
        </Link>

        <Link
          to="/admin/portfolios"
          className="p-6 border border-[#E7E2D6] rounded-xl bg-white hover:border-[#141210] transition-colors space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-[#141210]">Portfolio Moderation</h3>
            <ArrowRight className="w-4 h-4 text-[#78716A] group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-[#57524A]">
            Feature outstanding runway archives on the home feed, approve submissions, or unpublish flagged items.
          </p>
        </Link>

        <Link
          to="/admin/audit-logs"
          className="p-6 border border-[#E7E2D6] rounded-xl bg-white hover:border-[#141210] transition-colors space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-[#141210]">Audit Trail</h3>
            <ArrowRight className="w-4 h-4 text-[#78716A] group-hover:translate-x-1 transition-transform" />
          </div>
          <p className="text-xs text-[#57524A]">
            Review tamper-evident administrative logs with actor ID, action type, target, and timestamp.
          </p>
        </Link>
      </div>

      {/* Recent Administrative Activity */}
      <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg text-[#141210]">Recent Admin Actions</h2>
          <Link
            to="/admin/audit-logs"
            className="text-xs font-mono uppercase text-[#78716A] hover:text-[#141210]"
          >
            Full Trail &rarr;
          </Link>
        </div>

        {auditLogs.length === 0 ? (
          <p className="text-xs text-[#78716A] py-4 text-center">
            No administrative operations recorded yet in admin_audit_logs table.
          </p>
        ) : (
          <div className="divide-y divide-[#F0ECE1]">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono text-[11px] font-bold text-[#141210]">
                    {log.action}
                  </span>
                  <p className="text-[11px] text-[#78716A] mt-0.5">
                    Target: {log.target_type} ({log.target_id.slice(0, 8)}...) · {log.reason || 'Routine action'}
                  </p>
                </div>
                <div className="text-right text-[11px] font-mono text-[#78716A]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(log.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
