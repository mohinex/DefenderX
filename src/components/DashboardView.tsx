import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, ShieldCheck, Terminal as TerminalIcon, Cpu, 
  Wifi, HelpCircle, AlertTriangle, Play, RefreshCw, Send, 
  Lock, ArrowRight, CheckCircle2, Server, HelpCircle as HelpIcon, 
  Search, ShieldX, Key, LayoutGrid, Radio, User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThreatAlert, SecurityEventLog, FirewallRule, SecOpsStatus } from '../types';
import { securedFetch } from '../lib/api';
import { triggerSecOpsToast } from './ToastContainer';
import SeoDashboardView from './SeoDashboardView';
import ProfileView from './ProfileView';

interface DashboardViewProps {
  user: any;
  isDark: boolean;
  onLogout: () => void;
}

const INITIAL_ALERTS: ThreatAlert[] = [
  {
    id: 'AL-109',
    timestamp: '00:02:18 AGO',
    severity: 'critical',
    title: 'Distributed Denial of Service (DDoS) Raid',
    source: '185.190.140.23',
    status: 'active',
    description: 'High frequency volumetric SYN flood targeting Gateway-99 (Port 443). Traffic volume exceeding 14.2 Gbps.',
    category: 'DDOS'
  },
  {
    id: 'AL-108',
    timestamp: '00:14:45 AGO',
    severity: 'warning',
    title: 'Phishing Ransomware Variant Isolated',
    source: '10.0.12.89',
    status: 'investigating',
    description: 'Intelligent signature matching detected LockBit 3.0 attempt in accounting server segment. Decryption attempts blocked.',
    category: 'RANSOMWARE'
  },
  {
    id: 'AL-107',
    timestamp: '00:41:12 AGO',
    severity: 'info',
    title: 'Reconnaissance Port Scanning',
    source: '45.143.203.49',
    status: 'resolved',
    description: 'Sequential TCP port scan detected on Subnet C external routers. 1,024 ports scanned and packet drops initiated.',
    category: 'PORT_SCAN'
  },
  {
    id: 'AL-106',
    timestamp: '01:12:00 AGO',
    severity: 'warning',
    title: 'Brute-Force Attack Throttled',
    source: '213.255.45.109',
    status: 'resolved',
    description: 'Repeated unauthorized SSH access attempts on cluster terminal-77. IP blocked after 5 failed authentication phases.',
    category: 'INTRUSION'
  }
];

const INITIAL_FIREWALL_RULES: FirewallRule[] = [
  { id: '1', port: 22, service: 'SSH (Secure Command Shell)', status: 'monitored' },
  { id: '2', port: 80, service: 'HTTP (Standard Web Traffic)', status: 'open' },
  { id: '3', port: 443, service: 'HTTPS (Encrypted SSL Web)', status: 'monitored' },
  { id: '4', port: 3306, service: 'MySQL Enterprise Database', status: 'blocked' },
  { id: '5', port: 1433, service: 'MS-SQL Node Communication', status: 'blocked' }
];

export default function DashboardView({ user, isDark, onLogout }: DashboardViewProps) {
  // SecOps Tactical State Engine
  const [alerts, setAlerts] = useState<ThreatAlert[]>(INITIAL_ALERTS);
  const [firewall, setFirewall] = useState<FirewallRule[]>(INITIAL_FIREWALL_RULES);
  const [status, setStatus] = useState<SecOpsStatus>({
    globalThreatLevel: 'elevated',
    defenseMode: 'SHIELDED',
    activeThreatCount: 2,
    cpuLoad: 31,
    activeConnections: 1240,
    systemUptime: '04:12:31'
  });

  const [selectedAlert, setSelectedAlert] = useState<ThreatAlert | null>(INITIAL_ALERTS[0]);
  const [logs, setLogs] = useState<SecurityEventLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    `EUROSIA DEFENDER X [Version 12.4.991]`,
    `System initialization complete. Direct secure transceiver mapped.`,
    `Terminal established at: ${new Date().toISOString()}`,
    `Type 'help' to review operative command sets.`,
    `-----------------------------------------------------------------`
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  
  // Custom smart Copilot assistant configurations
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotChat, setCopilotChat] = useState<any[]>([
    {
      sender: 'copilot',
      text: `SecOps Intelligence Copilot active. Operator name: ${user.name}. Choose an incident alert or fire an inquiry inside the perimeter logic!`
    }
  ]);
  const [isCopilotTyping, setIsCopilotTyping] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [activeConsoleTab, setActiveConsoleTab] = useState<'secops' | 'seo' | 'profile'>(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    if (hash.includes('seo-settings')) return 'seo';
    if (hash.includes('profile')) return 'profile';
    return 'secops';
  });

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.includes('seo-settings')) {
        setActiveConsoleTab('seo');
      } else if (hash.includes('profile')) {
        setActiveConsoleTab('profile');
      } else if (hash.includes('admin') || hash.includes('dashboard')) {
        setActiveConsoleTab('secops');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const changeTab = (tab: 'secops' | 'seo' | 'profile') => {
    setActiveConsoleTab(tab);
    if (tab === 'seo') {
      window.location.hash = '#seo-settings';
    } else if (tab === 'profile') {
      window.location.hash = '#profile';
    } else {
      window.location.hash = '#admin';
    }
  };

  const fetchUsers = async () => {
    try {
      const p = await securedFetch('/api/v1/users');
      if (p && p.users) {
        setUsers(p.users);
      }
    } catch (e) {
      console.error("Failed to query operator directory:", e);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const p = await securedFetch('/api/v1/secops/audit-logs');
      if (p && p.auditLogs) {
        setAuditLogs(p.auditLogs);
      }
    } catch (e) {
      console.error("Failed to query audit trail database:", e);
    }
  };

  const handleUpdateRole = async (targetEmail: string, nextRole: string) => {
    try {
      const res = await securedFetch(`/api/v1/users/${targetEmail}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole })
      });
      if (res && res.success) {
        triggerSecOpsToast(`CLEARANCE RE-CODED: ${targetEmail} access set to ${nextRole.toUpperCase()}.`, 'system');
        await fetchUsers();
        await fetchAuditLogs();
      }
    } catch (err: any) {
      triggerSecOpsToast(err.message || 'Unauthorized override refused.', 'blocked');
    }
  };

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Synchronize state with backend on mount
  useEffect(() => {
    const handleFetchInitialState = async () => {
      try {
        setIsLoading(true);
        const alertsPayload = await securedFetch('/api/v1/secops/alerts');
        setAlerts(alertsPayload.alerts);
        
        if (alertsPayload.alerts && alertsPayload.alerts.length > 0) {
          setSelectedAlert(alertsPayload.alerts[0]);
        }

        setStatus(prev => ({
          ...prev,
          defenseMode: alertsPayload.defenseMode || 'SHIELDED',
          globalThreatLevel: alertsPayload.threatLevel || 'elevated',
          activeThreatCount: alertsPayload.alerts ? alertsPayload.alerts.filter((a: any) => a.status !== 'resolved').length : 2,
        }));

        const firewallPayload = await securedFetch('/api/v1/secops/firewall');
        setFirewall(firewallPayload.firewall);

        await fetchUsers();
        await fetchAuditLogs();

        const logsPayload = await securedFetch('/api/v1/secops/logs');
        if (logsPayload.logs && logsPayload.logs.length > 0) {
          setLogs(logsPayload.logs);
          const formatted = logsPayload.logs.map((l: any) => `[${l.timestamp}] [${(l.type || "system").toUpperCase()}] Sourced from [${l.source}]: ${l.logtext}`);
          setTerminalHistory(prev => [...prev, ...formatted].slice(-100));
        } else {
          // If logs are empty, initialize logs endpoint with default entries
          const starterLogs = [
            { source: 'ADMIN_ROUTER', logtext: 'SecOps Core direct transceiver channel authenticated successfully.', type: 'system' as const },
            { source: '185.190.140.23', logtext: 'SYNDROP Filter flagged volume attack exceeding threshold.', type: 'incoming' as const },
            { source: '10.0.12.89', logtext: 'LockBit signatures caught in Isolated Virtual Subnet B.', type: 'blocked' as const },
            { source: 'MS-SQL-03', logtext: 'Database port 1433 state forced to SECURE BYPASS BLOCK by default policy.', type: 'system' as const }
          ];
          for (const s of starterLogs) {
            await securedFetch('/api/v1/secops/logs', {
              method: 'POST',
              body: JSON.stringify(s)
            });
          }
          const refetched = await securedFetch('/api/v1/secops/logs');
          setLogs(refetched.logs);
        }
      } catch (e) {
        console.error("Payload initialization error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    handleFetchInitialState();
  }, []);

  // Fluctuating metric simulator
  useEffect(() => {
    const metricInterval = setInterval(() => {
      setStatus(prev => {
        const jitterConn = Math.floor(Math.random() * 11) - 5;
        const jitterCpu = Math.floor(Math.random() * 5) - 2;
        return {
          ...prev,
          activeConnections: Math.max(900, prev.activeConnections + jitterConn),
          cpuLoad: Math.min(99, Math.max(12, prev.cpuLoad + jitterCpu))
        };
      });
      
      // Random server notification events appearing in terminal
      const randomSources = ['87.251.45.12', '109.213.9.112', '45.12.89.54', '192.168.1.109'];
      const randomMsg = [
        'Secure transceiver socket heartbeat acknowledged',
        'Incoming packet drop: TCP SYN request malformed',
        'External telemetry check successfully bypassed',
        'Intrinsically isolated sandboxed VM state analyzed green'
      ];
      const source = randomSources[Math.floor(Math.random() * randomSources.length)];
      const msg = randomMsg[Math.floor(Math.random() * randomMsg.length)];
      
      addLogEntry(source, msg, 'system');
    }, 5000);

    return () => clearInterval(metricInterval);
  }, []);

  const addLogEntry = async (source: string, text: string, type: 'incoming' | 'blocked' | 'resolved' | 'system') => {
    const timestamp = new Date().toISOString().substring(11, 19);
    const newLog: SecurityEventLog = {
      id: Math.random().toString(),
      timestamp,
      source,
      logtext: text,
      type
    };
    
    setLogs(prev => [newLog, ...prev].slice(0, 40));
    setTerminalHistory(prev => [
      ...prev,
      `[${timestamp}] [${type.toUpperCase()}] Sourced from [${source}]: ${text}`
    ]);

    try {
      await securedFetch('/api/v1/secops/logs', {
        method: 'POST',
        body: JSON.stringify({ source, logtext: text, type })
      });
    } catch(e) {}
  };

  // Scroll to bottom of operative logs terminal
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory]);

  // Firewall interactive control mechanism
  const toggleFirewallPort = async (id: string, port: number, service: string, currentStatus: string) => {
    if (user.role !== 'admin') {
      triggerSecOpsToast('ACCESS DENIED\nL9 administrative clearance required to alter firewall port configurations.', 'blocked');
      return;
    }

    try {
      const result = await securedFetch(`/api/v1/secops/firewall/${id}`, {
        method: 'PATCH'
      });
      if (result.success && result.rule) {
        const nextStatus = result.rule.status;
        setFirewall(prev => prev.map(f => f.id === id ? { ...f, status: nextStatus } : f));
        
        triggerSecOpsToast(`FIREWALL RECONFIGURED\nPort ${port} operational parameters shifted to ${nextStatus.toUpperCase()}`, nextStatus === 'blocked' ? 'blocked' : 'resolved');

        // Reload other tables to maintain global posture consistency
        const alertsPayload = await securedFetch('/api/v1/secops/alerts');
        setAlerts(alertsPayload.alerts);
        const logsPayload = await securedFetch('/api/v1/secops/logs');
        setLogs(logsPayload.logs);
        await fetchAuditLogs();
      }
    } catch (e: any) {
      triggerSecOpsToast(`FIREWALL RECONFIGURATION BLOCKED\n${e.message || "Failed to edit firewall laws."}`, "blocked");
    }
  };

  // Global lockdown level toggle of posture
  const triggerDefenseLockdown = async (mode: 'STANDARD' | 'SHIELDED' | 'HIGH_INTENSITY_LOCKDOWN') => {
    if (user.role !== 'admin') {
      triggerSecOpsToast('ACCESS SUSPENDED\nAnalyst credentials do not hold shield override clearance.', 'blocked');
      return;
    }
    
    try {
      const result = await securedFetch('/api/v1/secops/posture', {
        method: 'POST',
        body: JSON.stringify({ mode })
      });
      if (result.success && result.posture) {
        setStatus(prev => ({
          ...prev,
          defenseMode: result.posture.defenseMode,
          globalThreatLevel: result.posture.globalThreatLevel
        }));

        triggerSecOpsToast(`DEFENSE CHANNELS UPDATED\nOperational Posture turned fully to ${mode}.`, mode === 'HIGH_INTENSITY_LOCKDOWN' ? 'blocked' : 'resolved');

        // Refetch tables to synchronize security metrics database-wide
        const alertsPayload = await securedFetch('/api/v1/secops/alerts');
        setAlerts(alertsPayload.alerts);
        const firewallPayload = await securedFetch('/api/v1/secops/firewall');
        setFirewall(firewallPayload.firewall);
        const logsPayload = await securedFetch('/api/v1/secops/logs');
        setLogs(logsPayload.logs);
        await fetchAuditLogs();
      }
    } catch (e: any) {
      triggerSecOpsToast(`POSTURE REFUSED\nHandshake failed: ${e.message}`, 'blocked');
    }
  };

  // Incident list actions
  const resolveIncident = async (id: string) => {
    if (user.role === 'readonly') {
      triggerSecOpsToast('ACCESS DENIED\nRead-Only accounts cannot execute threat containment actions.', 'blocked');
      return;
    }

    try {
      const result = await securedFetch(`/api/v1/secops/alerts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'resolved' })
      });
      if (result.success && result.alert) {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved' } : a));
        if (selectedAlert && selectedAlert.id === id) {
          setSelectedAlert(prev => prev ? { ...prev, status: 'resolved' } : null);
        }
        triggerSecOpsToast(`THREAT ISOLATED & RECORD CLOSED\nAlert ${id} designated quarantine complete`, 'resolved');
        const logsPayload = await securedFetch('/api/v1/secops/logs');
        setLogs(logsPayload.logs);
        await fetchAuditLogs();
      }
    } catch (e: any) {
      triggerSecOpsToast(`CONTAIN COMMAND REJECTED\nAPI Connection failed: ${e.message}`, 'blocked');
    }
  };

  const investigateIncident = async (id: string) => {
    if (user.role === 'readonly') {
      triggerSecOpsToast('ACCESS DENIED\nRead-Only accounts cannot initiate threat trace investigations.', 'blocked');
      return;
    }

    try {
      const result = await securedFetch(`/api/v1/secops/alerts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'investigating' })
      });
      if (result.success && result.alert) {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'investigating' } : a));
        if (selectedAlert && selectedAlert.id === id) {
          setSelectedAlert(prev => prev ? { ...prev, status: 'investigating' } : null);
        }
        triggerSecOpsToast(`TRACE INITIATED\nThreat ${id} packet flows rerouted into sandbox VM`, 'incoming');
        const logsPayload = await securedFetch('/api/v1/secops/logs');
        setLogs(logsPayload.logs);
        await fetchAuditLogs();
      }
    } catch (e: any) {
      triggerSecOpsToast(`TRACE ACTION FAILED\nAPI Connection blocked: ${e.message}`, 'blocked');
    }
  };

  // AI Copilot Smart advisory analysis triggering preset profiles or user prompt
  const analyzeThreatWithAI = async (category: string) => {
    setIsCopilotTyping(true);
    
    try {
      setCopilotChat(prev => [
        ...prev,
        { sender: 'user', text: `Execute smart scanning analysis of category: ${category}` }
      ]);

      const activeObj = alerts.find(a => a.category === category) || selectedAlert;

      const result = await securedFetch('/api/v1/copilot/chat', {
        method: 'POST',
        body: JSON.stringify({
          query: `Analyze active threat category: ${category}`,
          alertContext: activeObj
        })
      });

      setCopilotChat(prev => [
        ...prev,
        { sender: 'copilot', text: result.text }
      ]);
    } catch (e: any) {
      setCopilotChat(prev => [
        ...prev,
        { sender: 'copilot', text: `SECURITY COMPILER OVERHEAT: Connecting copilot server failed. Reason: ${e.message || "Intermittent network block"}` }
      ]);
    } finally {
      setIsCopilotTyping(false);
    }
  };

  // Human shell commands parsing
  const executeTerminalCmd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toLowerCase();
    const args = cmd.split(' ');
    const primary = args[0];

    let output = '';

    switch(primary) {
      case 'help':
        output = `OPERATIONAL TERM COMMANDS:
 • clear            Clears terminal scroll lines
 • scan             Initiates automated defensive sub-net audit
 • lockdown         Instantly triggers HIGH_INTENSITY_LOCKDOWN posture
 • shields          Resets defensive grids to SHIELDED posture
 • firewall         Displays active port configurations status
 • status           Prints current SecOps active operational telemetry
 • whoami           Displays logged operator identity diagnostics`;
        break;
      case 'clear':
        setTerminalInput('');
        setTerminalHistory([]);
        return;
      case 'whoami':
        output = `LOGGED OPERATOR: ${user.name} | SPECIALIST ROLE: ${user.role.toUpperCase()} | DIRECT TUNNEL IP: 127.0.0.1 (SECURE LOOPBACK)`;
        break;
      case 'lockdown':
        if (user.role !== 'admin') {
          output = 'ACCESS LOG FAILURE: Administration clearance required to execute LOCKDOWN command.';
        } else {
          triggerDefenseLockdown('HIGH_INTENSITY_LOCKDOWN');
          output = 'SUCCESS: Global lockdown protocol successfully initiated page-wide!';
        }
        break;
      case 'shields':
        if (user.role !== 'admin') {
          output = 'ACCESS LOG FAILURE: Administration clearance required to change postures.';
        } else {
          triggerDefenseLockdown('SHIELDED');
          output = 'SUCCESS: Global defense configuration set to: SHIELDED.';
        }
        break;
      case 'scan':
        output = 'PERIMETER DIAGNOSTICS: Initiated network scanner analysis... All subnets verified secure. Zero active vulnerabilities exposed on internal ports.';
        break;
      case 'firewall':
        output = `ACTIVE CONTROLS REPORT:\n` + firewall.map(f => `  • Port ${f.port} (${f.service}): [${f.status.toUpperCase()}]`).join('\n');
        break;
      case 'status':
        output = `SECOPS PERIMETER METRICS:
  Global Alert State: [${status.globalThreatLevel.toUpperCase()}]
  Shield configuration: [${status.defenseMode}]
  Active Connection Tunnels: ${status.activeConnections} sockets
  Core Engine CPU Overhead: ${status.cpuLoad}%`;
        break;
      default:
        output = `COMMAND LOGOUT: Command '${primary}' unrecognized in transceiver lexicon. Type 'help' for support.`;
    }

    setTerminalHistory(prev => [
      ...prev,
      `> ${terminalInput}`,
      output,
      `-----------------------------------------------------------------`
    ]);
    setTerminalInput('');
  };

  // Copilot text box processing
  const handleCopilotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim()) return;

    const query = copilotInput.trim();
    setCopilotChat(prev => [...prev, { sender: 'user', text: query }]);
    setCopilotInput('');
    setIsCopilotTyping(true);

    try {
      const result = await securedFetch('/api/v1/copilot/chat', {
        method: 'POST',
        body: JSON.stringify({
          query,
          alertContext: selectedAlert
        })
      });

      setCopilotChat(prev => [...prev, { sender: 'copilot', text: result.text }]);
    } catch (e: any) {
      setCopilotChat(prev => [
        ...prev,
        { sender: 'copilot', text: `SecOps Copilot Error: Failed to query central intelligence: ${e.message || "Endpoint timeout"}` }
      ]);
    } finally {
      setIsCopilotTyping(false);
    }
  };

  return (
    <div className="relative z-10 w-full min-h-[calc(100vh-42px-72px)] p-4 sm:p-6 lg:p-8 flex flex-col gap-6 select-none font-sans transition-colors duration-500">
      
      {/* TACTICAL STATUS RIBBON HEADERS */}
      <div 
        className="grid grid-cols-2 lg:grid-cols-6 gap-4 border p-4 rounded-xl backdrop-blur-md select-none transition-all duration-300 shadow-md"
        style={{
          borderColor: isDark ? 'rgba(77, 141, 255, 0.18)' : 'rgba(10, 16, 37, 0.12)',
          backgroundColor: isDark ? 'rgba(10, 16, 37, 0.85)' : 'rgba(232, 236, 245, 0.9)'
        }}
      >
        {/* Status Item 1: Threat status */}
        <div className="flex items-center gap-3 border-r pr-2 col-span-1 border-dashed justify-center lg:justify-start" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
          <div className={`p-2.5 rounded-lg ${status.defenseMode === 'HIGH_INTENSITY_LOCKDOWN' ? 'bg-red-alert/20 text-red-alert' : 'bg-amber-500/10 text-amber-500'}`}>
            <AlertTriangle className={status.defenseMode === 'HIGH_INTENSITY_LOCKDOWN' ? 'animate-pulse' : ''} size={18} />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-mono tracking-widest font-bold">THREAT LEVEL</div>
            <div className={`text-sm font-display font-black tracking-wide uppercase ${status.defenseMode === 'HIGH_INTENSITY_LOCKDOWN' ? 'text-red-alert' : 'text-amber-500'}`}>
              {status.globalThreatLevel}
            </div>
          </div>
        </div>

        {/* Status Item 2: Active Shields */}
        <div className="flex items-center gap-3 border-r pr-2 col-span-1 border-dashed justify-center lg:justify-start" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
          <div className="p-2.5 rounded-lg bg-green-alert/15 text-green-alert">
            <ShieldCheck size={18} />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-mono tracking-widest font-bold">DEFENSE STATE</div>
            <div className="text-sm font-display font-black text-green-alert tracking-wide">
              {status.defenseMode === 'STANDARD' ? 'STANDARD' : status.defenseMode === 'SHIELDED' ? 'SHIELDED' : 'LOCKDOWN'}
            </div>
          </div>
        </div>

        {/* Status Item 3: Active connection socket counts */}
        <div className="flex items-center gap-3 border-r pr-2 col-span-1 border-dashed justify-center lg:justify-start" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
          <div className="p-2.5 rounded-lg bg-blue-primary/15 text-accent-blue">
            <Wifi size={18} />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-mono tracking-widest font-bold">TUNNELS ACTIVE</div>
            <div className="text-sm font-mono font-black text-accent-blue font-bold">
              {status.activeConnections} IP
            </div>
          </div>
        </div>

        {/* Status Item 4: Processing cores */}
        <div className="flex items-center gap-3 border-r pr-2 col-span-1 border-dashed justify-center lg:justify-start" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
          <div className="p-2.5 rounded-lg bg-indigo-500/15 text-indigo-400">
            <Cpu size={18} />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-mono tracking-widest font-bold">CPU LOAD</div>
            <div className="text-sm font-mono font-black text-indigo-400">
              {status.cpuLoad}%
            </div>
          </div>
        </div>

        {/* Status Item 5: Active triggers catalog */}
        <div className="flex items-center gap-3 border-r pr-2 col-span-1 border-dashed justify-center lg:justify-start" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
          <div className="p-2.5 rounded-lg bg-red-alert/10 text-red-alert">
            <ShieldAlert size={18} />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-mono tracking-widest font-bold">ACTIVE INCIDENTS</div>
            <div className="text-sm font-display font-black text-red-alert font-bold">
              {alerts.filter(a => a.status !== 'resolved').length} ALERTS
            </div>
          </div>
        </div>

        {/* Status Item 6: Posture Controller Override actions */}
        <div className="col-span-2 lg:col-span-1 flex flex-col justify-center gap-1.5 pl-2">
          <div className="text-[9px] text-gray-400 font-mono tracking-wider font-extrabold text-center lg:text-left">DEFENSE OVERRIDES</div>
          <div className="flex gap-1.5 justify-center lg:justify-start">
            <button 
              onClick={() => triggerDefenseLockdown('STANDARD')}
              title="Standard Threat Configuration Mode"
              className={`text-[9px] font-mono font-bold px-2 py-1 rounded transition-all cursor-pointer ${status.defenseMode === 'STANDARD' ? 'bg-[#ff7b73] text-dark' : 'bg-black/25 text-gray-400'}`}
            >
              STD
            </button>
            <button 
              onClick={() => triggerDefenseLockdown('SHIELDED')}
              title="Engage Shielded Defensive Barriers"
              className={`text-[9px] font-mono font-bold px-2 py-1 rounded transition-all cursor-pointer ${status.defenseMode === 'SHIELDED' ? 'bg-accent-blue text-dark font-black' : 'bg-black/25 text-gray-400'}`}
            >
              SHIELD
            </button>
            <button 
              onClick={() => triggerDefenseLockdown('HIGH_INTENSITY_LOCKDOWN')}
              title="EMERGENCY OVERRIDE LOCKDOWN STATE"
              className={`text-[9px] font-mono font-bold px-2 py-1 rounded transition-all cursor-pointer ${status.defenseMode === 'HIGH_INTENSITY_LOCKDOWN' ? 'bg-red-alert text-white font-black animate-pulse' : 'bg-black/25 text-red-alert/60'}`}
            >
              LOCKDOWN
            </button>
          </div>
        </div>
      </div>

      {/* CONSOLE NAVIGATION TABS WITH NEON METADATA FOCUS */}
      <div 
        className="flex flex-wrap gap-2 border-b pb-1 relative z-20" 
        style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}
      >
        <button
          onClick={() => changeTab('secops')}
          className={`px-5 py-2.5 font-display text-[11px] font-black tracking-wider rounded-lg transition-all duration-300 flex items-center gap-2 border cursor-pointer ${
            activeConsoleTab === 'secops'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border-indigo-500'
              : isDark 
              ? 'bg-black/20 hover:bg-black/40 text-gray-400 border-white/5 hover:text-white'
              : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
          }`}
        >
          <Radio size={13} className={activeConsoleTab === 'secops' ? 'animate-pulse text-green-alert' : ''} />
          SECOPS SYSTEM COMMAND CORE
        </button>
        <button
          onClick={() => changeTab('seo')}
          className={`px-5 py-2.5 font-display text-[11px] font-black tracking-wider rounded-lg transition-all duration-300 flex items-center gap-2 border cursor-pointer ${
            activeConsoleTab === 'seo'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border-indigo-500'
              : isDark
              ? 'bg-black/20 hover:bg-black/40 text-gray-400 border-white/5 hover:text-white'
              : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
          }`}
        >
          <Search size={13} className={activeConsoleTab === 'seo' ? 'animate-spin' : ''} style={{ animationDuration: '4s' }} />
          ENTERPRISE SEO CONTROL & OPTIMIZATION PANEL
        </button>
        <button
          onClick={() => changeTab('profile')}
          className={`px-5 py-2.5 font-display text-[11px] font-black tracking-wider rounded-lg transition-all duration-300 flex items-center gap-2 border cursor-pointer ${
            activeConsoleTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border-indigo-500'
              : isDark
              ? 'bg-black/20 hover:bg-black/40 text-gray-400 border-white/5 hover:text-white'
              : 'bg-white hover:bg-gray-50 text-gray-600 border-gray-200'
          }`}
        >
          <UserIcon size={13} className={activeConsoleTab === 'profile' ? 'animate-pulse text-amber-400' : ''} />
          OPERATOR SECURE PROFILE CERTIFICATE
        </button>
      </div>

      {activeConsoleTab === 'seo' ? (
        <SeoDashboardView isDark={isDark} user={user} />
      ) : activeConsoleTab === 'profile' ? (
        <ProfileView isDark={isDark} user={user} onUpdateSuccess={(updatedUser) => {
          if (updatedUser) {
            Object.assign(user, updatedUser);
          }
        }} />
      ) : (
        <>
          {/* CORE CONTROL GRID: LEFT AND RIGHT SEGMENTS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none">
        
        {/* LEFT COLUMN: ACTIVE THREAT ALERTS AND FIREWALL RULES CONTROLS (7/12 width) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* SECURE THREAT LOGGER BOX */}
          <div 
            className="border rounded-xl p-5 backdrop-blur-md select-none transition-all duration-300 flex flex-col text-xs"
            style={{
              borderColor: isDark ? 'rgba(77, 141, 255, 0.18)' : 'rgba(10, 16, 37, 0.12)',
              backgroundColor: isDark ? 'rgba(10, 16, 37, 0.85)' : 'rgba(255, 255, 255, 0.8)'
            }}
          >
            <div className="flex justify-between items-center border-b pb-3 mb-4" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="text-red-alert animate-pulse" size={18} />
                <span className="font-display font-black text-sm tracking-tight">REAL-TIME INCIDENT MONITOR FEED</span>
              </div>
              <span className="font-mono text-[9px] tracking-widest text-accent-blue bg-blue-primary/10 px-2 py-0.5 rounded font-bold">
                AUTO_RELOADING ACTIVE
              </span>
            </div>

            {/* List of active alerts */}
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div 
                      key={i} 
                      className="border rounded-lg p-3.5 flex items-center justify-between animate-pulse"
                      style={{
                        borderColor: isDark ? 'rgba(77, 141, 255, 0.08)' : 'rgba(10, 16, 37, 0.06)',
                        backgroundColor: isDark ? 'rgba(10, 16, 37, 0.3)' : 'rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-center bg-transparent">
                          <div className="h-2 w-24 bg-gray-600 rounded opacity-50" />
                          <div className="h-3 w-12 bg-gray-600 rounded opacity-60" />
                        </div>
                        <div className="h-3.5 w-3/4 bg-gray-500 rounded opacity-60" />
                        <div className="h-2 w-1/2 bg-gray-600 rounded opacity-40 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                alerts.map(alert => (
                  <div 
                    key={alert.id}
                    onClick={() => setSelectedAlert(alert)}
                    className={`border rounded-lg p-3.5 transition-all duration-200 cursor-pointer flex items-start gap-3 relative ${
                      selectedAlert?.id === alert.id 
                        ? 'border-accent-blue bg-blue-primary/5 shadow-inner' 
                        : 'hover:bg-blue-primary/5'
                    }`}
                    style={{
                      borderColor: selectedAlert?.id === alert.id 
                        ? 'var(--color-accent-blue)' 
                        : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'
                    }}
                  >
                    {/* Left indicator accent color */}
                    <div className={`absolute top-0 bottom-0 left-0 w-1 rounded-l-lg ${
                      alert.severity === 'critical' ? 'bg-red-alert' : alert.severity === 'warning' ? 'bg-amber-500' : 'bg-accent-blue'
                    }`} />

                    {/* Status Indicator check */}
                    <div className="mt-0.5 flex-shrink-0">
                      {alert.status === 'resolved' ? (
                        <CheckCircle2 size={16} className="text-green-alert" />
                      ) : (
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          alert.severity === 'critical' ? 'bg-red-alert animate-ping' : 'bg-amber-500 animate-pulse'
                        }`} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono text-[9px] tracking-wider text-gray-400 font-extrabold">
                          {alert.id} // {alert.timestamp}
                        </span>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          alert.status === 'resolved' ? 'bg-green-alert/15 text-green-alert' : 'bg-red-alert/15 text-red-alert'
                        }`}>
                          {alert.status}
                        </span>
                      </div>
                      <div className="font-display font-extrabold text-[12px] mb-1 leading-snug">
                        {alert.title}
                      </div>
                      <div className="text-[10px] text-gray-500 flex items-center gap-2">
                        <span>Source IP: <strong className="font-mono text-[11px] font-black">{alert.source}</strong></span>
                        <span>•</span>
                        <span>Category: <strong className="font-mono text-accent-blue">{alert.category}</strong></span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Selected Threat Actions details sandbox */}
            {selectedAlert && (
              <div 
                className="mt-4 p-4 rounded-lg border flex flex-col gap-2.5 animate-fadeIn"
                style={{
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)',
                  backgroundColor: isDark ? 'rgba(5, 8, 22, 0.4)' : 'rgba(0,0,0,0.02)'
                }}
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-display font-black text-xs uppercase text-accent-blue tracking-wide mb-0.5">
                      ACTIVE INCIDENT DETAILS
                    </h4>
                    <div className="font-display font-bold leading-tight">
                      {selectedAlert.title} ({selectedAlert.id})
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {selectedAlert.status !== 'resolved' && (
                      <>
                        <button 
                          onClick={() => investigateIncident(selectedAlert.id)}
                          className="px-2.5 py-1 rounded bg-[#0057FF]/15 text-accent-blue font-mono font-bold tracking-wider hover:bg-[#0057FF]/25 cursor-pointer text-[10px]"
                        >
                          TRACE
                        </button>
                        <button 
                          onClick={() => resolveIncident(selectedAlert.id)}
                          className="px-2.5 py-1 rounded bg-green-alert/15 text-green-alert font-mono font-bold tracking-wider hover:bg-green-alert/25 cursor-pointer text-[10px]"
                        >
                          CONTAIN
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => analyzeThreatWithAI(selectedAlert.category)}
                      className="px-2.5 py-1 rounded bg-indigo-500/15 text-indigo-300 font-mono font-extrabold tracking-wider hover:bg-indigo-500/25 cursor-pointer text-[10px]"
                    >
                      COPILOT SCAN
                    </button>
                  </div>
                </div>
                <p className="text-gray-500 leading-normal font-sans text-[11px]">
                  {selectedAlert.description}
                </p>
              </div>
            )}
          </div>

          {/* FIREWALL DEPLOYED ACCESS RULES */}
          <div 
            className="border rounded-xl p-5 backdrop-blur-md select-none transition-all duration-300 text-xs"
            style={{
              borderColor: isDark ? 'rgba(77, 141, 255, 0.18)' : 'rgba(10, 16, 37, 0.12)',
              backgroundColor: isDark ? 'rgba(10, 16, 37, 0.85)' : 'rgba(255, 255, 255, 0.8)'
            }}
          >
            <div className="flex justify-between items-center border-b pb-3 mb-4" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2.5">
                <Lock className="text-accent-blue" size={18} />
                <span className="font-display font-black text-sm tracking-tight">ACTIVE NETWORK FIREWALL ROUTING LAWS</span>
              </div>
              <span className="font-mono text-[9px] text-gray-500 font-extrabold uppercase">
                OPERATIONAL OVERRIDES
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="border rounded-lg p-3.5 flex justify-between items-center animate-pulse"
                    style={{
                      borderColor: isDark ? 'rgba(77, 141, 255, 0.08)' : 'rgba(10, 16, 37, 0.06)',
                      backgroundColor: isDark ? 'rgba(10, 16, 37, 0.3)' : 'rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    <div className="space-y-2 flex-1 mr-3">
                      <div className="h-3 w-1/3 bg-gray-600 rounded opacity-50" />
                      <div className="h-2 w-3/4 bg-gray-500 rounded opacity-65" />
                    </div>
                    <div className="h-7 w-16 bg-gray-650 rounded opacity-45" />
                  </div>
                ))
              ) : (
                firewall.map(rule => (
                  <div 
                    key={rule.id}
                    className="border rounded-lg p-3.5 flex justify-between items-center transition-colors hover:bg-blue-primary/5"
                    style={{
                      borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'
                    }}
                  >
                    <div>
                      <div className="font-mono text-xs font-black tracking-wide text-white">
                        PORT {rule.port} <span className="text-[10px] text-gray-400 font-normal">({rule.service.split(' ')[0]})</span>
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1">
                        {rule.service}
                      </div>
                    </div>
                    
                    {/* Action Override toggle */}
                    <button
                      onClick={() => toggleFirewallPort(rule.id, rule.port, rule.service, rule.status)}
                      className={`px-3 py-1.5 rounded text-[10px] font-mono tracking-widest font-extrabold cursor-pointer transition-all duration-200 outline-none ${
                        rule.status === 'blocked' 
                          ? 'bg-red-alert/20 text-red-alert border border-red-alert/40' 
                          : rule.status === 'open' 
                          ? 'bg-green-alert/15 text-green-alert border border-green-alert/30' 
                          : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/35'
                      }`}
                    >
                      {rule.status.toUpperCase()}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RADAR PERIMETER SCAN AND AI COPILOT INTERACTIVE (5/12 width) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* SECURE NETWORK DIAGNOSTICS RADAR */}
          <div 
            className="border rounded-xl p-5 backdrop-blur-md select-none transition-all duration-300 flex flex-col items-center"
            style={{
              borderColor: isDark ? 'rgba(77, 141, 255, 0.18)' : 'rgba(10, 16, 37, 0.12)',
              backgroundColor: isDark ? 'rgba(10, 16, 37, 0.85)' : 'rgba(255, 255, 255, 0.8)'
            }}
          >
            <div className="w-full flex items-center gap-2 border-b pb-3 mb-4" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
              <Radio className="text-[#00C853] animate-pulse-fast" size={18} />
              <span className="font-display font-black text-xs tracking-tight">SECURE RADAR ANTENNA TRANSCEIVER METRICS</span>
            </div>

            {/* Custom interactive Radar scanner graphic */}
            <div className="relative w-56 h-56 rounded-full border border-green-alert/20 bg-dark/70 flex items-center justify-center overflow-hidden">
              
              {/* Spinning grid radar arm */}
              <div className="absolute inset-0 border border-green-alert/10 rounded-full scale-75" />
              <div className="absolute inset-0 border border-green-alert/10 rounded-full scale-50" />
              <div className="absolute inset-0 border border-green-alert/10 rounded-full scale-25" />
              
              {/* Radar Sweeper Arm */}
              <div className="absolute inset-0 bg-gradient-to-tr from-green-alert/15 via-transparent to-transparent animate-radar-sweep origin-center rounded-full" />
              
              {/* Target anomalous nodes flashing */}
              <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-red-alert rounded-full animate-ping" />
              <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-red-alert rounded-full" />
              <span className="absolute top-1/4 left-1/3 mt-2 text-[8px] font-mono text-red-alert font-bold">ANOMALY // GW-99</span>

              <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-green-alert rounded-full" />
              <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-green-alert rounded-full animate-pulse-fast" />

              <div className="absolute top-2/3 left-1/5 w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />

              {/* Crosshair grids */}
              <div className="absolute w-full h-[1px] bg-green-alert/10" />
              <div className="absolute h-full w-[1px] bg-green-alert/10" />

              <div className="z-10 font-mono text-[9px] text-[#00C853] tracking-widest font-black uppercase">
                RADAR ONLINE
              </div>
            </div>

            <div className="w-full mt-4 flex justify-between text-[10px] font-mono text-gray-400">
              <span>SCANNER FREQ: <strong className="text-[#00C853]">992.4 MHz</strong></span>
              <span>AZIMUTH ERROR: <strong className="text-[#00C853]">0.00%</strong></span>
            </div>
          </div>

          {/* SECURE AI THREAT COPILOT */}
          <div 
            className="border rounded-xl p-5 backdrop-blur-md select-none transition-all duration-300 flex-1 flex flex-col h-[320px] max-h-[350px] text-xs"
            style={{
              borderColor: isDark ? 'rgba(77, 141, 255, 0.18)' : 'rgba(10, 16, 37, 0.12)',
              backgroundColor: isDark ? 'rgba(10, 16, 37, 0.85)' : 'rgba(255, 255, 255, 0.8)'
            }}
          >
            <div className="flex justify-between items-center border-b pb-3 mb-3.5" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
              <div className="flex items-center gap-2">
                <TerminalIcon className="text-indigo-400" size={16} />
                <span className="font-display font-black text-xs tracking-tight">GEOGRAPHIC AI SECOPS COPILOT</span>
              </div>
              <HelpIcon size={14} className="text-gray-500 hover:text-white cursor-help transition-colors" onClick={() => triggerSecOpsToast('COPILOT ACTIVE\nPrompt active threats or query tactical recommendations regarding perimeter guards.', 'system')} />
            </div>

            {/* Chat list history scrolls */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 mb-3">
              {copilotChat.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-lg leading-relaxed text-[11px] ${
                    msg.sender === 'user' 
                      ? 'ml-8 bg-blue-primary/10 text-white border border-accent-blue/20 self-end text-right' 
                      : 'mr-8 bg-black/30 text-gray-500 border border-white/5 font-mono whitespace-pre-wrap'
                  }`}
                  style={{
                    backgroundColor: msg.sender === 'user' ? 'rgba(0, 87, 255, 0.15)' : 'rgba(0,0,0,0.2)'
                  }}
                >
                  <div className="font-bold text-[9px] tracking-wider text-accent-blue mb-1 uppercase font-mono">
                    {msg.sender === 'user' ? 'Operator' : 'AI Copilot Advisor'}
                  </div>
                  <div>{msg.text}</div>
                </div>
              ))}
              {isCopilotTyping && (
                <div className="mr-8 bg-black/30 p-3 rounded-lg border border-white/5 flex gap-1 font-mono items-center text-[10px] text-gray-500">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <span className="ml-1 uppercase tracking-widest text-[9px]">AI processing diagnostics...</span>
                </div>
              )}
            </div>

            {/* Prompt submission action */}
            <form onSubmit={handleCopilotSubmit} className="flex gap-2">
              <input 
                type="text"
                value={copilotInput}
                onChange={(e) => setCopilotInput(e.target.value)}
                placeholder="Ask about active firewall state or lock overrides..."
                disabled={isCopilotTyping}
                className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-[11px] focus:outline-none focus:border-accent-blue tracking-wide disabled:opacity-50 text-white"
              />
              <button
                type="submit"
                disabled={isCopilotTyping || !copilotInput.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 font-extrabold text-[#fff] tracking-wider px-3.5 rounded-lg cursor-pointer transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <Send size={12} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* SECURITY CLEARANCE & ACCESS CONTROL CENTER */}
      <div 
        className="border rounded-xl p-5 backdrop-blur-md transition-all duration-300 flex flex-col text-xs mb-6 w-full select-none"
        style={{
          borderColor: isDark ? 'rgba(77, 141, 255, 0.18)' : 'rgba(10, 16, 37, 0.12)',
          backgroundColor: isDark ? 'rgba(10, 16, 37, 0.85)' : 'rgba(255, 255, 255, 0.8)'
        }}
      >
        <div className="flex justify-between items-start border-b pb-3.5 mb-4" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
          <div>
            <div className="flex items-center gap-2.5 mb-1 bg-transparent text-white">
              <Key className="text-amber-400 animate-pulse" size={17} />
              <span className="font-display font-black text-sm tracking-tight uppercase">SECURITY CLEARANCE & ACCESS CONTROL CENTER</span>
            </div>
            <div className="text-[10px] text-gray-400 font-sans">
              Direct terminal overrides to manage, escalate, or revoke personnel active authorization keys.
            </div>
          </div>
          <span className="font-mono text-[9px] tracking-widest text-[#00C853] bg-green-500/10 px-2 py-0.5 rounded font-black uppercase">
            {user.role === 'admin' ? 'SEC_COOPS AUTHORIZED - L9' : 'READ-ONLY RECON CLEARANCE'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px] border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)' }}>
                <th className="py-2.5 text-gray-500 font-extrabold pb-2 uppercase tracking-wider">OPERATOR PROFILE</th>
                <th className="py-2.5 text-gray-500 font-extrabold pb-2 uppercase tracking-wider hidden md:table-cell">EMAIL NODE ID</th>
                <th className="py-2.5 text-gray-500 font-extrabold pb-2 uppercase tracking-wider">CLEARANCE TAG</th>
                <th className="py-2.5 text-gray-500 font-extrabold pb-2 uppercase tracking-wider hidden sm:table-cell">ACTIVE BAND</th>
                <th className="py-2.5 text-gray-500 font-extrabold pb-2 uppercase tracking-wider text-right">TACTICAL OVERRIDE ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
              {users.map((item) => (
                <tr key={item.email} className="hover:bg-blue-primary/5 transition-colors">
                  <td className="py-3 font-semibold text-white">
                    <div className="flex flex-col select-text">
                      <span className="text-[12px] font-sans font-black tracking-tight">{item.name}</span>
                      <span className="text-[9.5px] text-gray-500 mt-0.5 md:hidden font-mono">{item.email}</span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-400 hidden md:table-cell font-mono select-text">{item.email}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest ${
                      item.role === 'admin' 
                        ? 'bg-red-alert/15 text-red-alert border border-red-alert/25'
                        : item.role === 'analyst'
                        ? 'bg-accent-blue/15 text-accent-blue border border-accent-blue/25'
                        : 'bg-slate-500/15 text-slate-400 border border-slate-500/25'
                    }`}>
                      {item.role === 'admin' ? 'ADMINISTRATOR' : item.role === 'analyst' ? 'SECURITY ANALYST' : 'READ-ONLY OPERATOR'}
                    </span>
                  </td>
                  <td className="py-3 hidden sm:table-cell">
                    <span className="text-gray-400 font-mono text-[9px] bg-black/20 border border-white/5 px-2 py-0.5 rounded font-bold tracking-wide">
                      {item.accessLevel}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {user.role === 'admin' ? (
                      <div className="inline-flex gap-1.5 justify-end">
                        <button
                          onClick={() => handleUpdateRole(item.email, 'admin')}
                          disabled={item.role === 'admin'}
                          title="PROMOTE OPERATOR TO ADMINISTRATOR"
                          className={`px-2 py-1 rounded text-[8px] font-extrabold font-mono tracking-wider border cursor-pointer transition-all duration-200 ${
                            item.role === 'admin' 
                              ? 'bg-red-alert/5 text-red-alert/35 border-red-alert/10 cursor-not-allowed'
                              : 'bg-red-alert/10 border-red-alert/35 text-red-alert hover:bg-red-alert/25'
                          }`}
                        >
                          ADMIN
                        </button>
                        <button
                          onClick={() => handleUpdateRole(item.email, 'analyst')}
                          disabled={item.role === 'analyst'}
                          title="PROMOTE OPERATOR TO SECURITY ANALYST"
                          className={`px-2 py-1 rounded text-[8px] font-extrabold font-mono tracking-wider border cursor-pointer transition-all duration-200 ${
                            item.role === 'analyst' 
                              ? 'bg-accent-blue/5 text-accent-blue/35 border-accent-blue/10 cursor-not-allowed'
                              : 'bg-accent-blue/10 border-accent-blue/35 text-accent-blue hover:bg-accent-blue/25'
                          }`}
                        >
                          ANALYST
                        </button>
                        <button
                          onClick={() => handleUpdateRole(item.email, 'readonly')}
                          disabled={item.role === 'readonly'}
                          title="REVOKE WRITE PERMISSIONS TO AUDIT-ONLY"
                          className={`px-2 py-1 rounded text-[8px] font-extrabold font-mono tracking-wider border cursor-pointer transition-all duration-200 ${
                            item.role === 'readonly' 
                              ? 'bg-slate-500/5 text-slate-400/35 border-slate-500/10 cursor-not-allowed'
                              : 'bg-slate-500/10 border-slate-500/35 text-slate-400 hover:bg-slate-500/25'
                          }`}
                        >
                          REVOKE
                        </button>
                      </div>
                    ) : (
                      <span className="text-[8.5px] text-gray-500 tracking-widest font-black uppercase bg-black/15 border border-white/5 px-2.5 py-1 rounded select-none">
                        OVERRIDE BLOCKED
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECURE COMPLIANCE AUDIT TRAIL LEDGER */}
      <div 
        className="border rounded-xl p-5 backdrop-blur-md transition-all duration-300 flex flex-col text-xs mb-6 w-full select-none"
        style={{
          borderColor: isDark ? 'rgba(77, 141, 255, 0.18)' : 'rgba(10, 16, 37, 0.12)',
          backgroundColor: isDark ? 'rgba(10, 16, 37, 0.85)' : 'rgba(255, 255, 255, 0.8)'
        }}
      >
        <div className="flex justify-between items-start border-b pb-3.5 mb-4" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
          <div>
            <div className="flex items-center gap-2.5 mb-1 bg-transparent text-white">
              <Radio className="text-emerald-400 animate-pulse" size={17} />
              <span className="font-display font-black text-sm tracking-tight uppercase" style={{ color: isDark ? '#ffffff' : '#0a1025' }}>SECURE AUDIT COMPLIANCE CLOUD LEDGER</span>
            </div>
            <div className="text-[10px] text-gray-400 font-sans">
              Cryptographically timestamped action logs record of all administrative overrides, security level shifts, and gate changes.
            </div>
          </div>
          <span className="font-mono text-[9px] tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-black uppercase">
            COMPLIANCE SECURED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px] border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)' }}>
                <th className="py-2.5 text-gray-500 font-extrabold pb-2 uppercase tracking-wider">TIMESTAMP (UTC)</th>
                <th className="py-2.5 text-gray-500 font-extrabold pb-2 uppercase tracking-wider">OPERATOR KEY</th>
                <th className="py-2.5 text-gray-500 font-extrabold pb-2 uppercase tracking-wider">ACTION RECORD</th>
                <th className="py-2.5 text-gray-500 font-extrabold pb-2 uppercase tracking-wider text-right">ORIGIN IP</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500 font-sans">
                    No security overrides recorded in the current perimeter gate window.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-emerald-500/5 transition-colors">
                    <td className="py-3 text-gray-400 text-[10px] whitespace-nowrap select-text">
                      {new Date(log.timestamp).toISOString().replace('T', ' ').substring(0, 19)}
                    </td>
                    <td className="py-3 font-semibold select-text" style={{ color: isDark ? '#ffffff' : '#0a1025' }}>
                      {log.operator}
                    </td>
                    <td className="py-3 font-sans leading-relaxed select-text" style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(10, 16, 37, 0.8)' }}>
                      {log.action}
                    </td>
                    <td className="py-3 text-right text-gray-500 font-mono select-text">
                      {log.ip}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL-WIDTH TACTICAL LIVE TERMINAL LOGGER SHELL */}
      <div 
        className="border rounded-xl p-5 backdrop-blur-md select-none transition-all duration-300 text-xs flex flex-col h-[220px] max-h-[250px] font-mono group"
        style={{
          borderColor: isDark ? 'rgba(77, 141, 255, 0.18)' : 'rgba(10, 16, 37, 0.12)',
          backgroundColor: isDark ? 'rgba(5, 8, 22, 0.95)' : 'rgba(10, 16, 22, 0.97)'
        }}
      >
        <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3.5 select-none">
          <div className="flex items-center gap-2.5 text-[#ff3b30]">
            <TerminalIcon size={16} />
            <span className="font-black text-xs tracking-wider uppercase text-[#00C853]">SECOPS DIRECT HANDSHAKE TERMINAL SHELL</span>
          </div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
            STATION ACTIVE // CODENAME: Operator
          </span>
        </div>

        {/* Scroll stream list */}
        <div className="flex-1 overflow-y-auto space-y-1.5 text-[11px] font-mono text-[#00C853] pr-1 mb-2.5">
          {terminalHistory.map((text, idx) => (
            <div key={idx} className="whitespace-pre-wrap select-text leading-relaxed font-semibold">
              {text}
            </div>
          ))}
          <div ref={consoleEndRef} />
        </div>

        {/* Interactive Shell Input */}
        <form onSubmit={executeTerminalCmd} className="flex gap-2 relative bg-black/40 p-1.5 rounded-lg border border-white/5">
          <span className="text-[#00C853] font-bold pl-2.5 py-1 select-none font-mono">&gt;</span>
          <input 
            type="text"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            placeholder="Type 'help' to review operative command sets (e.g. 'scan', 'lockdown', 'whoami', 'shields')..."
            className="flex-1 bg-transparent border-none text-[#00C853] font-mono focus:outline-none placeholder:text-[#00C853]/40 tracking-wide text-xs pl-1 py-1"
          />
          <button 
            type="submit"
            className="bg-green-alert text-[#050816] font-bold font-mono tracking-wider px-3.5 rounded text-[10px] cursor-pointer hover:bg-green-alert/80 transition-colors"
          >
            ENTER
          </button>
        </form>
      </div>
      </>
      )}

    </div>
  );
}
