import React from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/Hero';
import { useApp } from '../context/AppContext';
import { ShieldCheck, ShieldAlert, Cpu, Radio, ChevronRight, Activity, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { isDark } = useApp();
  const navigate = useNavigate();

  return (
    <Layout activeRoute="/" inConsoleMode={false}>
      <div className="w-full flex flex-col gap-16 md:gap-24">
        {/* HERO SECTION DEPLOYER */}
        <Hero isDark={isDark} onLaunchConsole={() => navigate('/dashboard')} />

        {/* SECURE INFRASTRUCTURE KEY METRICS BLOCK */}
        <section className="max-w-7xl mx-auto w-full px-6">
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-2xl border backdrop-blur-md relative overflow-hidden"
            style={{
              borderColor: isDark ? 'rgba(255, 59, 48, 0.2)' : 'rgba(10, 16, 37, 0.1)',
              background: isDark ? 'rgba(10, 16, 37, 0.45)' : 'rgba(255, 255, 255, 0.6)'
            }}
          >
            {/* Ambient cyber mesh lines */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent blur-2xl" />
            
            <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left">
              <span className="text-xs font-mono uppercase tracking-wider text-red-500 flex items-center gap-1.5 justify-center md:justify-start">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Protected Endpoints
              </span>
              <span className="text-3xl md:text-4xl font-extrabold tracking-tight font-mono">148,802+</span>
              <p className="text-xs text-gray-400 mt-1">Enterprise machines shielded 24/7</p>
            </div>

            <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left border-l pl-6" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
              <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Threats Stopped</span>
              <span className="text-3xl md:text-4xl font-extrabold tracking-tight font-mono text-red-500">4.2M+</span>
              <p className="text-xs text-gray-400 mt-1">Ransomware & intrusions blocked</p>
            </div>

            <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left border-l pl-6" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
              <span className="text-xs font-mono uppercase tracking-wider text-green-500">SLA Resolution</span>
              <span className="text-3xl md:text-4xl font-extrabold tracking-tight font-mono">99.997%</span>
              <p className="text-xs text-gray-400 mt-1">Dhaka & international containment SLA</p>
            </div>

            <div className="flex flex-col gap-1 items-center md:items-start text-center md:text-left border-l pl-6" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400">Response Rate</span>
              <span className="text-3xl md:text-4xl font-extrabold tracking-tight font-mono">&lt; 12 Sec</span>
              <p className="text-xs text-gray-400 mt-1">Incident isolation throughput</p>
            </div>
          </div>
        </section>

        {/* ENTERPRISE CORE CAPABILITIES (BENTO GRID STYLE) */}
        <section className="max-w-7xl mx-auto w-full px-6 flex flex-col gap-12">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Elite Defense Architecture. <span className="text-red-500">Zero Trust Ingress.</span>
            </h2>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed">
              We reinforce corporate digital boundaries using deep-packet security, behavior analytics, and autonomous host locking mechanisms. Human-orchestrated, machine-scaled cybersecurity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              className="p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 relative group"
              style={{
                borderColor: isDark ? 'rgba(255, 59, 48, 0.15)' : 'rgba(10, 16, 37, 0.08)',
                background: isDark ? 'rgba(10, 16, 37, 0.4)' : 'rgba(255, 255, 255, 0.45)'
              }}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-red-500/10 border border-red-500/30 text-red-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Active Perimeter Containment</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Instant virtual patching, endpoint lockdowns, and network level isolation the millisecond polymorphic signatures or suspicious volumetric payloads correlate.
              </p>
              <button 
                onClick={() => navigate('/services')} 
                className="text-xs font-mono tracking-wider font-semibold text-red-400 flex items-center gap-1 group-hover:gap-2 transition-all duration-300"
              >
                DISCOVER SOLUTIONS <ChevronRight size={14} />
              </button>
            </div>

            <div 
              className="p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 relative group"
              style={{
                borderColor: isDark ? 'rgba(77, 141, 255, 0.15)' : 'rgba(10, 16, 37, 0.08)',
                background: isDark ? 'rgba(10, 16, 37, 0.4)' : 'rgba(255, 255, 255, 0.45)'
              }}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Cpu size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Real-Time Threat Intelligence</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Dynamic indexing of zero-day vulnerabilities, credential leak vectors on darknet channels, and global IP blacklists mapped live with our centralized Dhaka command center.
              </p>
              <button 
                onClick={() => navigate('/why-us')} 
                className="text-xs font-mono tracking-wider font-semibold text-blue-400 flex items-center gap-1 group-hover:gap-2 transition-all duration-300"
              >
                EXPLORE METHODOLOGY <ChevronRight size={14} />
              </button>
            </div>

            <div 
              className="p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 relative group"
              style={{
                borderColor: isDark ? 'rgba(0, 200, 83, 0.15)' : 'rgba(10, 16, 37, 0.08)',
                background: isDark ? 'rgba(10, 16, 37, 0.4)' : 'rgba(255, 255, 255, 0.45)'
              }}
            >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-500/10 border border-green-500/30 text-green-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Radio size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 tracking-tight">Compliance & Auditing Ready</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Achieve lightning-fast ISO 27001, SOC 2 Type II, and PCI-DSS readiness with pre-audited secure configurations, encrypted audit trails, and human-written gap reviews.
              </p>
              <button 
                onClick={() => navigate('/about')} 
                className="text-xs font-mono tracking-wider font-semibold text-green-400 flex items-center gap-1 group-hover:gap-2 transition-all duration-300"
              >
                VIEW PROFILE <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* ENTERPRISE ACTION BANNER */}
        <section className="max-w-7xl mx-auto w-full px-6">
          <div 
            className="p-12 md:p-16 rounded-3xl border text-center flex flex-col items-center gap-6 relative overflow-hidden"
            style={{
              borderColor: isDark ? 'rgba(255, 59, 48, 0.3)' : 'rgba(10, 16, 37, 0.12)',
              background: 'linear-gradient(135deg, rgba(255,59,48,0.06) 0%, rgba(0,87,255,0.04) 100%)'
            }}
          >
            {/* Glowing orb background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

            <span className="text-xs font-mono uppercase tracking-widest text-red-500 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">
              SECURE DEPLOYMENT PROTOCOL
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight max-w-4xl leading-[1.1]">
              Ready to Shields-Up Your Infrastructure?
            </h2>
            <p className="text-gray-400 max-w-2xl text-sm md:text-base leading-relaxed">
              Experience zero-trust cybersecurity engineered with defense-grade compliance criteria. Schedule a tactical consultation or execute direct penetration-testing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
              <button 
                onClick={() => navigate('/contact')}
                className="px-8 py-3.5 bg-red-600 hover:bg-red-700 font-bold text-white rounded-lg shadow-lg hover:shadow-red-600/20 transition-all duration-300 font-mono tracking-wider text-sm flex items-center justify-center gap-2"
              >
                REQUEST AUDIT NOW
              </button>
              <button 
                onClick={() => navigate('/services')}
                className="px-8 py-3.5 bg-transparent border border-gray-500 hover:border-white font-bold rounded-lg transition-all duration-300 font-mono tracking-wider text-sm flex items-center justify-center gap-2"
                style={{ color: isDark ? 'white' : '#0A1025' }}
              >
                OUR SOLUTION METRICS
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
