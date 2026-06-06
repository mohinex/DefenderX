import React, { useState } from 'react';
import { Mail, Landmark, Send, CheckCircle2, Shield, Settings2, ShieldCheck, DollarSign, Facebook, Twitter, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerSecOpsToast } from './ToastContainer';

interface ContactProps {
  isDark: boolean;
  socialLinks?: { facebook: string; twitter: string; linkedin: string };
}

export default function Contact({ isDark, socialLinks }: ContactProps) {
  // Quote States
  const [endpoints, setEndpoints] = useState(25);
  const [bandwidth, setBandwidth] = useState('10_100_TB');
  const [shieldTier, setShieldTier] = useState('SHIELDED');

  // Contact States
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Quote algorithm
  const calculateQuote = () => {
    let base = endpoints * 75;
    
    // Bandwidth scale factor
    if (bandwidth === 'UNDER_10_TB') base += 250;
    else if (bandwidth === '10_100_TB') base += 750;
    else base += 2200;

    // Protection tier factor
    if (shieldTier === 'STANDARD') base *= 1.0;
    else if (shieldTier === 'SHIELDED') base *= 1.35;
    else base *= 1.85;

    return Math.round(base);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !company.trim()) {
      triggerSecOpsToast('DISPATCH REJECTED\nEmail and company name fields are strictly required.', 'blocked');
      return;
    }

    setIsLoading(true);

    // Simulated secure dispatch sequence
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setEmail('');
        setCompany('');
        setMessage('');
      }, 5000);
    }, 1500);
  };

  return (
    <section 
      id="contact"
      className="relative z-10 py-20 border-t select-none transition-colors duration-450"
      style={{
        borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(10, 16, 37, 0.08)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="text-accent-blue font-mono font-bold tracking-[3px] text-[10px] uppercase mb-3">
            ACQUIRE DEFENSE SHIELDING
          </div>
          <h2 
            className="font-display font-black text-3xl sm:text-4xl tracking-tight mb-4"
            style={{ color: isDark ? '#ffffff' : '#050816' }}
          >
            Formulate Your Custom SecOps Budget Plan
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans">
            Input endpoint specifications to calculate direct pricing estimations or communicate with an authentication dispatcher.
          </p>
        </div>

        {/* 2 Column Interactive Grid Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Quote Calculator Sandbox */}
          <div 
            className="lg:col-span-7 border p-6 sm:p-8 rounded-2xl flex flex-col justify-between"
            style={{
              borderColor: isDark ? 'rgba(77, 141, 255, 0.15)' : 'rgba(10, 16, 37, 0.12)',
              backgroundColor: isDark ? 'rgba(10, 16, 37, 0.45)' : 'rgba(255, 255, 255, 0.5)'
            }}
          >
            <div>
              <div className="flex items-center gap-2 mb-6 text-accent-blue border-b pb-3" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)' }}>
                <Settings2 size={16} />
                <h3 className="font-display font-black text-xs uppercase tracking-wide">
                  SECURE VALUE CONVENER
                </h3>
              </div>

              {/* Endpoints Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs font-mono font-bold mb-2">
                  <span className="text-gray-400">SERVER &amp; NETWORK ENDPOINTS</span>
                  <span className="text-red-alert font-black">{endpoints} NODES</span>
                </div>
                <input 
                  type="range"
                  min="5"
                  max="400"
                  value={endpoints}
                  onChange={(e) => setEndpoints(parseInt(e.target.value))}
                  className="w-full h-1 bg-red-alert/15 rounded-lg appearance-none cursor-ew-resize accent-red-alert outline-none"
                />
                <div className="flex justify-between text-[9px] font-mono text-gray-500 mt-1">
                  <span>5 NODES</span>
                  <span>400 NODES</span>
                </div>
              </div>

              {/* Packet Bandwidth */}
              <div className="mb-6">
                <label className="block text-[9px] font-mono tracking-wider text-gray-400 font-extrabold mb-2 uppercase">
                  MONTHLY TELEMETRY DATA VOLUME
                </label>
                <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                  {[
                    { value: 'UNDER_10_TB', label: 'Under 10 TB' },
                    { value: '10_100_TB', label: '10 - 100 TB' },
                    { value: 'OVER_100_TB', label: '100+ TB Data' }
                  ].map(item => (
                    <button
                      key={item.value}
                      onClick={() => setBandwidth(item.value)}
                      className={`py-2 px-2.5 rounded border tracking-wide cursor-pointer transition-colors outline-none text-[10px] ${
                        bandwidth === item.value 
                          ? 'bg-[#0057FF]/15 text-accent-blue border-accent-blue font-bold shadow-inner' 
                          : 'border-white/5 hover:bg-white/5'
                      }`}
                      style={{
                        borderColor: bandwidth === item.value ? 'var(--color-accent-blue)' : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(10,16,37,0.1)'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Protective Shield configuration choices */}
              <div className="mb-6">
                <label className="block text-[9px] font-mono tracking-wider text-gray-400 font-extrabold mb-2 uppercase">
                  PERIMETER COMPLIANCE SHIELD Tier
                </label>
                <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                  {[
                    { value: 'STANDARD', label: 'Standard Shield' },
                    { value: 'SHIELDED', label: 'Shielded Active' },
                    { value: 'LOCKDOWN', label: '24/7 Managed SOC' }
                  ].map(item => (
                    <button
                      key={item.value}
                      onClick={() => setShieldTier(item.value)}
                      className={`py-2 px-2.5 rounded border tracking-wide cursor-pointer transition-colors outline-none text-[10px] ${
                        shieldTier === item.value 
                          ? 'bg-[#0057FF]/15 text-accent-blue border-accent-blue font-bold shadow-inner' 
                          : 'border-white/5 hover:bg-white/5'
                      }`}
                      style={{
                        borderColor: shieldTier === item.value ? 'var(--color-accent-blue)' : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(10,16,37,0.1)'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Quote Box footer */}
            <div 
              className="mt-6 p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{
                borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)',
                backgroundColor: isDark ? 'rgba(5, 8, 22, 0.4)' : 'rgba(0,0,0,0.02)'
              }}
            >
              <div>
                <h4 className="font-display font-black text-xs text-accent-blue uppercase tracking-wide mb-0.5">
                  BUDGET LICENSING ESTIMATION
                </h4>
                <p className="text-[10px] text-gray-500 font-sans">
                  *Quote is calculated using simulated perimeter parameters.
                </p>
              </div>

              <div className="flex items-center text-2xl sm:text-3xl font-mono font-black text-green-alert">
                <span className="text-lg pr-0.5">$</span>
                <span>{calculateQuote().toLocaleString()}</span>
                <span className="text-xs font-normal text-gray-400 font-sans pl-1.5">/ mo</span>
              </div>
            </div>

          </div>

          {/* Right Column: Submission Form */}
          <div 
            className="lg:col-span-12 xl:col-span-5 lg:col-span-5 border p-6 sm:p-8 rounded-2xl flex flex-col justify-center"
            style={{
              borderColor: isDark ? 'rgba(77, 141, 255, 0.15)' : 'rgba(10, 16, 37, 0.12)',
              backgroundColor: isDark ? 'rgba(10, 16, 37, 0.45)' : 'rgba(255, 255, 255, 0.5)'
            }}
          >
            <div className="flex items-center gap-2 mb-6 text-red-alert border-b pb-3" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)' }}>
              <Shield size={16} className="animate-pulse" />
              <h3 className="font-display font-black text-xs uppercase tracking-wide">
                DISPATCH SECURITY COMMUNICATIONS
              </h3>
            </div>

            <AnimatePresence mode="wait">
              {!isSent ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleContactSubmit} 
                  className="space-y-4 text-xs font-sans"
                >
                  {/* Company Name */}
                  <div>
                    <label className="block text-[9px] font-mono tracking-widest font-bold text-gray-400 mb-1.5 uppercase">
                      COMPANY NAME
                    </label>
                    <input 
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Eurosia Enterprise Industries"
                      className="w-full bg-black/20 border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:border-red-alert text-xs text-white"
                    />
                  </div>

                  {/* Corporate Email */}
                  <div>
                    <label className="block text-[9px] font-mono tracking-widest font-bold text-gray-400 mb-1.5 uppercase">
                      CORPORATE EMAIL ADDRESS
                    </label>
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="compliance@yourfirm.com"
                      className="w-full bg-black/20 border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:border-red-alert text-xs text-white"
                    />
                  </div>

                  {/* Message prompt */}
                  <div>
                    <label className="block text-[9px] font-mono tracking-widest font-bold text-gray-400 mb-1.5 uppercase">
                      MESSAGE ENCRYPT DETAILS
                    </label>
                    <textarea 
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Detail endpoints or compliance standards of interest..."
                      className="w-full bg-black/20 border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:border-red-alert text-xs text-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 font-display text-xs font-bold tracking-widest text-[#fff] bg-gradient-to-r from-red-alert via-[#0057FF] to-[#4D8DFF] rounded-lg cursor-pointer transform active:scale-99 hover:brightness-105 transition-all duration-200 flex items-center justify-center gap-2 border-none"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>DISPATCHING SECURE TUNNEL...</span>
                      </>
                    ) : (
                      <>
                        <span>TRANSMIT SECURITY DISPATCH</span>
                        <Send size={13} />
                      </>
                    )}
                  </button>

                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-14 h-14 bg-[#00C853]/10 border-2 border-[#00C853] rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle2 size={24} className="text-[#00C853]" />
                  </div>
                  <h4 className="font-display font-black text-lg text-green-alert uppercase tracking-wide mb-1.5">
                    Dispatch Authenticated
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-sans px-4">
                    Secure envelope packet transmitted. An authentication specialist will establish contact on the specified corporate transceiver.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

        {/* Dynamic Social Connection Outpost Status Bar */}
        <div 
          className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl border backdrop-blur-md animate-fade-in text-xs font-mono"
          style={{
            borderColor: isDark ? 'rgba(77, 141, 255, 0.15)' : 'rgba(10, 16, 37, 0.08)',
            backgroundColor: isDark ? 'rgba(10, 16, 37, 0.35)' : 'rgba(255, 255, 255, 0.45)'
          }}
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
            <span className="font-display font-black text-[11px] tracking-widest text-[#4D8DFF] uppercase">
              SECURE PUBLIC OUTPOSTS ACTIVE
            </span>
          </div>

          <div className="flex gap-4 items-center">
            <a 
              href={socialLinks?.facebook || "https://www.facebook.com/EurosiaOfficial"} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'rgba(25, 110, 240, 0.04)',
                border: '1px solid rgba(25, 110, 240, 0.15)',
                color: isDark ? '#fff' : '#050816',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(25, 110, 240, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(25, 110, 240, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(25, 110, 240, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(25, 110, 240, 0.15)';
              }}
              title="Official Facebook Secure Access"
            >
              <Facebook size={12} className="text-[#1877F2]" />
              <span className="font-sans text-[11px]">Facebook</span>
            </a>

            <a 
              href={socialLinks?.twitter || "https://x.com/EurosiaOfficial"} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'rgba(29, 161, 242, 0.04)',
                border: '1px solid rgba(29, 161, 242, 0.15)',
                color: isDark ? '#fff' : '#050816',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(29, 161, 242, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(29, 161, 242, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(29, 161, 242, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(29, 161, 242, 0.15)';
              }}
              title="Official X / Twitter Access"
            >
              <Twitter size={12} className="text-[#1DA1F2]" />
              <span className="font-sans text-[11px]">X / Twitter</span>
            </a>

            <a 
              href={socialLinks?.linkedin || "https://linkedin.com/in/EurosiaOfficial"} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'rgba(10, 102, 194, 0.04)',
                border: '1px solid rgba(10, 102, 194, 0.15)',
                color: isDark ? '#fff' : '#050816',
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(10, 102, 194, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(10, 102, 194, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(10, 102, 194, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(10, 102, 194, 0.15)';
              }}
              title="Official LinkedIn Secure Identity"
            >
              <Linkedin size={12} className="text-[#0A66C2]" />
              <span className="font-sans text-[11px]">LinkedIn</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
