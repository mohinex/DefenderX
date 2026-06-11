import React from 'react';
import Layout from '../components/layout/Layout';
import Contact from '../components/Contact';
import { useApp } from '../context/AppContext';
import { Mail, Phone, Calendar, Globe, MapPin } from 'lucide-react';

export default function ContactPage() {
  const { isDark, socialLinks } = useApp();

  return (
    <Layout activeRoute="/contact" inConsoleMode={false}>
      <div className="w-full flex flex-col gap-16 max-w-7xl mx-auto px-6">
        
        {/* CONTACT PAGE MAIN HERO HEAD */}
        <section className="text-center max-w-3xl mx-auto flex flex-col gap-5 border-b pb-12" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF3B30] px-3 py-1 bg-[#FF3B30]/10 rounded-full border border-[#FF3B30]/20 inline-block mx-auto font-black">
            DIRECT SECURITY DISPATCH
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Initiate Security <span className="text-red-500">Engagements.</span>
          </h1>
          <p className="text-gray-400 leading-relaxed text-sm md:text-base">
            Communicate directly with our local Dhaka operations lab. Whether you require immediate emergency ransomware incident response, a routine VAPT compliance audit, or SOC pricing scopes.
          </p>
        </section>

        {/* INTEGRACTIVE CONTACT FORM & QUOTE ESTIMATOR MODULE */}
        <div className="w-full">
          <Contact isDark={isDark} socialLinks={socialLinks} />
        </div>

        {/* QUICK CONTACT CHANNELS / FAQ OVERVIEW */}
        <section className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          <div 
            className="p-8 rounded-2xl border backdrop-blur-md flex flex-col gap-3"
            style={{
              borderColor: isDark ? 'rgba(77,141,255,0.15)' : 'rgba(10,16,37,0.08)',
              background: isDark ? 'rgba(10,16,37,0.45)' : 'rgba(255,255,255,0.45)'
            }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Calendar size={18} />
            </div>
            <h4 className="font-bold tracking-tight">Technical Consultations</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Prefer an direct, in-depth discussion about network topologies? Secure a virtual 30-minute consultation with a senior information security architect.
            </p>
            <p className="text-xs font-mono text-blue-400 font-semibold mt-auto cursor-pointer flex items-center gap-1.5 hover:underline">
              SECURE SCHEDULER &rarr;
            </p>
          </div>

          <div 
            className="p-8 rounded-2xl border backdrop-blur-md flex flex-col gap-3"
            style={{
              borderColor: isDark ? 'rgba(255,59,48,0.15)' : 'rgba(10,16,37,0.08)',
              background: isDark ? 'rgba(10,16,37,0.45)' : 'rgba(255,255,255,0.45)'
            }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/20">
              <Phone size={18} />
            </div>
            <h4 className="font-bold tracking-tight">Active Incident Response hotline</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Experiencing active server outages, host locker indicators, or exfiltration indicators? Ring our localized emergency SOC desk directly.
            </p>
            <p className="text-xs font-mono text-red-500 font-bold mt-auto">
              HOTLINE: +880 1711 408725
            </p>
          </div>

          <div 
            className="p-8 rounded-2xl border backdrop-blur-md flex flex-col gap-3"
            style={{
              borderColor: isDark ? 'rgba(0,200,83,0.15)' : 'rgba(10,16,37,0.08)',
              background: isDark ? 'rgba(10,16,37,0.45)' : 'rgba(255,255,255,0.45)'
            }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-500/10 text-green-400 border border-green-500/20">
              <Mail size={18} />
            </div>
            <h4 className="font-bold tracking-tight">Corporate Inquiries Group</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Need structured RFP bids, company portfolios, or regional reference clients? Our partner engagement desk will review and dispatch details promptly.
            </p>
            <p className="text-xs font-mono text-green-400 font-semibold mt-auto">
              EMAIL: mohinexdev@gmail.com
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
