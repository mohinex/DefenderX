import React from 'react';
import Layout from '../components/layout/Layout';
import About from '../components/About';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Target, Eye, Shield, Users, Mail, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const { isDark, socialLinks } = useApp();
  const navigate = useNavigate();

  return (
    <Layout activeRoute="/about" inConsoleMode={false}>
      <div className="w-full flex flex-col gap-16 max-w-7xl mx-auto px-6">
        
        {/* ABOUT PAGE INTRO BANNERS */}
        <section className="text-center max-w-3xl mx-auto flex flex-col gap-5 border-b pb-12" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF3B30] px-3 py-1 bg-[#FF3B30]/10 rounded-full border border-[#FF3B30]/20 inline-block mx-auto">
            OPERATED UNDER PRIVATE JURISDICTION
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Bangladesh’s Sovereign <span className="text-red-500">Security Command.</span>
          </h1>
          <p className="text-gray-400 leading-relaxed text-sm md:text-base">
            Eurosia Defender X is an enterprise cyber defense firm established to protect financial pipelines, government subnets, and critical business nodes from hostile actors. Engineered locally, responsive globally.
          </p>
        </section>

        {/* CORE INTERACTIVE ABOUT TABS SELECTOR COMPONENT */}
        <div className="w-full">
          <About isDark={isDark} socialLinks={socialLinks} />
        </div>

        {/* MISSION & VISION WITH HIGH END DECORATION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
          <div 
            className="p-8 rounded-2xl border backdrop-blur-md relative overflow-hidden flex flex-col gap-4"
            style={{
              borderColor: isDark ? 'rgba(77, 141, 255, 0.15)' : 'rgba(10, 16, 37, 0.08)',
              background: isDark ? 'rgba(10, 16, 37, 0.4)' : 'rgba(255, 255, 255, 0.5)'
            }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-400 mb-2 border border-blue-500/20">
              <Target size={20} />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Our Core Mission</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Our ultimate directive is to eliminate digital risk parameters for entities operating critical infrastructure in Bangladesh. We build permanent secure spaces by hardening logical networks, auditing codebases, training response analysts, and containing active outages in real-time.
            </p>
          </div>

          <div 
            className="p-8 rounded-2xl border backdrop-blur-md relative overflow-hidden flex flex-col gap-4"
            style={{
              borderColor: isDark ? 'rgba(255, 59, 48, 0.15)' : 'rgba(10, 16, 37, 0.08)',
              background: isDark ? 'rgba(10, 16, 37, 0.4)' : 'rgba(255, 255, 255, 0.5)'
            }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-500/10 text-red-500 mb-2 border border-red-500/20">
              <Eye size={20} />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Our Forward Vision</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              We envision a fully sovereign digital ecosystem in South Asia where corporate data fields are permanently shielded from foreign exfiltration vectors and ransomware disruptions. By creating world-class local talent pools, we eliminate single joints of failure in regional cyber postures.
            </p>
          </div>
        </section>

        {/* DHAKA HEADQUARTERS DIRECTORY INFO */}
        <section className="bg-gradient-to-r from-red-600/5 to-blue-600/5 p-8 sm:p-12 rounded-3xl border text-center flex flex-col md:flex-row items-center md:text-left gap-8 justify-between relative overflow-hidden"
          style={{ borderColor: isDark ? 'rgba(255, 59, 48, 0.2)' : 'rgba(10, 16, 37, 0.08)' }}>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-red-500 font-bold uppercase tracking-wider">VISIT THE DIRECT DISPATCH LAB</span>
            <h3 className="text-2xl font-bold tracking-tight">Dhaka Command headquarters</h3>
            <p className="text-sm text-gray-400 max-w-xl">
              Want plain, uncompromised transparency? Visitors are welcome to inspect our local physical SOC matrices in Gulshan, Dhaka under strict secure security clearance.
            </p>
            <div className="flex flex-wrap gap-4 mt-4 font-mono text-xs text-gray-300">
              <div className="flex items-center gap-1.5"><MapPin size={12} className="text-red-500" /> Gulshan-2, Dhaka, Bangladesh</div>
              <div className="flex items-center gap-1.5"><Phone size={12} className="text-[#FF3B30]" /> +880 1711 408725</div>
              <div className="flex items-center gap-1.5"><Mail size={12} className="text-blue-400" /> mohinexdev@gmail.com</div>
            </div>
          </div>
          <button 
            onClick={() => navigate('/contact')}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm transition-all duration-300 font-mono tracking-wider shadow-md text-center shrink-0 w-full md:w-auto"
          >
            MEET THE DEPLOYERS
          </button>
        </section>
      </div>
    </Layout>
  );
}
