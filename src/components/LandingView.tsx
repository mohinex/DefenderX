import { Shield, Eye, Lock, Activity, EyeOff, Check, HeartPulse, Search, HelpCircle, HardDrive } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingViewProps {
  isDark: boolean;
}

export default function LandingView({ isDark }: LandingViewProps) {
  return (
    <div className="flex flex-col justify-center h-full max-w-xl mx-auto py-8 lg:py-12 px-6 lg:px-8 select-none z-10">
      
      {/* BRAND HEADER MODULE */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-4 mb-8"
      >
        {/* Holographic Shield Logo */}
        <div className="relative w-16 h-16 group flex-shrink-0">
          {/* Back glows for brand impact */}
          <div className="absolute inset-0 bg-red-alert/15 blur-md rounded-lg group-hover:bg-red-alert/25 transition-all duration-300" />
          <svg className="w-full h-full drop-shadow-[0_0_12px_rgba(255,59,48,0.3)] transition-transform duration-500 group-hover:scale-105" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 4L8 14v18c0 14 10.4 27.1 24 30 13.6-2.9 24-16 24-30V14L32 4z" fill="rgba(255,59,48,0.12)" stroke="#FF3B30" strokeWidth="1.6"/>
            <path d="M32 4L8 14v18c0 14 10.4 27.1 24 30 13.6-2.9 24-16 24-30V14L32 4z" fill="rgba(0,87,255,0.06)" stroke="#0057FF" strokeWidth="1" opacity=".4" transform="translate(2,2)"/>
            <text x="32" y="42" textAnchor="middle" className="font-display text-[22px] font-black" fill="#FF3B30">X</text>
            <circle cx="32" cy="22" r="2.8" fill="#4D8DFF" className="animate-pulse" />
            <line x1="26" y1="30" x2="38" y2="30" stroke="#4D8DFF" strokeWidth="1.5" opacity=".6"/>
            <line x1="22" y1="36" x2="42" y2="36" stroke="#FF3B30" strokeWidth="1.2" opacity=".5"/>
          </svg>
        </div>

        <div className="flex flex-col">
          <h1 className="font-display text-2xl font-black tracking-widest leading-none select-none">
            <span className={isDark ? 'text-white' : 'text-slate-900'}>EUROSIA </span>
            <br />
            <span className={isDark ? 'text-white' : 'text-slate-900'}>DEFENDER </span>
            <span className="text-red-alert">X</span>
          </h1>
          <span className="text-[9px] tracking-[4px] font-mono mt-1 text-accent-blue font-bold">
            — CYBER SECURITY PLATFORM —
          </span>
        </div>
      </motion.div>

      {/* SECURE TAG */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="inline-flex self-start items-center gap-2 px-3.5 py-1 rounded-full text-[10px] tracking-widest font-mono border font-semibold select-none bg-blue-primary/10 border-accent-blue/35 text-accent-blue mb-6"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-blue"></span>
        </span>
        NEXT-GENERATION SECOPS PLATFORM
      </motion.div>

      {/* HERO HERO TITLE */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="font-display text-4xl sm:text-5xl font-black tracking-tight leading-[1.08] mb-5 select-none"
      >
        <div className={isDark ? 'text-white font-black' : 'text-slate-900 font-black'}>PROTECT. DETECT.</div>
        <div className="text-red-alert font-black">DEFEND.</div>
        <div className="text-accent-blue font-black">MONITOR.</div>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-sm leading-relaxed max-w-[440px] mb-8 transition-colors duration-450"
        style={{ color: isDark ? '#B8C1D1' : '#4a5568' }}
      >
        Next-Generation Cyber Security Platform for a Safer Digital World. Real-time threat detection, autonomous defense, and unified security operations center.
      </motion.p>

      {/* CORE CAPABILITIES GRID */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-2 xs:grid-cols-4 max-w-[450px] border rounded-xl overflow-hidden mt-2 select-none"
        style={{
          borderColor: isDark ? 'rgba(77, 141, 255, 0.15)' : 'rgba(10, 16, 37, 0.12)'
        }}
      >
        {/* Item 1 */}
        <div 
          className="p-4 text-center border-r transition-all duration-200 hover:bg-red-alert/5 cursor-default flex flex-col items-center justify-between"
          style={{ borderColor: isDark ? 'rgba(77, 141, 255, 0.15)' : 'rgba(10, 16, 37, 0.12)' }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-alert/15 border border-red-alert/30 mb-2">
            <Shield size={18} className="text-red-alert" />
          </div>
          <div className="font-display font-extrabold text-[11px] tracking-wide text-red-alert mb-1">PROTECT</div>
          <div className="text-[10px] text-gray-500 leading-tight">Systems & Networks</div>
        </div>

        {/* Item 2 */}
        <div 
          className="p-4 text-center border-r transition-all duration-200 hover:bg-blue-primary/5 cursor-default flex flex-col items-center justify-between"
          style={{ borderColor: isDark ? 'rgba(77, 141, 255, 0.15)' : 'rgba(10, 16, 37, 0.12)' }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-primary/15 border border-blue-primary/30 mb-2">
            <Search size={18} className="text-accent-blue font-bold" />
          </div>
          <div className="font-display font-extrabold text-[11px] tracking-wide text-accent-blue mb-1">DETECT</div>
          <div className="text-[10px] text-gray-500 leading-tight">Threats 24/7</div>
        </div>

        {/* Item 3 */}
        <div 
          className="p-4 text-center border-r transition-all duration-200 hover:bg-green-alert/5 cursor-default flex flex-col items-center justify-between"
          style={{ borderColor: isDark ? 'rgba(77, 141, 255, 0.15)' : 'rgba(10, 16, 37, 0.12)' }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-alert/15 border border-green-alert/30 mb-2">
            <Lock size={18} className="text-green-alert" />
          </div>
          <div className="font-display font-extrabold text-[11px] tracking-wide text-green-alert mb-1 font-black">DEFEND</div>
          <div className="text-[10px] text-gray-500 leading-tight block">Data & Assets</div>
        </div>

        {/* Item 4 */}
        <div 
          className="p-4 text-center transition-all duration-200 hover:bg-accent-blue/5 cursor-default flex flex-col items-center justify-between"
          style={{ borderColor: isDark ? 'rgba(77, 141, 255, 0.15)' : 'rgba(10, 16, 37, 0.12)' }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-accent-blue/15 border border-accent-blue/30 mb-2">
            <Activity size={18} className="text-accent-blue" />
          </div>
          <div className="font-display font-extrabold text-[11px] tracking-wide text-accent-blue mb-1">MONITOR</div>
          <div className="text-[10px] text-gray-500 leading-tight">SOC operations</div>
        </div>
      </motion.div>
    </div>
  );
}
