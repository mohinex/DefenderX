import { useEffect, useState } from 'react';

interface BackgroundProps {
  isDark: boolean;
}

export default function Background({ isDark }: BackgroundProps) {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    // Just a subtle scroll-based drift
    const handleScroll = () => {
      setOffsetY(window.scrollY * 0.1);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden select-none pointer-events-none">
      {/* Radial bases */}
      <div 
        className="absolute inset-0 transition-all duration-700" 
        style={{
          background: isDark 
            ? 'radial-gradient(ellipse 80% 60% at 20% 50%, #0d0d2b 0%, #050816 75%)' 
            : 'radial-gradient(ellipse 80% 60% at 20% 50%, #e1e7f3 0%, #f0f2f8 75%)'
        }}
      />

      {/* Cyber Grid */}
      <div 
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(rgba(0, 87, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 87, 255, 0.04) 1px, transparent 1px)'
            : 'linear-gradient(rgba(0, 87, 255, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 87, 255, 0.06) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          transform: `translateY(${offsetY % 44}px)`
        }}
      />

      {/* Glow Blob 1 (Strategic Threat Indicator - Red) */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full transition-all duration-700 blur-[80px]"
        style={{
          background: isDark 
            ? 'radial-gradient(circle, rgba(255, 59, 48, 0.05) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 59, 48, 0.04) 0%, transparent 70%)',
          top: '-100px',
          left: '-100px',
          animation: 'drift1 20s ease-in-out infinite'
        }}
      />

      {/* Glow Blob 2 (Transceiver Flow - Blue) */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full transition-all duration-700 blur-[90px]"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(0, 87, 255, 0.06) 0%, transparent 75%)'
            : 'radial-gradient(circle, rgba(0, 87, 255, 0.04) 0%, transparent 75%)',
          bottom: '-120px',
          right: '15%',
          animation: 'drift2 25s ease-in-out infinite'
        }}
      />

      {/* Glow Blob 3 (Secondary Security Node - Cyan) */}
      <div 
        className="absolute w-[350px] h-[350px] rounded-full transition-all duration-700 blur-[60px]"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(77, 141, 255, 0.04) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(77, 141, 255, 0.03) 0%, transparent 70%)',
          top: '30%',
          right: '8%',
          animation: 'drift3 18s ease-in-out infinite'
        }}
      />

      {/* Scanning Transceiver Laser Line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#4D8DFF]/40 to-transparent animate-scanline" />

      {/* Inline styles for drifting keyframes if needed */}
      <style>{`
        @keyframes drift1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(60px, 40px) scale(1.1); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-50px, -30px) scale(0.9); }
        }
        @keyframes drift3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(30px, -40px) scale(1.05); }
        }
      `}</style>
    </div>
  );
}
