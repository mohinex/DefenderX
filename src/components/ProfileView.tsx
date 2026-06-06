import React, { useState } from 'react';
import { User, ShieldCheck, Mail, ShieldAlert, Key, Edit3, Save, RefreshCw, Smartphone, Globe, Calendar, ToggleLeft, HardDrive } from 'lucide-react';
import { securedFetch, safeDecodeToken } from '../lib/api';
import { triggerSecOpsToast } from './ToastContainer';

interface ProfileViewProps {
  isDark: boolean;
  user: any;
  onUpdateSuccess?: (updatedUser: any) => void;
}

export default function ProfileView({ isDark, user, onUpdateSuccess }: ProfileViewProps) {
  const [name, setName] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      triggerSecOpsToast('VALIDATION ERROR\nOperator designation cannot be blank.', 'blocked');
      return;
    }
    setIsSaving(true);

    try {
      const response = await securedFetch('/api/v1/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name: name.trim() })
      });

      triggerSecOpsToast('PROFILE RECORD RE-WRITTEN\nOperator moniker updated successfully.', 'resolved');
      setIsEditing(false);
      
      // Update local storage representation
      if (response && response.token) {
        localStorage.setItem('eurosia_token', response.token);
      } else {
        const token = localStorage.getItem('eurosia_token');
        if (token) {
          try {
            const decoded = safeDecodeToken(token);
            if (decoded) {
              decoded.name = name.trim();
              localStorage.setItem('eurosia_token', btoa(JSON.stringify(decoded)));
            }
          } catch (e) {}
        }
      }

      if (onUpdateSuccess) {
        onUpdateSuccess(response.user);
      }
    } catch (err: any) {
      triggerSecOpsToast(`UPDATE FAILED\n${err.message || 'Error syncing to main grid.'}`, 'blocked');
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'text-red-400 bg-red-950/40 border-red-500/30';
      case 'analyst': return 'text-[#4D8DFF] bg-blue-950/40 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-900 border-gray-700';
    }
  };

  return (
    <div className="w-full select-none flex flex-col gap-6 animate-fade-in">
      <div 
        className="border rounded-xl p-6 sm:p-8 backdrop-blur-md transition-all duration-300 relative overflow-hidden"
        style={{
          borderColor: isDark ? 'rgba(77, 141, 255, 0.18)' : 'rgba(10, 16, 37, 0.12)',
          backgroundColor: isDark ? 'rgba(10, 16, 37, 0.85)' : 'rgba(255, 255, 255, 0.85)'
        }}
      >
        {/* Subtle grid background accent */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(77,141,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(77,141,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

        {/* Title and operational info header */}
        <div className="flex justify-between items-start border-b pb-4 mb-6 relative z-10" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <User className={isDark ? 'text-accent-blue' : 'text-blue-primary'} size={18} />
              <h2 className="font-display font-black text-sm tracking-tight uppercase">OPERATOR CONSOLE CERTIFICATE</h2>
            </div>
            <p className="text-[10px] text-gray-500 font-mono tracking-wide">
              AUTHORIZED PROFILE IDENTITIES AND LOCAL TRANSCEIVER SIGNATURE KEYS
            </p>
          </div>
          <span className={`font-mono text-[9px] tracking-widest px-2.5 py-1 rounded-md border font-black uppercase ${getRoleColor(user?.role)}`}>
            {user?.role === 'admin' ? 'L9 ADMIN' : user?.role === 'analyst' ? 'L4 ANALYST' : 'L2 AUDITOR'}
          </span>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          
          {/* Left Section: Graphical Badge Layout */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div 
              className="w-48 h-48 rounded-2xl border flex flex-col items-center justify-center p-4 relative tracking-widest text-center shadow-xl overflow-hidden group select-none"
              style={{
                borderColor: isDark ? 'rgba(77, 141, 255, 0.3)' : 'rgba(10, 16, 37, 0.15)',
                background: isDark ? 'linear-gradient(135deg, rgba(10,16,37,0.9) 0%, rgba(5,8,22,0.95) 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f0f2f8 100%)'
              }}
            >
              {/* Pulsing tactical crosshairs */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-red-500/55" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-red-500/55" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-red-500/55" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-red-500/55" />
              
              <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-red-alert via-[#0057FF] to-[#4D8DFF] flex items-center justify-center p-[2px] mb-3 shadow-md">
                <div className="w-full h-full bg-[#050816] rounded-full flex items-center justify-center text-white font-display font-black text-2xl uppercase">
                  {user?.name ? user.name[0] : 'U'}
                </div>
              </div>

              <div className="text-xs font-display font-black tracking-wide truncate max-w-full" style={{ color: isDark ? '#ffffff' : '#0a1025' }}>
                {user?.name || 'OPERATOR NODE'}
              </div>
              <div className="text-[8px] font-mono font-bold tracking-widest text-gray-500 mt-1 uppercase">
                {user?.accessLevel || 'Clearance L2'}
              </div>

              <div className="mt-4 flex items-center gap-1 bg-[#00C853]/10 text-[#00c853] text-[8px] font-mono font-black px-2 py-0.5 rounded border border-[#00c853]/20 animate-pulse">
                <ShieldCheck size={9} />
                <span>SECURE TUNNEL LIVE</span>
              </div>
            </div>
          </div>

          {/* Right Section: Form Fields and Metadata Metrics */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <form onSubmit={handleSaveProfile} className="space-y-4">
              
              {/* Registered Node Identifier (Email) */}
              <div>
                <label className="block text-[9px] font-mono tracking-widest font-black text-gray-500 mb-1.5 uppercase">
                  REGISTERED NODE IDENTITY
                </label>
                <div className="flex items-center gap-2 border rounded-lg bg-black/15 px-3.5 py-2.5 border-dashed" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.1)' }}>
                  <Mail size={13} className="text-accent-blue" />
                  <span className="text-xs font-mono text-gray-400 select-text font-semibold">{user?.email}</span>
                </div>
              </div>

              {/* Operator Moniker Edit */}
              <div>
                <label className="block text-[9px] font-mono tracking-widest font-black text-gray-500 mb-1.5 uppercase">
                  OPERATOR CALL-SIGN / MONIKER
                </label>
                
                {isEditing ? (
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Admiral X"
                      maxLength={80}
                      className="flex-1 bg-black/20 border text-xs px-3.5 py-2 rounded-lg text-white focus:outline-none"
                      style={{ borderColor: 'var(--color-accent-blue)' }}
                    />
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 bg-[#00C853] text-[10px] font-mono font-black text-white hover:bg-opacity-80 rounded-lg cursor-pointer flex items-center gap-1.5 transition-all"
                    >
                      {isSaving ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                      UPDATE
                    </button>
                    <button
                      type="button"
                      onClick={() => { setName(user?.name || ''); setIsEditing(false); }}
                      className="px-3.5 py-2 bg-gray-500/20 text-[10px] font-mono font-bold text-gray-400 hover:bg-gray-500/30 rounded-lg cursor-pointer transition-all"
                    >
                      CANCEL
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-black/5 rounded-lg border px-3.5 py-2.5" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(10,16,37,0.1)' }}>
                    <span className="font-display font-bold text-xs" style={{ color: isDark ? '#ffffff' : '#0a1025' }}>{user?.name}</span>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="text-accent-blue hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-mono text-[9px] font-extrabold uppercase"
                    >
                      <Edit3 size={11} />
                      RE-WRITE
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Cryptographic Session Heartbeat info block */}
            <div className="mt-8 pt-6 border-t font-mono text-[10px] uppercase leading-relaxed text-gray-500 space-y-2 border-dashed" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.1)' }}>
              <div className="flex justify-between items-center">
                <span className="font-bold flex items-center gap-1"><Smartphone size={11} className="text-gray-400" /> DIRECT CIPHER TRANSCEIVER:</span>
                <span className="text-[#00C853] font-extrabold">Active (AES-256 GCM)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold flex items-center gap-1"><Calendar size={11} className="text-gray-400" /> CREATED STENCIL BOUNDS:</span>
                <span className="text-gray-400">06/06/2026 - SEC_NET_NODE01</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold flex items-center gap-1"><Globe size={11} className="text-gray-400" /> TUNNEL SECURITY BOUNDARY:</span>
                <span className="text-accent-blue font-extrabold">SSL DIRECT SHUNT</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold flex items-center gap-1"><Key size={11} className="text-gray-400" /> BYPASS OVERRIDE CLEARANCE:</span>
                <span className="text-amber-400 font-extrabold">{user?.role === 'admin' ? 'SEC_COOPS L9' : 'READ_ONLY L2'}</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
