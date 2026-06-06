import { useEffect, useState } from 'react';
import { Check, ShieldAlert, Cpu, Network } from 'lucide-react';
import { motion } from 'motion/react';

interface SuccessViewProps {
  user: any;
  onRedirectComplete: () => void;
}

export default function SuccessView({ user, onRedirectComplete }: SuccessViewProps) {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);

  const stages = [
    'ESTABLISHING ENCRYPTED TRANSCEIVER HANDSHAKE...',
    'SYNCHRONIZING SECURE TUNNEL CONFIGURATION...',
    'INJECTING HIGH-INTENSITY SECURE AGENT CONTROLS...',
    'TUNNEL ALIGNMENT SUCCESSFUL - REDIRECTING NOW!'
  ];

  useEffect(() => {
    // Stage transition timer
    const stageTimer = setInterval(() => {
      setStageIndex((prev) => (prev < stages.length - 1 ? prev + 1 : prev));
    }, 800);

    // Progress bar smooth 3-second simulation
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => {
            onRedirectComplete();
          }, 350);
          return 100;
        }
        return prev + 1.25;
      });
    }, 30);

    return () => {
      clearInterval(stageTimer);
      clearInterval(progressTimer);
    };
  }, [stages.length, onRedirectComplete]);

  return (
    <div className="w-full max-w-sm text-center py-6 select-none">
      
      {/* SHIELD AUTH ACTIVE INDICATOR */}
      <motion.div 
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: [1.1, 0.95, 1], opacity: 1 }}
        transition={{ duration: 0.55 }}
        className="relative w-18 h-18 bg-[#00C853]/10 border-2 border-green-alert rounded-full flex items-center justify-center mx-auto mb-5"
      >
        <div className="absolute inset-0 rounded-full animate-ping bg-[#00C853]/15 opacity-60" style={{ animationDuration: '2s' }} />
        <Check size={30} className="text-green-alert" />
      </motion.div>

      {/* REASSURING SECOPS VERITY HEAD */}
      <motion.h3 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-display font-black text-2xl text-green-alert mb-2 uppercase tracking-wide"
      >
        Access Granted
      </motion.h3>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs text-gray-500 leading-relaxed mb-6 gap-0.5 flex flex-col"
      >
        <div>Identity verified. Secure transceiver tunnel established.</div>
        <div>Welcome, <strong className="text-white bg-blue-primary/30 px-1.5 py-0.5 rounded text-[11px] uppercase tracking-wider">{user.name}</strong>.</div>
        <div>Establishing military-grade terminal console mapping...</div>
      </motion.div>

      {/* Progress Ticker Status indicators */}
      <div className="w-full text-center">
        <div className="bg-green-alert/15 rounded-full h-[6px] overflow-hidden mb-3.5 border border-green-alert/25 max-w-[260px] mx-auto">
          <div 
            className="h-full bg-green-alert shadow-[0_0_8px_var(--color-green-alert)] transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Tactical operations progress text */}
        <div className="font-mono text-[9px] text-[#00C853] font-bold tracking-[1.5px] uppercase">
          {stages[stageIndex]}
        </div>
      </div>
    </div>
  );
}
