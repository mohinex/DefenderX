import React, { useState } from 'react';
import { Shield, Search, Lock, Cloud, Mail, AlertTriangle, CheckCircle, Cpu, FileText, Activity, Clock, Terminal, CheckCircle2, RefreshCw, Layers, Sparkles, ChevronRight } from 'lucide-react';
import { triggerSecOpsToast } from './ToastContainer';

interface ServiceItem {
  icon: any;
  color: string;
  bg: string;
  title: string;
  tag: string;
  standard: string;
  desc: string;
  tools: string[];
  deliverables: string[];
  sla: string;
  longDesc: string;
}

const detailedServices: ServiceItem[] = [
  {
    icon: Shield,
    color: '#FF3B30',
    bg: 'rgba(255,59,48,0.12)',
    title: 'SOC Monitoring',
    tag: 'SOC',
    standard: 'ISO 27001 Annex A.12 / NIST SP 800-61',
    desc: '24/7/365 active operations center with live telemetry aggregation, SIEM threat correlation, and millisecond isolation.',
    longDesc: 'Our Dhaka-based Secure Operations Center aggregates server logs, cloud egress parameters, and endpoints. Driven by senior analysts working rotating shifts, our SOC prevents critical operational shutdowns with active containment protocols.',
    tools: ['Elastic Security', 'Wazuh EDR', 'Zeek Network Probe', 'Suricata IPS'],
    deliverables: ['Real-time Telemetry Dashboard', 'Correlated SIEM Alert Streams', 'Monthly Incident Review Registers', 'Host Lockdown Controls'],
    sla: 'Within 2 minutes of active alert correlation'
  },
  {
    icon: Search,
    color: '#4D8DFF',
    bg: 'rgba(77,141,255,0.12)',
    title: 'VAPT / Pentest',
    tag: 'VAPT',
    standard: 'OWASP Top 10 / PTES Framework',
    desc: 'Exhaustive vulnerability assessment and black/gray-box penetration testing on web, API, and active directory channels.',
    longDesc: 'We coordinate targeted manual exploitation attacks to uncover application logical flows, authorization bypasses, and lateral movement gates before external hostile actors do.',
    tools: ['Burp Suite Pro', 'Nessus Enterprise', 'Metasploit Pro', 'Acunetix Scan'],
    deliverables: ['Executive Risk Scoring Index', 'Detailed Proof-of-Concept Exploit Steps', 'Remediation Action Items Plan', 'Complimentary Re-scan Verification'],
    sla: '7-day assessment with immediate Critical Alert dispatches'
  },
  {
    icon: Cpu,
    color: '#00C853',
    bg: 'rgba(0,200,83,0.12)',
    title: 'Endpoint Security',
    tag: 'EDR',
    standard: 'CIS Critical Security Controls (CSC #08)',
    desc: 'Advanced behavior monitoring on user terminals, workstations, and servers to intercept memory injects and ransomware.',
    longDesc: 'Traditional anti-virus is obsolete against polymorphic malware. Our EDR solutions track runtime process behavior, stopping fileless shellcode execution and sandbox bypasses in real-time.',
    tools: ['CrowdStrike Falcon', 'SentinelOne Core', 'Microsoft Defender for Endpoint'],
    deliverables: ['Terminal Activity Logs', 'Memory Buffer Guard Monitors', 'Registry Alteration Lockdowns', 'One-Click Host Isolators'],
    sla: 'Actionable containment in under 12 seconds'
  },
  {
    icon: Cloud,
    color: '#34D399',
    bg: 'rgba(52,211,153,0.12)',
    title: 'Cloud Security',
    tag: 'CSPM',
    standard: 'CSA Star Matrix / SOC 2 Type II',
    desc: 'Sustained configuration audits, IAM boundary mapping, and exfiltration tracking on AWS, GCP, and Azure frameworks.',
    longDesc: 'We perform deep-level infrastructure audits to prevent open storage buckets, overly permissive cross-account access, and rogue server deployments.',
    tools: ['Prisma Cloud', 'Aquasec Trivy', 'AWS Security Hub', 'GCP Security Command Center'],
    deliverables: ['Over-permissioned Role Maps', 'Posturing Scoreboards', 'Data Transit Encryption Audits', 'Orphan Resource Indexes'],
    sla: 'Continuous configuration sweeps with hourly updates'
  },
  {
    icon: Mail,
    color: '#EF9F27',
    bg: 'rgba(239,159,39,0.12)',
    title: 'Email Security',
    tag: 'EMAIL',
    standard: 'RFC 7208 / 6376 / 7489 Alignment',
    desc: 'Filtering out phishing, credential-harvesting links, malware vectors, and SPF/DKIM/DMARC spoofings.',
    longDesc: 'Over 85% of compromises start via email. We route incoming corporate traffic through an advanced security gateway, analyzing links and sandboxing attachments.',
    tools: ['Mimecast Gateway', 'Proofpoint Email Protection', 'DMARC Analyzer'],
    deliverables: ['Spam/Phishing Block Metrics', 'DMARC Compliance Enforcement', 'Executive Spoof Attempt Records', 'Employee Risk Scorecards'],
    sla: 'Continuous high-volume mailbox scanning'
  },
  {
    icon: AlertTriangle,
    color: '#F43F5E',
    bg: 'rgba(244,63,94,0.12)',
    title: 'Incident Response',
    tag: 'IR',
    standard: 'NIST SP 800-86 Forensic Guide',
    desc: 'On-demand digital forensics and incident response to isolate compromises, contain outbreaks, and resume safe operations.',
    longDesc: 'If your network suffers active ransomware, our rapid deployment team isolates coordinates, recovers databases, and executes binary level logs reverse engineering to patch access points.',
    tools: ['Volatility Memory Forensics', 'FTK Imager', 'Autopsy Sleuth Kit', 'Wireshark Pro'],
    deliverables: ['Root Cause Compromise Explainer', 'Sovereign Evidence Preservation', 'Data Restoration Directives', 'Ransomware Mutation Reports'],
    sla: 'Dhaka-wide physical deployment under 4 hours'
  },
  {
    icon: CheckCircle,
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.12)',
    title: 'Compliance & Audit',
    tag: 'GRC',
    standard: 'Bangladesh Bank ICT Guidelines v3.0 / PCI-DSS',
    desc: 'Aligning business workflows, identity roles, and storage models to clear auditing checklists of national regulations.',
    longDesc: 'Secure configurations are only half the battle. We assist financial firms and digital business operations through structured control alignments to clear regulatory inspector reviews.',
    tools: ['OneTrust', 'AuditBoard', 'Eurosia GRC Compliance Checklists'],
    deliverables: ['Gap Analysis Logs', 'Sovereign Audit-Ready Reports', 'Written Security Policy Handbooks', 'Risk Mitigation Logs'],
    sla: 'Complete certification posture ready under 30 days'
  },
  {
    icon: Lock,
    color: '#06B6D4',
    bg: 'rgba(6,182,212,0.12)',
    title: 'Threat Intelligence',
    tag: 'CTI',
    standard: 'STIX / TAXII Protocol Standard',
    desc: 'Deep-web monitoring, local IOC feeds distribution, and dark net brand telemetry analysis to warn you of upcoming leaks.',
    longDesc: 'We trace malicious threat-actor chatrooms, leakage forums, and paste networks to find compromised credentials belonging to your staff or clients before they are exploited.',
    tools: ['Recorded Future API', 'Maltego Graphical Linker', 'Tor Node Scrapers'],
    deliverables: ['Leaked Staff Credential Warnings', 'Ad adversary IP Blocks', 'Target Group Attack Advisories', 'Domain Spoof Scans'],
    sla: 'Real-time credential breach monitoring'
  }
];

interface ServicesProps {
  isDark?: boolean;
}

export default function Services({ isDark = true }: ServicesProps) {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const handleServiceSelect = (service: ServiceItem) => {
    setSelectedService(service);
    triggerSecOpsToast(`SECURE MANUAL LOADED\nTarget: ${service.title}`, 'system');
  };

  return (
    <section 
      id="services" 
      className="relative z-10 py-16 sm:py-24 select-none transition-colors duration-450"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="badge inline-flex items-center gap-1.5 mb-4">
            <Layers size={11} />
            SECURITY PORTFOLIO
          </div>
          <h2 
            className="font-display font-black text-3xl sm:text-5xl tracking-tight mb-4 animate-fade-in"
            style={{ color: isDark ? '#ffffff' : '#050816' }}
          >
            Enterprise-Grade <span className="text-accent-blue font-black">Cyber Solutions</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed">
            Eurosia Defender X operates 8 modular security layers. Click on any solution cell to review deep operational features, active tools, local SLAs, and regulatory compliance references.
          </p>
        </div>

        {/* Master Interactive Split Screen View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Panel: Bento Grid Solution Cells */}
          <div className={`${selectedService ? 'lg:col-span-6' : 'lg:col-span-12'} grid grid-cols-1 sm:grid-cols-2 gap-4 transition-all duration-300`}>
            {detailedServices.map(s => {
              const Icon = s.icon;
              const isSelected = selectedService?.title === s.title;
              return (
                <div 
                  key={s.title} 
                  onClick={() => handleServiceSelect(s)}
                  className={`card p-5 cursor-pointer text-left transition-all duration-300 relative overflow-hidden group ${
                    isSelected 
                      ? 'border-accent-blue bg-accent-blue/5 shadow-[0_0_15px_rgba(77,141,255,0.15)] scale-[1.01]' 
                      : 'hover:-translate-y-1'
                  }`}
                  style={{ 
                    background: isDark ? 'rgba(10,16,37,0.7)' : 'rgba(255,255,255,0.9)',
                    borderColor: isSelected 
                      ? '#4D8DFF' 
                      : isDark ? 'rgba(77,141,255,0.15)' : 'rgba(10,16,37,0.1)'
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border transition-all"
                      style={{ 
                        background: s.bg, 
                        borderColor: `${s.color}25`,
                      }}
                    >
                      <Icon size={18} style={{ color: s.color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h4 
                          className="font-display font-black text-xs uppercase tracking-wide truncate"
                          style={{ color: isDark ? 'white' : '#050816' }}
                        >
                          {s.title}
                        </h4>
                        <span 
                          className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider"
                          style={{ 
                            background: `${s.color}15`, 
                            color: s.color, 
                            border: `1px solid ${s.color}30` 
                          }}
                        >
                          {s.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                        {s.desc}
                      </p>
                    </div>
                  </div>

                  {/* Cell footer indicating click ability */}
                  <div className="mt-4 pt-3 border-t border-dashed border-white/5 flex items-center justify-between font-mono text-[9px] text-gray-500">
                    <span className="truncate max-w-[180px]">{s.standard}</span>
                    <span className="text-accent-blue opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase tracking-widest flex items-center gap-1 select-none">
                      DEEP-DIVE <ChevronRight size={10} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Panel: Selected Service Manual Deep Dive */}
          {selectedService && (
            <div 
              className="lg:col-span-6 p-6 sm:p-8 rounded-2xl border animate-fade-up relative overflow-hidden text-left"
              style={{
                borderColor: 'rgba(77, 141, 255, 0.25)',
                backgroundColor: isDark ? 'rgba(10, 16, 37, 0.85)' : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)'
              }}
            >
              {/* Radar Sweeping grid effect background */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-25 pointer-events-none">
                <div className="w-full h-full border border-dashed border-accent-blue/30 rounded-full animate-pulse" />
              </div>

              {/* Service Meta Title */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center border"
                    style={{ background: selectedService.bg, borderColor: `${selectedService.color}40` }}
                  >
                    {(() => {
                      const Icon = selectedService.icon;
                      return <Icon size={22} style={{ color: selectedService.color }} />;
                    })()}
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm uppercase tracking-wider text-white" style={{ color: isDark ? 'white' : '#050816' }}>
                      {selectedService.title} SYSTEM MANUAL
                    </h3>
                    <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                      REF ID: EUR-{selectedService.tag}-2026
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedService(null)}
                  className="font-mono text-[10px] text-[#FF3B30] bg-[#FF3B30]/10 border border-[#FF3B30]/20 px-2.5 py-1 rounded cursor-pointer transition-all hover:bg-[#FF3B30]/20 font-bold"
                >
                  CLOSE MANUAL
                </button>
              </div>

              {/* Deep Content Body */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-mono text-[9px] font-bold text-accent-blue tracking-widest uppercase mb-1.5">
                    1.0 COMPLIANCE STANDARD
                  </h4>
                  <span className="inline-block px-3 py-1 font-mono text-[11px] font-bold bg-white/5 border border-white/10 text-white rounded">
                    {selectedService.standard}
                  </span>
                </div>

                <div>
                  <h4 className="font-mono text-[9px] font-bold text-accent-blue tracking-widest uppercase mb-1.5">
                    2.0 PROFESSIONAL DETAILS
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
                    {selectedService.longDesc}
                  </p>
                </div>

                {/* Sub-grid of Tech Stack & Deliverables */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-white/5 bg-black/15">
                    <div className="flex items-center gap-1.5 text-accent-blue text-xs font-mono font-bold uppercase mb-2.5">
                      <Terminal size={12} />
                      ACTIVE TOOL DEPLOYMENT
                    </div>
                    <ul className="space-y-1.5 text-[11px] font-mono text-gray-500">
                      {selectedService.tools.map(tool => (
                        <li key={tool} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-accent-blue" />
                          <span>{tool}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl border border-white/5 bg-black/15">
                    <div className="flex items-center gap-1.5 text-[#00C853] text-xs font-mono font-bold uppercase mb-2.5">
                      <FileText size={12} />
                      DELIVERABLES PRODUCED
                    </div>
                    <ul className="space-y-1.5 text-[11px] font-sans text-gray-500">
                      {selectedService.deliverables.map(item => (
                        <li key={item} className="flex items-center gap-1.5">
                          <CheckCircle2 size={10} className="text-[#00C853] flex-shrink-0" />
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Technical SLA Information */}
                <div className="p-4 rounded-xl border flex items-center justify-between text-xs bg-red-alert/5 border-red-alert/20">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-red-alert animate-pulse" />
                    <div>
                      <span className="block text-[8px] font-mono tracking-widest text-[#FF3B30] font-bold uppercase">SOCIETY RESPONSE GUARANTEE</span>
                      <span className="font-display font-bold text-xs" style={{ color: isDark ? 'white' : '#050816' }}>GUARANTEED RESPONSE SLA</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-black text-red-alert uppercase tracking-wide">
                    {selectedService.sla}
                  </span>
                </div>

                {/* On-boarding dispatcher message */}
                <button 
                  onClick={() => {
                    window.location.hash = '#contact';
                    setSelectedService(null);
                  }}
                  className="w-full py-3.5 font-display text-xs font-bold tracking-widest text-white bg-gradient-to-r from-red-alert to-[#0057FF] rounded-lg cursor-pointer transform active:scale-99 hover:brightness-105 transition-all duration-200 border-none uppercase"
                >
                  DISPATCH ENGAGEMENT REQUEST
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
