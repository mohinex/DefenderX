import React, { useEffect, useState } from 'react';
import { ArrowRight, ShieldAlert, Cpu, HeartPulse, HardDrive, ShieldCheck, Terminal, Disc, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerSecOpsToast } from './ToastContainer';

interface HeroProps {
  isDark: boolean;
  onLaunchConsole: () => void;
}

interface ThreatLog {
  id: string;
  timestamp: string;
  ip: string;
  target: string;
  attackType: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  action: string;
}

const targetSectors = [
  'Dhaka Finance Core',
  'Chattogram Port Terminal',
  'Sylhet Power Node L4',
  'Prime Bank SQL Gate',
  'Sovereign Govt DNS',
  'Eurosia Cloud Sandbox'
];

const attackProfiles = [
  { type: 'SYN FLOOD MITIGATED', severity: 'WARNING', action: 'IP RATELIMIT BLOCK' },
  { type: 'SQL INJECTION BLOCKED', severity: 'CRITICAL', action: 'INPUT_SAN_WAF_DROP' },
  { type: 'BRUTE FORCE TERMINATED', severity: 'CRITICAL', action: 'MFA_LOCK_ACCOUNT' },
  { type: 'SSH KNOCK INTERCEPT', severity: 'WARNING', action: 'PORT_TRIGGER_MUTE' },
  { type: 'DNS POISON DETECTED', severity: 'CRITICAL', action: 'ROUTING_DNSSEC_FLUSH' },
  { type: 'HEURISTIC TROJAN DROP', severity: 'WARNING', action: 'EDR_PROCESS_KILL' }
];

export default function Hero({ isDark, onLaunchConsole }: HeroProps) {
  const [quarantined, setQuarantined] = useState(1284890);
  const [latency, setLatency] = useState(2.38);
  const [activeThreatLogs, setActiveThreatLogs] = useState<ThreatLog[]>([]);

  // Simulation loop for latency fluctuation and threats dropping counter
  useEffect(() => {
    const interval = setInterval(() => {
      setQuarantined(prev => prev + Math.floor(Math.random() * 3) + 1);
      setLatency(prev => {
        const jitter = (Math.random() * 0.1 - 0.05);
        return parseFloat(Math.min(2.8, Math.max(1.9, prev + jitter)).toFixed(2));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Threat feed loop to add fresh simulated alerts for futuristic cyber look
  useEffect(() => {
    // Populate baseline logs first
    const items: ThreatLog[] = Array.from({ length: 4 }).map((_, i) => generateLog(i.toString()));
    setActiveThreatLogs(items);

    const logTimer = setInterval(() => {
      const nextId = Math.random().toString();
      const freshLog = generateLog(nextId);
      // Toast if critical
      if (freshLog.severity === 'CRITICAL' && Math.random() > 0.6) {
        triggerSecOpsToast(`INTRUSION VECTOR MITIGATED\nHost: ${freshLog.target}`, 'incoming');
      }
      setActiveThreatLogs(prev => [freshLog, ...prev.slice(0, 3)]);
    }, 4500);

    return () => clearInterval(logTimer);
  }, []);

  const generateLog = (id: string): ThreatLog => {
    const randomIp = `103.4.${Math.floor(Math.random() * 254)}.${Math.floor(Math.random() * 254)}`;
    const randomTarget = targetSectors[Math.floor(Math.random() * targetSectors.length)];
    const profile = attackProfiles[Math.floor(Math.random() * attackProfiles.length)];
    const dateStr = new Date().toISOString().slice(11, 19);

    return {
      id,
      timestamp: dateStr,
      ip: randomIp,
      target: randomTarget,
      attackType: profile.type,
      severity: profile.severity as any,
      action: profile.action
    };
  };

  return (
    <section 
      id="hero"
      className="relative z-10 w-full min-h-[calc(100vh-64px)] flex items-center justify-center py-12 md:py-16 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side Corporate Solution Details */}
        <div className="lg:col-span-6 flex flex-col justify-center text-left">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] tracking-[2.5px] font-mono border self-start font-black bg-red-alert/10 border-red-alert/30 text-red-alert mb-5"
          >
            <ShieldAlert size={11} className="animate-pulse" />
            E-GOV CIRT INTEL SYNCED // MULTI-BRIDGE ONLINE
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl font-black leading-none tracking-tight mb-6"
            style={{ color: isDark ? '#ffffff' : '#0a1025' }}
          >
            Autonomous <span className="text-red-alert font-black">Managed Detection</span> <br />
            &amp; Sovereign <span className="text-accent-blue font-black">Threat Hardening</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-xs sm:text-sm leading-relaxed max-w-[540px] mb-8"
            style={{ color: isDark ? '#B8C1D1' : '#4a5568' }}
          >
            Fortify your corporate architecture with Eurosia Defender X. We deploy localized SIEM pipelines, live threat correlation modules, and specialized on-ground intrusion management parameters aligned with BGD e-GOV CIRT classifications and ISO 27001 models.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4 mb-10 text-xs font-mono"
          >
            <button 
              onClick={onLaunchConsole}
              className="px-6 py-3.5 rounded-lg text-white font-bold tracking-widest bg-gradient-to-r from-red-alert via-[#0057FF] to-[#4D8DFF] cursor-pointer hover:shadow-lg hover:shadow-blue-primary/20 transition-all duration-200 flex items-center gap-2 border-none"
            >
              <span>CONNECT CORE CONSOLE</span>
              <ArrowRight size={13} strokeWidth={2} />
            </button>
            <a 
              href="#services"
              className="px-6 py-3.5 rounded-lg border font-bold tracking-widest text-center transition-all duration-200 cursor-pointer"
              style={{
                borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(10, 16, 37, 0.15)',
                backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'transparent',
                color: isDark ? '#ffffff' : '#050816'
              }}
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#services';
              }}
            >
              DISCOVER SERVICE MANUALS
            </a>
          </motion.div>

          {/* Interactive Statistics Tracker */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-3 gap-6 max-w-[480px] p-4 rounded-xl border border-dashed text-xs font-mono"
            style={{
              borderColor: isDark ? 'rgba(77, 141, 255, 0.18)' : 'rgba(10, 16, 37, 0.12)',
              backgroundColor: isDark ? 'rgba(10, 16, 37, 0.3)' : 'rgba(0,0,0,0.01)'
            }}
          >
            <div>
              <div className="text-[9px] text-gray-500 tracking-wider mb-1 font-bold uppercase">THREAT BLOCK COUNT</div>
              <div className="text-sm md:text-base font-black text-red-alert">
                {quarantined.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[9px] text-gray-500 tracking-wider mb-1 font-bold uppercase">AVERAGE LATENCY</div>
              <div className="text-sm md:text-base font-black text-accent-blue">
                {latency} ms
              </div>
            </div>
            <div>
              <div className="text-[9px] text-gray-500 tracking-wider mb-1 font-bold uppercase">SECURE NETWORK UP-TIME</div>
              <div className="text-sm md:text-base font-black text-[#00C853]">
                99.998% Active
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Side - Immersive Cyber Threat Feed Simulator */}
        <div className="lg:col-span-6 flex flex-col justify-center select-none w-full">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="p-5 sm:p-6 rounded-2xl border flex flex-col justify-between overflow-hidden relative backdrop-blur-md"
            style={{
              borderColor: isDark ? 'rgba(77, 141, 255, 0.2)' : 'rgba(10, 16, 37, 0.12)',
              backgroundColor: isDark ? 'rgba(10,16,37,0.75)' : 'rgba(255,255,255,0.9)'
            }}
          >
            {/* Command Line Header */}
            <div className="flex items-center justify-between border-b pb-3 mb-4" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)' }}>
              <div className="flex items-center gap-2">
                <Disc size={12} className="text-red-alert animate-spin" style={{ animationDuration: '4s' }} />
                <h4 className="font-display font-black text-xs uppercase tracking-widest text-[#4D8DFF] flex items-center gap-1.5 font-bold">
                  <Terminal size={12} className="text-accent-blue" />
                  REAL-TIME PORT DEFENSE MONITOR
                </h4>
              </div>
              <span className="font-mono text-[9px] text-green-500 font-bold border border-green-500/20 bg-green-500/10 px-2 py-0.5 rounded animate-pulse">
                SYS LIVE
              </span>
            </div>

            {/* Simulated Live Intrusion Event logs stream */}
            <div className="space-y-3 font-mono text-[10px] min-h-[190px]">
              <AnimatePresence initial={false}>
                {activeThreatLogs.map((log) => {
                  const isCritical = log.severity === 'CRITICAL';
                  return (
                    <motion.div 
                      key={log.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-2.5 rounded border border-white/5 bg-black/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-1 sm:gap-4 group hover:border-[#4D8DFF]/30 transition-all duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-[9px]">{log.timestamp}</span>
                        <span 
                          className={`px-1.5 py-0.5 rounded text-[8px] font-black ${
                            isCritical ? 'bg-red-alert/15 text-red-alert border border-red-alert/30' : 'bg-yellow-400/15 text-yellow-500 border border-yellow-400/30'
                          }`}
                        >
                          {isCritical ? 'CRIT' : 'WARN'}
                        </span>
                        <span className="text-white font-bold">{log.ip}</span>
                        <span className="text-[#4D8DFF] hidden sm:inline">&#8594;</span>
                        <span className="text-gray-400 font-sans truncate max-w-[130px] hidden sm:inline">{log.target}</span>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-2">
                        <span className="text-gray-300 font-extrabold uppercase text-[8px] tracking-wide bg-white/5 px-2 py-0.5 rounded">
                          {log.attackType}
                        </span>
                        
                        <span className="text-[#00C853] font-black text-[9px] uppercase tracking-wide border border-[#00C853]/20 bg-[#00C853]/5 px-2 py-0.5 rounded">
                          {log.action}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* System Status Metrics summary */}
            <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-gray-500 border-white/5 gap-2">
              <span className="flex items-center gap-1">
                <Activity size={10} className="text-accent-blue animate-pulse" />
                <span>INTELLIGENCE STREAM FEEDING FROM BANANI SOC HUB</span>
              </span>
              <span className="text-end text-neutral-400 font-bold">
                PACKETS PROCESSED: 29.8M /SEC
              </span>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}
