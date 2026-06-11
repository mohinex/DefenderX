import React, { useState } from 'react';
import { ShieldCheck, Users, Globe, Award, Target, Eye, Database, ShieldAlert, Cpu, CheckCircle2, ChevronRight, Facebook, Twitter, Linkedin } from 'lucide-react';

interface AboutProps {
  isDark?: boolean;
  socialLinks?: { facebook: string; twitter: string; linkedin: string };
}

export default function About({ isDark = true, socialLinks }: AboutProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'soc' | 'team'>('profile');

  const highlights = [
    { icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', label: 'Dhaka-HQ Command Center', desc: 'Sovereign data protection aligned with national jurisdiction.' },
    { icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/25', label: 'Engineered in Bangladesh', desc: 'On-site regional response specialists and global consultants.' },
    { icon: Globe, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/25', label: 'Compliance Sovereign', desc: 'Strict alignment with Bangladesh Bank Guidelines, ISO 27001, and NIST.' },
    { icon: Award, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/25', label: 'Proven Defense Records', desc: 'Preventing malicious intrusions for financial and critical business targets.' },
  ];

  const methodologySteps = [
    { num: '01', title: 'System Audting & Recon', dev: 'VAPT Protocol', desc: 'Continuous automated and manual reconnaissance to map unknown surface vulnerabilities.' },
    { num: '02', title: 'Threat Vector Modeling', dev: 'Zero-Trust Pipeline', desc: 'Predicting potential injection and lateral movement trails within internal network boundaries.' },
    { num: '03', title: 'Isolation Infrastructure', dev: 'Mitigation Matrix', desc: 'Deploying autonomous micro-segmentation rules to box in active threats dynamically.' },
    { num: '04', title: '24/7 SOC Triage Loop', dev: 'Human Monitoring', desc: 'Senior local analysts collaborating with machine intelligence to drop security threats permanently.' }
  ];

  const certifications = [
    { title: 'CISSP', subtitle: 'Certified Information Systems Security Professional', authority: 'ISC²' },
    { title: 'OSCP', subtitle: 'Offensive Security Certified Professional', authority: 'OffSec' },
    { title: 'CEH Master', subtitle: 'Certified Ethical Hacker', authority: 'EC-Council' },
    { title: 'ISO 27001 LA', subtitle: 'Lead Auditor Credentials', authority: 'IRCA' }
  ];

  return (
    <section 
      id="about" 
      className="relative z-10 py-16 sm:py-24 select-none transition-colors duration-300"
      style={{ background: 'transparent' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Navigation Indicator Badge / Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="badge inline-flex items-center gap-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            OPERATIONAL PROFILE
          </div>
          <h2 
            className="font-display font-black text-3xl sm:text-5xl tracking-tight mb-4"
            style={{ color: isDark ? '#ffffff' : '#050816' }}
          >
            Sovereign Cyber Resilience For <span className="text-accent-blue font-black">Bangladeshi Enterprises</span>
          </h2>
          <p className="text-sm text-gray-500 font-sans max-w-xl mx-auto leading-relaxed">
            EUROSIA Defender X is Bangladesh’s premium private cyber defense agency. We run a dedicated, redundant, and highly responsive security apparatus engineered to secure critical digital assets.
          </p>
        </div>

        {/* Dynamic Nav Tabs for Interactive Content */}
        <div className="flex justify-center border-b mb-12" style={{ borderColor: isDark ? 'rgba(77, 141, 255, 0.15)' : 'rgba(10, 16, 37, 0.08)' }}>
          <div className="flex gap-4 sm:gap-8 font-mono text-xs">
            {[
              { id: 'profile', label: 'CORPORATE OVERVIEW' },
              { id: 'soc', label: 'THE REDUNDANT SOC HUB' },
              { id: 'team', label: 'ANALYST SPECIALTIES' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-4 px-2 tracking-widest relative font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id 
                    ? 'text-accent-blue font-extrabold' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-accent-blue" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section based on Current Tab Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Graphic & System Stats Terminal */}
          <div className="lg:col-span-5 relative">
            {activeTab === 'profile' && (
              <div 
                className="p-6 sm:p-8 rounded-2xl border backdrop-blur-md relative overflow-hidden transition-all duration-300"
                style={{
                  borderColor: isDark ? 'rgba(77, 141, 255, 0.2)' : 'rgba(10, 16, 37, 0.12)',
                  backgroundColor: isDark ? 'rgba(10, 16, 37, 0.75)' : 'rgba(255, 255, 255, 0.9)'
                }}
              >
                <div className="flex items-center gap-1.5 mb-6">
                  {['#FF3B30','#EF9F27','#00C853'].map(c =>
                    <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
                  <span className="text-[10px] font-mono font-bold text-accent-blue ml-2 tracking-wider">EUROSIA CORP DIRECTIVES</span>
                </div>

                <div className="space-y-4 font-mono text-xs">
                   <div className="flex border-b border-white/5 pb-2 justify-between">
                     <span className="text-accent-blue">OFFICIAL SEAL:</span>
                     <span style={{ color: isDark ? 'white' : '#050816' }}>EUROSIA DEFENDER X-100</span>
                   </div>
                   <div className="flex border-b border-white/5 pb-2 justify-between">
                     <span className="text-accent-blue">ESTABLISHED:</span>
                     <span style={{ color: isDark ? 'white' : '#050816' }}>Dhaka, Bangladesh (Est. 2020)</span>
                   </div>
                   <div className="flex border-b border-white/5 pb-2 justify-between">
                     <span className="text-accent-blue">DATA BOUNDARY:</span>
                     <span style={{ color: isDark ? 'white' : '#050816' }}>Sovereign Local Host Cloud</span>
                   </div>
                   <div className="flex border-b border-white/5 pb-2 justify-between">
                     <span className="text-accent-blue">SLA RESPONSE GUARANTEE:</span>
                     <span className="text-green-500 font-bold">&#60; 120 Seconds Live Action</span>
                   </div>
                   <div className="flex border-b border-white/5 pb-2 justify-between">
                     <span className="text-accent-blue">OPERATOR POOL:</span>
                     <span style={{ color: isDark ? 'white' : '#050816' }}>24/7 Redundant Rotation</span>
                   </div>
                   <div className="flex justify-between items-center pt-2">
                     <span className="text-accent-blue">REGULATORY HARMONY:</span>
                     <span className="text-amber-500 font-bold uppercase text-[9px] border border-amber-500/30 px-2 py-0.5 rounded">BB ICT STANDARDS v3.0</span>
                   </div>
                </div>

                {/* Floating 24/7 SOC Badge overlay */}
                <div className="absolute bottom-4 right-4 bg-gradient-to-br from-red-alert to-blue-primary p-3 rounded-xl shadow-lg text-center text-white scale-90 sm:scale-100">
                  <div className="font-display font-black text-2xl leading-none">24/7</div>
                  <div className="font-mono text-[8px] tracking-widest mt-1 opacity-90">SOC SHIELDING</div>
                </div>
              </div>
            )}

            {activeTab === 'soc' && (
              <div 
                className="p-6 sm:p-8 rounded-2xl border backdrop-blur-md relative overflow-hidden transition-all duration-300"
                style={{
                  borderColor: isDark ? 'rgba(255, 59, 48, 0.25)' : 'rgba(10, 16, 37, 0.12)',
                  backgroundColor: isDark ? 'rgba(10, 16, 37, 0.75)' : 'rgba(255, 255, 255, 0.9)'
                }}
              >
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="w-2 h-2 rounded-full bg-red-alert animate-ping" />
                  <span className="text-[10px] font-mono font-bold text-red-alert tracking-widest uppercase">DHAKA CORE COMMAND POST</span>
                </div>
                <h4 className="font-display font-bold text-sm mb-3" style={{ color: isDark ? 'white' : '#050816' }}>
                  Our physical Security Operations Center (SOC) is structurally fortified to bypass outages.
                </h4>
                <p className="text-xs text-gray-400 font-sans leading-relaxed mb-4">
                  Strategically situated in Dhaka, our SOC employs triple grid redundancies, dual fiber backbones, and sovereign sandstorm security pipelines. We do not farm out operations: your security telemetry never exits sovereign virtual perimeters unless authorized by your compliance officer.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-[10px]">
                  <div className="p-2.5 rounded bg-black/25 border border-white/5">
                    <span className="block text-accent-blue mb-1 font-bold">GRID UP-TIME</span>
                    <span className="text-green-500 font-bold text-xs">99.999% Active</span>
                  </div>
                  <div className="p-2.5 rounded bg-black/25 border border-white/5">
                    <span className="block text-accent-blue mb-1 font-bold">FIBER TRANSIT</span>
                    <span style={{ color: isDark ? 'white' : '#050816' }} className="font-bold">Dual Layer IPS</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div 
                className="p-6 sm:p-8 rounded-2xl border backdrop-blur-md relative overflow-hidden transition-all duration-300"
                style={{
                  borderColor: isDark ? 'rgba(0, 200, 83, 0.25)' : 'rgba(10, 16, 37, 0.12)',
                  backgroundColor: isDark ? 'rgba(10, 16, 37, 0.75)' : 'rgba(255, 255, 255, 0.9)'
                }}
              >
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#00C853]" />
                  <span className="text-[10px] font-mono font-bold text-green-alert tracking-widest uppercase">CERTIFICATION COMPLIANCE REGISTER</span>
                </div>
                <h4 className="font-display font-medium text-xs text-gray-400 mb-4 font-bold">
                  Defending networks requires offensive capabilities. Our specialists retain the world&apos;s most rigorous technical certs:
                </h4>

                <div className="space-y-3">
                  {certifications.map(c => (
                    <div key={c.title} className="flex items-center justify-between p-2.5 rounded bg-white/5 border border-white/10">
                      <div>
                        <span className="font-mono text-xs font-black text-white bg-blue-primary/30 border border-blue-primary/45 px-2 py-0.5 rounded tracking-wider mr-2">{c.title}</span>
                        <span className="text-[10px] text-gray-400 font-sans inline-block align-middle">{c.subtitle}</span>
                      </div>
                      <span className="font-mono text-[9px] text-emerald-400 font-extrabold">{c.authority} Verified</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column Custom Human-written Text Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-black text-2xl sm:text-3xl mb-3" style={{ color: isDark ? '#ffffff' : '#050816' }}>
                    Shielding Businesses From <span className="text-red-alert">Advanced Threat Actors</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans">
                    With over five years of active regional incident handling, EUROSIA Defender X provides on-the-ground defense coordination, continuous monitoring, and professional compliance auditing to help organizations sustain high cybersecurity posture. Our processes are engineered from the ground up to prevent costly data disruptions.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {highlights.map(h => {
                    const Icon = h.icon;
                    return (
                      <div 
                        key={h.label} 
                        className={`p-4 rounded-xl border flex gap-3 transition-colors duration-200 hover:bg-white/5`}
                        style={{
                          borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(10,16,37,0.08)'
                        }}
                      >
                        <div className={`p-2.5 rounded-lg h-9 w-9 flex items-center justify-center flex-shrink-0 ${h.bg} ${h.border} ${h.color}`}>
                          <Icon size={14} />
                        </div>
                        <div>
                          <h5 className="font-display font-bold text-xs uppercase tracking-wide mb-1" style={{ color: isDark ? 'white' : '#050816' }}>{h.label}</h5>
                          <p className="text-[11px] text-gray-500 leading-normal">{h.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'soc' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-black text-2xl sm:text-3xl mb-3" style={{ color: isDark ? '#ffffff' : '#050816' }}>
                    Engineered to Meet Redundant <span className="text-accent-blue">Global Guidelines</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans mb-4">
                    Cyber incidents occur in milliseconds. Our Dhaka command center remains isolated from standard load shedding pipelines and communication disruptions. We have deployed multi-carrier satellite integrations and regional fiber bridges to secure communication delivery under critical infrastructure events.
                  </p>
                </div>

                <div className="space-y-3">
                  {methodologySteps.map(step => (
                    <div 
                      key={step.num}
                      className="p-3 rounded-lg border bg-white/5 border-white/5 flex items-start gap-3 transition-all duration-200 hover:border-accent-blue/40"
                    >
                      <div className="font-mono text-xs font-black text-accent-blue bg-[#0057FF]/10 border border-blue-600/30 px-2 py-0.5 rounded tracking-wide">
                        {step.num}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1.5 font-bold">
                          <span className="font-display text-xs" style={{ color: isDark ? 'white' : '#050816' }}>{step.title}</span>
                          <span className="font-mono text-[9px] text-[#FF3B30] uppercase tracking-widest">{step.dev}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-black text-2xl sm:text-3xl mb-3" style={{ color: isDark ? '#ffffff' : '#050816' }}>
                    Elite Defensive &amp; <span className="text-green-alert">Offensive Architects</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans mb-4">
                    Our team isn’t consisting of generic support staff reading off templates. Every security technician is a specialized field investigator or certification-credentialed forensic examiner. From reverse-engineering state-sponsored malware strains to patching complex zero-day microcode flaws — we possess the native competency required to stand firm.
                  </p>
                </div>

                <div className="p-5 rounded-2xl border flex flex-col md:flex-row items-center gap-4 bg-yellow-400/5 border-yellow-400/20 text-xs">
                  <div className="p-3 bg-yellow-400/10 text-yellow-500 rounded-full flex-shrink-0">
                    <Target size={24} />
                  </div>
                  <div>
                    <h5 className="font-display font-black text-yellow-500 uppercase tracking-widest text-[11px] mb-1">OFF-SITE TARGET PRACTICE RANGE</h5>
                    <p className="text-gray-500 text-[11px] leading-relaxed">
                      Our analysts participate in international CTF (Capture the Flag) warfare and operate isolated sandboxed target labs simulating advanced adversary threat matrices (including APT-28, APT-41 malware profiles) to keep skills sharp and fully adaptive.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Social Connection Outpost */}
            <div className="mt-8 pt-6 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(10,16,37,0.08)' }}>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                <span className="font-mono text-[10px] text-gray-500 tracking-wider">OFFICIAL RECONNAISSANCE CHANNELS:</span>
                <div className="flex gap-2.5">
                  <a 
                    href={socialLinks?.facebook || "https://www.facebook.com/EurosiaOfficial"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs bg-[#1877f2]/10 border border-[#1877f2]/20 text-[#1877f2] font-semibold transition-all hover:bg-[#1877f2]/20"
                  >
                    <Facebook size={12} />
                    <span>Facebook Direct</span>
                  </a>
                  <a 
                    href={socialLinks?.twitter || "https://x.com/EurosiaOfficial"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs bg-[#19a0e6]/10 border border-[#19a0e6]/20 text-[#19a0e6] font-semibold transition-all hover:bg-[#19a0e6]/20"
                  >
                    <Twitter size={12} />
                    <span>X / Twitter</span>
                  </a>
                  <a 
                    href={socialLinks?.linkedin || "https://linkedin.com/in/EurosiaOfficial"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs bg-[#0b66c2]/10 border border-[#0b66c2]/20 text-[#0b66c2] font-semibold transition-all hover:bg-[#0b66c2]/20"
                  >
                    <Linkedin size={12} />
                    <span>LinkedIn Secure</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
