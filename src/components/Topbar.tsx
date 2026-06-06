import { useEffect, useState } from 'react';
import { Sun, Moon, Globe, Shield, Terminal, Clock, Lock } from 'lucide-react';

interface TopbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  loggedInUser: any;
  onLogout?: () => void;
}

export default function Topbar({ isDark, onToggleTheme, loggedInUser, onLogout }: TopbarProps) {
  const [utcTime, setUtcTime] = useState<string>('');
  const [langDropdown, setLangDropdown] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const languages = ['English', 'Français', 'Deutsch', 'Español', '日本語'];

  return (
    <header 
      id="topbar-container"
      className="relative z-10 h-11 border-b transition-colors duration-300 flex items-center justify-between px-4 sm:px-7 backdrop-blur-md"
      style={{
        backgroundColor: isDark ? 'rgba(5, 8, 22, 0.92)' : 'rgba(240, 242, 248, 0.92)',
        borderColor: isDark ? 'rgba(77, 141, 255, 0.18)' : 'rgba(10, 16, 37, 0.12)'
      }}
    >
      {/* Left Area - SecOps Active Transceiver */}
      <div className="flex items-center gap-2 sm:gap-3.5 font-mono text-[10px] sm:text-xs tracking-wider select-none">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-alert opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-alert"></span>
        </span>
        <span className="hidden xs:inline" style={{ color: isDark ? '#4D8DFF' : '#0057FF' }}>
          {loggedInUser 
            ? `SESSION VERIFIED // OPERATOR: ${loggedInUser.name.toUpperCase()}`
            : 'SECURE TRANSCEIVER LOCK // DIRECT TUNNEL ACTIVE'
          }
        </span>
        <span className="inline xs:hidden" style={{ color: isDark ? '#4D8DFF' : '#0057FF' }}>
          {loggedInUser ? 'SESSION ACTIVE' : 'TUNNEL ACTIVE'}
        </span>
      </div>

      {/* Right Area - Theme / Lang / Clock */}
      <div className="flex items-center gap-3 sm:gap-4 select-none">
        {/* UTC Clock */}
        <div className="hidden md:flex items-center gap-1.5 font-mono text-[11px] text-gray-500">
          <Clock size={12} className="text-gray-400" />
          <span>{utcTime}</span>
        </div>

        {/* Theme Toggler */}
        <button 
          id="theme-toggler-btn"
          onClick={onToggleTheme}
          title="Toggle high-contrast protective color mode"
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-wider cursor-pointer border transition-all duration-200"
          style={{
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(10, 16, 37, 0.05)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(10, 16, 37, 0.15)',
            color: isDark ? '#B8C1D1' : '#4a5568'
          }}
        >
          {isDark ? (
            <>
              <Moon size={11} className="text-yellow-400" />
              <span>DARK</span>
            </>
          ) : (
            <>
              <Sun size={11} className="text-amber-500" />
              <span>LIGHT</span>
            </>
          )}
        </button>

        {/* Language selector */}
        <div className="relative">
          <button 
            id="lang-select-btn"
            onClick={() => setLangDropdown(!langDropdown)}
            className="flex items-center gap-1.5 px-3 py-1 rounded border text-xs font-mono cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(10, 16, 37, 0.05)',
              borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(10, 16, 37, 0.15)',
              color: isDark ? '#B8C1D1' : '#4a5568'
            }}
          >
            <Globe size={11} />
            <span>{currentLang}</span>
            <span className="text-[9px]">▼</span>
          </button>

          {langDropdown && (
            <div 
              className="absolute right-0 mt-1 w-28 rounded shadow-lg border z-50 overflow-hidden text-xs font-mono"
              style={{
                backgroundColor: isDark ? '#0A1025' : '#ffffff',
                borderColor: isDark ? '#1a2654' : '#cbd5e1',
                color: isDark ? '#fff' : '#334155'
              }}
            >
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => {
                    setCurrentLang(lang);
                    setLangDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 transition-colors hover:bg-blue-primary/10 block"
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Exit Tunnel Session Button */}
        {loggedInUser && (
          <button 
            onClick={onLogout}
            className="px-2.5 py-1 bg-red-alert text-white rounded text-xs font-mono font-semibold tracking-wider cursor-pointer hover:bg-red-alert/80 transition-all duration-150"
          >
            LOGOUT
          </button>
        )}
      </div>
    </header>
  );
}
