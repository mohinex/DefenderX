import React from 'react';
import Layout from '../components/layout/Layout';
import Services from '../components/Services';
import { useApp } from '../context/AppContext';
import { Shield, Sparkles, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ServicesPage() {
  const { isDark } = useApp();
  const navigate = useNavigate();

  return (
    <Layout activeRoute="/services" inConsoleMode={false}>
      <div className="w-full flex flex-col gap-12 max-w-7xl mx-auto px-6">
        
        {/* SERVICES HERO HEADER */}
        <section className="text-center md:text-left flex flex-col md:flex-row items-center gap-8 border-b pb-12" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
          <div className="flex-1 flex flex-col gap-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-500 flex items-center gap-2 justify-center md:justify-start">
              <Shield size={14} /> SECURITY AUDITING & OPERATIONS INC.
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Enterprise Cyber <span className="text-red-500">Defense Operations.</span>
            </h1>
            <p className="text-gray-400 max-w-2xl leading-relaxed text-sm md:text-base">
              Eurosia Defender X operates Dhaka’s premier private security ops platform. We deliver fully documented ISO-graded assessments, continuous network monitoring, configuration compliance auditing, and emergency forensic restorations.
            </p>
          </div>
          <div className="flex-none w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate('/contact')}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-all duration-300 font-mono tracking-wider shadow-lg hover:shadow-red-600/20 text-center"
            >
              SCHEDULE ENGAGEMENT
            </button>
            <button 
              onClick={() => navigate('/why-us')}
              className="px-6 py-3 border border-gray-500 hover:border-white font-bold rounded-lg text-sm transition-all duration-300 font-mono tracking-wider text-center"
              style={{ color: isDark ? 'white' : '#0a1025' }}
            >
              VIEW COMPLIANCE
            </button>
          </div>
        </section>

        {/* DETAILED INTERACTIVE SERVICES DEPLOYER COMPONENT */}
        <div className="w-full">
          <Services isDark={isDark} />
        </div>

        {/* SYSTEM COOPERATION CAPABILITIES IN ACCORDANCE WITH ISO 27001 */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-16 mt-8" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-bold tracking-tight">Our Deployment & Engagement Flow</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              We believe in professional rigor. Every security engagement we run follows a standard, non-disruptive, highly documented protocol aligned directly with the National Institute of Standards and Technology (NIST SP 800) framework.
            </p>
            <div className="flex flex-col gap-3">
              {[
                { number: '01', title: 'Perimeter Mapping & Scope Formulation', desc: 'No-cost initial host reconnaissance to map IP allocations, domains, and security gates.' },
                { number: '02', title: 'Passive Passive Assessment Phases', desc: 'Running non-intrusive signature lookups to document exposed ports or missing patches.' },
                { number: '03', title: 'Manual Exploitation Verification', desc: 'Executing certified ethical exploits to confirm authentic logical access routes.' },
                { number: '04', title: 'System Hardening & Co-managed Remediation', desc: 'Providing copy-ready configuration scripts, firewall templates, and rescan checking.' }
              ].map(step => (
                <div key={step.number} className="flex gap-4 items-start">
                  <span className="font-mono text-xs font-bold px-2 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded">{step.number}</span>
                  <div>
                    <h4 className="font-semibold text-sm leading-tight mb-1">{step.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div 
            className="p-8 rounded-2xl border backdrop-blur-md flex flex-col justify-between relative overflow-hidden" 
            style={{
              borderColor: isDark ? 'rgba(255,59,48,0.2)' : 'rgba(10,16,37,0.08)',
              background: isDark ? 'rgba(10,16,37,0.4)' : 'rgba(255,255,255,0.5)'
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
            <div className="flex flex-col gap-3">
              <span className="text-xs font-mono text-red-500 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                <Sparkles size={12} className="animate-pulse" />
                Guaranteed Support Contract
              </span>
              <h3 className="text-2xl font-extrabold tracking-tight">Enterprise Service Level SLA</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                We back our core monitoring services with strict contractual guarantees. If an alert correlates, our Dhaka security dispatch team responds within minutes to isolate networks or block connections.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-4 py-4 border-y border-dashed" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }}>
                <div>
                  <span className="block text-xs font-mono text-gray-400">Critical S1 Outbreak</span>
                  <span className="font-bold font-mono text-lg text-red-500">&lt; 2 Minutes</span>
                </div>
                <div>
                  <span className="block text-xs font-mono text-gray-400">Security Inquiries</span>
                  <span className="font-bold font-mono text-lg text-white" style={{ color: isDark ? 'white' : '#0a1025' }}>&lt; 30 Minutes</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-1">
              <p className="text-xs text-gray-400 italic">Need immediate VAPT scope verification for bank compliance or compliance checklist audits?</p>
              <button 
                onClick={() => navigate('/contact')}
                className="mt-3 text-sm font-mono tracking-wider font-semibold text-red-400 flex items-center gap-1 hover:gap-2 transition-all duration-300"
              >
                REQUEST SCOPE CONSULTATION <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
