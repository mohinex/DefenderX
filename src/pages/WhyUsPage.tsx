import React from 'react';
import Layout from '../components/layout/Layout';
import WhyUs from '../components/WhyUs';
import { useApp } from '../context/AppContext';
import { Star, Award, ShieldAlert, Cpu, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WhyUsPage() {
  const { isDark } = useApp();
  const navigate = useNavigate();

  return (
    <Layout activeRoute="/why-us" inConsoleMode={false}>
      <div className="w-full flex flex-col gap-16 max-w-7xl mx-auto px-6">
        
        {/* WHY US HERO HEADER */}
        <section className="text-center max-w-3xl mx-auto flex flex-col gap-5 border-b pb-12" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF3B30] px-3 py-1 bg-[#FF3B30]/10 rounded-full border border-[#FF3B30]/20 inline-block mx-auto">
            THE EUROSIA ADVANTAGE
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Why Trusted by <span className="text-red-500">Industry Leaders.</span>
          </h1>
          <p className="text-gray-400 leading-relaxed text-sm md:text-base">
            We don’t rely on default black-box scripts. Eurosia Defender X deploys custom, white-box tactical defenses and on-ground local support to keep your operations compliant and uncompromised.
          </p>
        </section>

        {/* CORE INTERACTIVE WHY US COMPONENT */}
        <div className="w-full">
          <WhyUs isDark={isDark} />
        </div>

        {/* STATISTICAL TRUST FACTORS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          <div 
            className="p-8 rounded-2xl border backdrop-blur-md relative overflow-hidden flex flex-col gap-3"
            style={{
              borderColor: isDark ? 'rgba(255,59,48,0.15)' : 'rgba(10,16,37,0.08)',
              background: isDark ? 'rgba(10,16,37,0.45)' : 'rgba(255,255,255,0.45)'
            }}
          >
            <div className="text-3xl font-mono font-extrabold text-red-500 flex items-center gap-2">
              <Award size={24} /> 100%
            </div>
            <h4 className="font-bold tracking-tight">Zero Intrusion Breakthroughs</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every single node governed by our central Shielder platform has achieved total immunity from critical data exfiltrations or ransomware hostage lockdowns.
            </p>
          </div>

          <div 
            className="p-8 rounded-2xl border backdrop-blur-md relative overflow-hidden flex flex-col gap-3"
            style={{
              borderColor: isDark ? 'rgba(77,141,255,0.15)' : 'rgba(10,16,37,0.08)',
              background: isDark ? 'rgba(10,16,37,0.45)' : 'rgba(255,255,255,0.45)'
            }}
          >
            <div className="text-3xl font-mono font-extrabold text-blue-400 flex items-center gap-2">
              <Cpu size={24} /> 24/7/365
            </div>
            <h4 className="font-bold tracking-tight">Dhaka Live SOC Support</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              We operate an undivided regional command team. Our analysts work on continuous, cascading rosters to ensure millisecond-level threat containment anytime.
            </p>
          </div>

          <div 
            className="p-8 rounded-2xl border backdrop-blur-md relative overflow-hidden flex flex-col gap-3"
            style={{
              borderColor: isDark ? 'rgba(0,200,83,0.15)' : 'rgba(10,16,37,0.08)',
              background: isDark ? 'rgba(10,16,37,0.45)' : 'rgba(255,255,255,0.45)'
            }}
          >
            <div className="text-3xl font-mono font-extrabold text-green-400 flex items-center gap-2">
              <BarChart2 size={24} /> 10x
            </div>
            <h4 className="font-bold tracking-tight">Faster Remediation Isolation</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Why wait hours for corporate help desks? Our security orchestration agents complete virtual system containment in average under 12 seconds.
            </p>
          </div>
        </section>

        {/* SECURE TRUST BANNER */}
        <section className="bg-gradient-to-r from-red-600/5 to-transparent p-10 rounded-3xl border text-center flex flex-col items-center gap-5 mt-4"
          style={{ borderColor: isDark ? 'rgba(255, 59, 48, 0.2)' : 'rgba(10, 16, 37, 0.08)' }}>
          <h3 className="text-2xl font-bold tracking-tight">Ready to Audit Your Cyber Infrastructure?</h3>
          <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
            Eurosia specialists are available to conduct full black-box reconnaissance tests on your domains and return a zero-commitments vulnerability scorecard.
          </p>
          <button 
            onClick={() => navigate('/contact')}
            className="mt-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-all duration-300 font-mono tracking-wider shadow-lg"
          >
            Formulate VAPT Scope
          </button>
        </section>
      </div>
    </Layout>
  );
}
