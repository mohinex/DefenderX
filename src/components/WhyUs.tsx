import React, { useState } from 'react';
import { CheckCircle2, ShieldAlert, Cpu, Lock, Hammer, ShieldAlert as SlAlert, RefreshCw, BarChart2, Star, Sparkles, Layers } from 'lucide-react';
import { triggerSecOpsToast } from './ToastContainer';

interface LayerItem {
  num: string;
  name: string;
  desc: string;
  color: string;
  protocol: string;
  threatBlocked: string;
}

const detailedLayers: LayerItem[] = [
  { num: 'L1', name: 'Perimeter Defense', desc: 'Enterprise DDoS scrubbing networks, country-wide geo-blocking, and port configuration firewalls.', color: '#FF3B30', protocol: 'Web Guard Rules & BGP Routing', threatBlocked: 'Volumetric Floods & Bot Scans' },
  { num: 'L2', name: 'Network Security', desc: 'Secure tunneling, continuous DNS filtering, micro-segmented VLAN mappings, and port isolation.', color: '#EF9F27', protocol: 'DNS Security & TLS Handshaking', threatBlocked: 'Eavesdropping & MITM Intrusions' },
  { num: 'L3', name: 'Endpoint Protection', desc: 'Continuous dynamic process mapping on virtual and localized workstations to intercept memory bypasses.', color: '#00C853', protocol: 'Heuristic EDR Behavioral Scoring', threatBlocked: 'Polymorphic Malware & Ransomware' },
  { num: 'L4', name: 'Application Security', desc: 'Continuous Web Application Firewall parsing, SQL validation, and rate-limiting blocks on API pipelines.', color: '#4D8DFF', protocol: 'Real-time OWASP Top-10 Filtering', threatBlocked: 'XSS, SQLi & Broken Logins' },
  { num: 'L5', name: 'Identity & Access', desc: 'Adaptive multi-factor authentication (MFA) prompts, security key verification, and session timeout triggers.', color: '#7F77DD', protocol: 'SAML 2.0 & Cryptographic Keying', threatBlocked: 'Credential Stuffing & Brute Forces' },
  { num: 'L6', name: 'Data Security', desc: 'AES-256 data storage encryption, secure hash databases, DLP (Data Loss Prevention) monitors, and air-gapped backups.', color: '#0057FF', protocol: 'End-to-End Cryptography Logs', threatBlocked: 'Hostage Leaks & DB Exfiltrations' },
  { num: 'L7', name: 'Threat Intelligence', desc: 'Continuous crawls of underground darknet leakage forums to identify exposed assets.', color: '#14B8A6', protocol: 'IOC Vector Distribution Feeds', threatBlocked: 'Undetected Compromises & APT Attacks' },
];

export default function WhyUs({ isDark = true }: { isDark?: boolean }) {
  const [selectedLayer, setSelectedLayer] = useState<LayerItem | null>(detailedLayers[0]);
  
  // Interactive Score Auditor states
  const [hasMFA, setHasMFA] = useState(false);
  const [hasBackups, setHasBackups] = useState(false);
  const [hasPentest, setHasPentest] = useState(false);
  const [hasSOC, setHasSOC] = useState(false);

  const calculateAuditedScore = () => {
    let score = 42; // Base baseline score
    if (hasMFA) score += 15;
    if (hasBackups) score += 12;
    if (hasPentest) score += 14;
    if (hasSOC) score += 14;
    return score;
  };

  const handleAuditToggle = (field: string) => {
    if (field === 'mfa') {
      setHasMFA(!hasMFA);
      triggerSecOpsToast(`AUDITOR UPDATE\nMFA control: ${!hasMFA ? 'ENABLED' : 'DISABLED'}`, 'system');
    }
    if (field === 'backups') {
      setHasBackups(!hasBackups);
      triggerSecOpsToast(`AUDITOR UPDATE\nBackups control: ${!hasBackups ? 'ENABLED' : 'DISABLED'}`, 'system');
    }
    if (field === 'pentest') {
      setHasPentest(!hasPentest);
      triggerSecOpsToast(`AUDITOR UPDATE\nPentest control: ${!hasPentest ? 'ENABLED' : 'DISABLED'}`, 'system');
    }
    if (field === 'soc') {
      setHasSOC(!hasSOC);
      triggerSecOpsToast(`AUDITOR UPDATE\nSOC control: ${!hasSOC ? 'ENABLED' : 'DISABLED'}`, 'system');
    }
  };

  const currentScore = calculateAuditedScore();

  return (
    <section 
      id="why-us" 
      className="relative z-10 py-16 sm:py-24 select-none transition-colors duration-450"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="badge inline-flex items-center gap-1.5 mb-4">
            <Star size={11} className="#4D8DFF" />
            METHODOLOGICAL RESILIENCE
          </div>
          <h2 
            className="font-display font-black text-3xl sm:text-5xl tracking-tight mb-4"
            style={{ color: isDark ? '#ffffff' : '#050816' }}
          >
            Seven-Layer <span className="text-red-alert font-black">Preemptive Defense</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
            Eurosia Defender X designs multi-tier protection arrays. Review our framework layers below or audit your current defense status using our interactive operational calculator.
          </p>
        </div>

        {/* Outer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Interactive 7-Layer Stack */}
          <div className="lg:col-span-6 space-y-4 text-left">
            <h3 className="font-display font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: isDark ? 'white' : '#050816' }}>
              <Layers size={14} className="text-accent-blue" />
              SYSTEM SHIELD SECTOR STACK
            </h3>
            
            <div className="space-y-3">
              {detailedLayers.map((l) => {
                const isSelected = selectedLayer?.num === l.num;
                return (
                  <div 
                    key={l.num}
                    onClick={() => setSelectedLayer(l)}
                    className={`p-4 rounded-xl border flex items-center gap-4 transition-all duration-200 cursor-pointer ${
                      isSelected 
                        ? 'border-accent-blue bg-accent-blue/5' 
                        : 'border-white/5 bg-black/10 hover:border-white/15'
                    }`}
                    style={{
                      borderColor: isSelected ? l.color : isDark ? 'rgba(77,141,255,0.06)' : 'rgba(10,16,37,0.08)'
                    }}
                  >
                    {/* Layer Tag Badge */}
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-mono text-xs font-black"
                      style={{ 
                        background: `${l.color}15`, 
                        border: `1px solid ${l.color}40`,
                        color: l.color 
                      }}
                    >
                      {l.num}
                    </div>

                    {/* Central text elements */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-display font-bold text-xs" style={{ color: isDark ? 'white' : '#050816' }}>
                          {l.name}
                        </span>
                        <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest hidden sm:inline">
                          {l.threatBlocked}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-normal line-clamp-1">
                        {l.desc}
                      </p>
                    </div>

                    {/* Indicator status bar line */}
                    <div className="hidden sm:block w-12 h-1 rounded overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="h-full rounded" style={{ background: l.color, width: '85%' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Layer Specs deep-dive & Interactive Audit Panel */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Selected Layer Specs Output */}
            {selectedLayer && (
              <div 
                className="p-6 rounded-2xl border animate-fade-in relative overflow-hidden"
                style={{
                  borderColor: `${selectedLayer.color}40`,
                  backgroundColor: isDark ? 'rgba(10, 16, 37, 0.45)' : 'rgba(255, 255, 255, 0.9)',
                }}
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold" style={{ color: selectedLayer.color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: selectedLayer.color }} />
                    LAYER SECTOR EXPANSION DETAILS
                  </div>
                  <span className="font-mono text-[9px] text-gray-500 uppercase font-black">{selectedLayer.num}-VECTOR ACTIVE</span>
                </div>

                <h4 className="font-display font-black text-sm mb-2" style={{ color: isDark ? 'white' : '#050816' }}>
                  {selectedLayer.name} Architecture
                </h4>
                <p className="text-xs text-gray-400 font-sans leading-relaxed mb-4">
                  {selectedLayer.desc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 font-mono text-[10px]">
                  <div className="p-3 rounded bg-black/25 border border-white/5">
                    <span className="block text-accent-blue mb-1 font-extrabold uppercase text-[9px] tracking-wider">PROTOCOL DEPLOYMENT</span>
                    <span className="text-white font-bold">{selectedLayer.protocol}</span>
                  </div>
                  <div className="p-3 rounded bg-black/25 border border-white/5">
                    <span className="block text-red-alert mb-1 font-extrabold uppercase text-[9px] tracking-wider">CORE ADVERSARY BLOCKED</span>
                    <span className="text-red-alert font-bold">{selectedLayer.threatBlocked}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Score Auditor Interactive Playground Panel */}
            <div 
              className="p-6 rounded-2xl border relative overflow-hidden"
              style={{
                borderColor: isDark ? 'rgba(77, 141, 255, 0.2)' : 'rgba(10, 16, 37, 0.12)',
                backgroundColor: isDark ? 'rgba(10, 16, 37, 0.75)' : 'rgba(255, 255, 255, 0.95)'
              }}
            >
              <div className="flex items-center justify-between border-b border-dashed border-white/5 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <BarChart2 size={16} className="text-accent-blue animate-pulse" />
                  <div>
                    <h4 className="font-display font-black text-xs uppercase tracking-wide text-white" style={{ color: isDark ? 'white' : '#050816' }}>
                      SECURITY RESILIENCE CHECKLIST
                    </h4>
                    <p className="text-[9px] text-gray-500 font-mono">Simulate your business defensive power</p>
                  </div>
                </div>

                <span className="text-[9px] font-mono text-emerald-400 border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 rounded font-bold uppercase">
                  LOCAL REAL-TIME MODEL
                </span>
              </div>

              {/* Toggles Checklist */}
              <div className="space-y-3.5 mb-6 text-xs select-none">
                {[
                  { id: 'mfa', label: '2FA / Multi-Factor Authentication', desc: 'Secure passwords alone are vulnerable. MFA blocks 99% of bulk credential attacks.', status: hasMFA },
                  { id: 'backups', label: 'Continuous Air-Gapped Off-Site Backups', desc: 'Daily database encryption mirroring. Standard safeguards against active ransomware lockdowns.', status: hasBackups },
                  { id: 'pentest', label: 'Annual Professional VAPT Testing', desc: 'Active white-box code profiling and internal server network vulnerability penetration tests.', status: hasPentest },
                  { id: 'soc', label: '24/7/365 Sovereign SOC Monitoring', desc: 'Live event logging pipelines reviewed continuously by certified cyber intelligence analysts.', status: hasSOC },
                ].map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => handleAuditToggle(item.id)}
                    className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                      item.status 
                        ? 'bg-blue-primary/10 border-blue-primary/40' 
                        : 'bg-black/20 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <input 
                      type="checkbox"
                      checked={item.status}
                      readOnly
                      className="mt-0.5 accent-blue-primary cursor-pointer"
                    />
                    <div>
                      <span className="block font-display font-bold text-xs" style={{ color: isDark ? 'white' : '#050816' }}>{item.label}</span>
                      <p className="text-[10px] text-gray-500 leading-normal mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Projected score metric board */}
              <div className="p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/35 border-white/5">
                <div>
                  <h5 className="font-display font-black text-xs text-accent-blue uppercase tracking-wide mb-0.5">
                    ESTIMATED DEFENSIVE SCORE
                  </h5>
                  <p className="text-[10px] text-gray-500 font-sans max-w-[280px]">
                    {currentScore < 55 ? '🚨 Your organization risks critical breach exposures.' : currentScore < 85 ? '🛡️ Moderate defenses established. Additional protection required.' : '⚡ Optimized compliance sovereign. Fully protected.'}
                  </p>
                </div>

                <div className="flex items-baseline font-mono font-black" style={{ color: currentScore < 55 ? '#FF3B30' : currentScore < 85 ? '#EF9F27' : '#00C853' }}>
                  <span className="text-3xl sm:text-4xl">{currentScore}</span>
                  <span className="text-xs font-normal text-gray-500 pl-1">/ 100</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
