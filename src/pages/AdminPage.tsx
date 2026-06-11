import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Key, Users, FileText, Settings2, ShieldCheck, UserX, UserCheck, AlertTriangle } from 'lucide-react';
import { securedFetch } from '../lib/api';
import { triggerSecOpsToast } from '../components/ToastContainer';

export default function AdminPage() {
  const { loggedInUser, isDark } = useApp();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Re-verify clearance level and authentication
  useEffect(() => {
    if (!loggedInUser) {
      navigate('/login');
    } else if (loggedInUser.role !== 'admin') {
      triggerSecOpsToast('ACCESS DENIED\nAdministrative privilege is required to access the cockpit.', 'blocked');
      navigate('/dashboard');
    }
  }, [loggedInUser, navigate]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const uRes = await securedFetch('/api/v1/users');
      if (uRes && uRes.users) {
        setUsers(uRes.users);
      }
      
      const aRes = await securedFetch('/api/v1/secops/audit-logs');
      if (aRes && aRes.auditLogs) {
        setAuditLogs(aRes.auditLogs);
      }
    } catch (e: any) {
      console.error('Error hydrating admin parameters:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (loggedInUser && loggedInUser.role === 'admin') {
      loadData();
    }
  }, [loggedInUser]);

  const handleUpdateRole = async (targetEmail: string, nextRole: string) => {
    // Check self-lockout risk
    if (targetEmail.toLowerCase().trim() === loggedInUser.email.toLowerCase().trim() && nextRole !== 'admin') {
      triggerSecOpsToast('OPERATION BLOCKED\nYou cannot revoke administrative clearances from your own active profile.', 'blocked');
      return;
    }

    try {
      const res = await securedFetch(`/api/v1/users/${targetEmail}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole })
      });
      if (res && res.success) {
        triggerSecOpsToast(`AUTHORIZATION MODIFIED\nClearance for ${targetEmail} set to ${nextRole.toUpperCase()}`, 'resolved');
        loadData();
      }
    } catch (err: any) {
      triggerSecOpsToast(err.message || 'Unauthorized override rejected.', 'blocked');
    }
  };

  if (!loggedInUser || loggedInUser.role !== 'admin') {
    return null;
  }

  return (
    <Layout activeRoute="/admin" inConsoleMode={true}>
      <div className="w-full max-w-7xl mx-auto px-6 flex flex-col gap-8">
        
        {/* HEADER AREA */}
        <section className="flex flex-col md:flex-row items-center justify-between border-b pb-8 gap-4" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
          <div>
            <span className="text-xs font-mono font-bold tracking-wider text-red-500 uppercase flex items-center gap-1.5 justify-center md:justify-start">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              L9 ADMIN SECURITY CABIN
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1">
              Clearance & Access Control
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Direct terminal overrides to manage, escalate, or revoke active personnel authorization credentials.
            </p>
          </div>
          <button 
            onClick={loadData}
            className="px-4 py-2 border rounded-lg font-mono text-xs font-bold hover:bg-white/5 transition-all duration-200"
            style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
          >
            REFRESH DIRECTORY MATRIX
          </button>
        </section>

        {isLoading ? (
          <div className="p-12 text-center text-sm font-mono text-gray-400">Loading central clearance parameters...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* OPERATOR DIRECTORY PANEL - LEFT */}
            <div 
              className="lg:col-span-7 border rounded-2xl p-6 backdrop-blur-md relative overflow-hidden"
              style={{
                borderColor: isDark ? 'rgba(77, 141, 255, 0.15)' : 'rgba(10, 16, 37, 0.12)',
                background: isDark ? 'rgba(10, 16, 37, 0.4)' : 'rgba(255, 255, 255, 0.5)'
              }}
            >
              <div className="flex items-center gap-2.5 mb-6 border-b pb-4" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                <Users size={18} className="text-red-500" />
                <h3 className="font-bold text-sm tracking-tight uppercase">OPERATOR ROSTER DIRECTORY</h3>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                      <th className="py-2.5 text-gray-500 font-bold uppercase pb-2">OPERATOR moniker</th>
                      <th className="py-2.5 text-gray-500 font-bold uppercase pb-2">EMAIL CONNECTOR</th>
                      <th className="py-2.5 text-gray-500 font-bold uppercase pb-2">ROLE LEVEL</th>
                      <th className="py-2.5 text-gray-500 font-bold uppercase pb-2 text-right">TACTICAL OVERRIDES</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
                    {users.map(u => (
                      <tr key={u.email} className="hover:bg-red-500/5 transition-colors">
                        <td className="py-3 font-sans font-black text-sm">{u.name}</td>
                        <td className="py-3 font-mono text-gray-400 font-light select-text">{u.email}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider ${
                            u.role === 'admin' 
                              ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                              : u.role === 'analyst'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="inline-flex gap-1.5 justify-end">
                            <button
                              onClick={() => handleUpdateRole(u.email, 'admin')}
                              disabled={u.role === 'admin'}
                              className={`px-2 py-1 rounded text-[9.5px] font-mono font-bold border transition-all duration-200 cursor-pointer ${
                                u.role === 'admin' 
                                  ? 'bg-red-500/5 text-red-500/30 border-red-500/10 cursor-not-allowed'
                                  : 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/25'
                              }`}
                            >
                              ADMIN
                            </button>
                            <button
                              onClick={() => handleUpdateRole(u.email, 'analyst')}
                              disabled={u.role === 'analyst'}
                              className={`px-2 py-1 rounded text-[9.5px] font-mono font-bold border transition-all duration-200 cursor-pointer ${
                                u.role === 'analyst'
                                  ? 'bg-blue-500/5 text-blue-400/30 border-blue-500/10 cursor-not-allowed'
                                  : 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/25'
                              }`}
                            >
                              ANALYST
                            </button>
                            <button
                              onClick={() => handleUpdateRole(u.email, 'readonly')}
                              disabled={u.role === 'readonly'}
                              className={`px-2 py-1 rounded text-[9.5px] font-mono font-bold border transition-all duration-200 cursor-pointer ${
                                u.role === 'readonly'
                                  ? 'bg-gray-500/5 text-gray-400/30 border-gray-500/10 cursor-not-allowed'
                                  : 'bg-gray-500/10 border-gray-500/20 text-gray-400 hover:bg-gray-500/25'
                              }`}
                            >
                              REVOKE
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AUDIT LOG PANEL - RIGHT */}
            <div 
              className="lg:col-span-5 border rounded-2xl p-6 backdrop-blur-md relative overflow-hidden flex flex-col h-[520px]"
              style={{
                borderColor: isDark ? 'rgba(77, 141, 255, 0.15)' : 'rgba(10, 16, 37, 0.12)',
                background: isDark ? 'rgba(10, 16, 37, 0.4)' : 'rgba(255, 255, 255, 0.5)'
              }}
            >
              <div className="flex items-center gap-2.5 mb-4 border-b pb-4" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                <FileText size={18} className="text-blue-500" />
                <h3 className="font-bold text-sm tracking-tight uppercase">CENTRAL CONSOLE AUDIT LOGS</h3>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                {auditLogs.length === 0 ? (
                  <p className="text-gray-500 font-mono text-xs text-center py-8">No historical audit traces found on local index stores.</p>
                ) : (
                  auditLogs.map(log => (
                    <div 
                      key={log.id} 
                      className="p-3.5 rounded-lg border flex flex-col gap-1.5 font-mono text-[10.5px] tracking-wide"
                      style={{
                        borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)',
                        background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.3)'
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-red-500 font-bold font-mono">[{log.action.toUpperCase()}]</span>
                        <span className="text-gray-500 text-[9px]">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed break-all" style={{ color: isDark ? '#b8c1d1' : '#4a5568' }}>{log.details}</p>
                      <div className="flex justify-between items-center text-[9px] text-gray-500 mt-1 border-t pt-1.5 border-dashed border-white/5">
                        <span>OPERATOR: {log.performedBy}</span>
                        <span>IP: {log.ipAddress}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}
