import { useEffect, useState } from 'react';
import { ArrowRight, ShieldAlert, Cpu, HeartPulse, HardDrive } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  isDark: boolean;
  onLaunchConsole: () => void;
}

export default function Hero({ isDark, onLaunchConsole }: HeroProps) {
  const [quarantined, setQuarantined] = useState(1284890);
  const [latency, setLatency] = useState(2.38);

  useEffect(() => {
    // Subtle real-time jitter simulation for operational realism
    const interval = setInterval(() => {
      setQuarantined(prev => prev + Math.floor(Math.random() * 3));
      setLatency(prev => {
        const jitter = (Math.random() * 0.1 - 0.05);
        return parseFloat(Math.min(2.8, Math.max(1.9, prev + jitter)).toFixed(2));
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="hero"
      className="relative z-10 w-full min-h-[calc(100vh-64px)] flex items-center justify-center py-12 md:py-16 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side Content */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left">
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full text-[9px] tracking-[2.5px] font-mono border self-start font-black bg-red-alert/10 border-red-alert/30 text-red-alert mb-5"
          >
            <ShieldAlert size={11} className="animate-pulse" />
            SECURE EXTRAPOLATION TUNNEL STATUS: OPTIMAL
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl font-black leading-none tracking-tight mb-6"
            style={{ color: isDark ? '#ffffff' : '#0a1025' }}
          >
            Autonomous <span className="text-red-alert font-black">XDR</span> &amp; <br />
            <span className="text-accent-blue font-black">Zero-Trust</span> Core Protection
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-sm md:text-base leading-relaxed max-w-[540px] mb-8"
            style={{ color: isDark ? '#B8C1D1' : '#4a5568' }}
          >
            Ensure resilient cybersecurity operations with the Eurosia Defender X framework. Automated volumetric threat dropping, active network sandboxing, and real-time SIEM reporting designed for modern enterprise perimeters.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4 mb-10"
          >
            <button 
              onClick={onLaunchConsole}
              className="px-6 py-3.5 rounded-lg text-white font-mono font-bold text-xs tracking-widest bg-gradient-to-r from-red-alert via-[#0057FF] to-[#4D8DFF] cursor-pointer hover:shadow-lg hover:shadow-blue-primary/20 transition-all duration-200 flex items-center gap-2 border-none"
            >
              <span>CONNECT SECURITY TERM</span>
              <ArrowRight size={13} />
            </button>
            <a 
              href="#services"
              className="px-6 py-3.5 rounded-lg border font-mono font-bold text-xs tracking-widest text-center transition-all duration-200 cursor-pointer"
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
              DISCOVER SOLUTION SETS
            </a>
          </motion.div>

          {/* Interactive Statistics Grid */}
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
              <div className="text-[10px] text-gray-500 tracking-wider mb-1 font-bold uppercase">THREATS ISOLATED</div>
              <div className="text-sm md:text-lg font-black text-red-alert font-bold">
                {quarantined.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 tracking-wider mb-1 font-bold uppercase">LATENCY PROFILE</div>
              <div className="text-sm md:text-lg font-black text-accent-blue font-bold">
                {latency} ms
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-500 tracking-wider mb-1 font-bold uppercase">SECURE UP-TIME</div>
              <div className="text-sm md:text-lg font-black text-green-alert font-bold">
                99.989%
              </div>
            </div>
          </motion.div>

        </div>

        {/* Right Side - Immersive Graphics Panel */}
        <div className="lg:col-span-5 flex justify-center items-center relative select-none">
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-2xl flex items-center justify-center"
          >
            {/* Holographic Glowing Rings */}
            <div 
              className="absolute inset-0 rounded-full border border-dashed transition-colors duration-450 animate-spin"
              style={{ 
                borderColor: isDark ? 'rgba(77, 141, 255, 0.18)' : 'rgba(10, 16, 37, 0.15)',
                animationDuration: '30s'
              }}
            />
            <div 
              className="absolute inset-8 rounded-full border border-dashed transition-colors duration-450 animate-pulse"
              style={{
                borderColor: isDark ? 'rgba(255, 59, 48, 0.12)' : 'rgba(255, 59, 48, 0.08)'
              }}
            />
            <div 
              className="absolute inset-16 rounded-full border border-double transition-colors duration-450"
              style={{
                borderColor: isDark ? 'rgba(0, 200, 83, 0.15)' : 'rgba(0, 200, 83, 0.08)'
              }}
            />

            {/* Shield Center Vector */}
            <div 
              className="relative w-40 h-40 filter drop-shadow-[0_0_24px_rgba(77,141,255,0.25)] flex items-center justify-center rounded-xl border bg-dark/20 text-accent-blue"
              style={{
                borderColor: isDark ? 'rgba(77, 141, 255, 0.25)' : 'rgba(10, 16, 37, 0.12)'
              }}
            >
              <svg className="w-20 h-20 text-[#0057FF]" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 4L8 14v18c0 14 10.4 27.1 24 30 13.6-2.9 24-16 24-30V14L32 4z" fill="rgba(0,87,255,0.08)" stroke={isDark ? '#4D8DFF' : '#0057FF'} strokeWidth="2.5"/>
                <path d="M32 14v30M20 28h24" stroke="rgba(255,59,48,0.7)" strokeWidth="1.8" className="animate-pulse" />
                <circle cx="32" cy="28" r="4" fill="#00C853" className="animate-ping" />
              </svg>
            </div>

            {/* Mini floating secure nodes widgets */}
            <div className="absolute top-4 left-6 border shadow bg-dark/70 rounded-lg p-2.5 flex items-center gap-2 border-white/5 font-mono text-[9px] text-[#00C853] font-bold">
              <Cpu size={12} className="text-accent-blue" />
              <span>CORE GATE_99 INTAC: Green</span>
            </div>

            <div className="absolute bottom-6 right-2 border shadow bg-dark/70 rounded-lg p-2.5 flex items-center gap-2 border-white/5 font-mono text-[9px] text-red-alert font-bold animate-pulse">
              <ShieldAlert size={12} className="text-red-alert" />
              <span>SYN FLOOD MITIGATED: DROP</span>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}
