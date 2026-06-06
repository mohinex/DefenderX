import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Background from './components/Background';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import WhyUs from './components/WhyUs';
import Contact from './components/Contact';
import LandingView from './components/LandingView';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SuccessView from './components/SuccessView';
import DashboardView from './components/DashboardView';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import SeoManager from './components/SeoManager';

const safeDecodeToken = (token: string): any | null => {
  try {
    if (!token) return null;
    if (token.includes('.')) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    }
    return JSON.parse(atob(token));
  } catch (e) {
    return null;
  }
};

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(true); // Default to dark mode for elite visual appeal
  const [mode, setMode] = useState<'website' | 'console'>('website');

  const [socialLinks, setSocialLinks] = useState({
    facebook: 'https://www.facebook.com/EurosiaOfficial',
    twitter: 'https://x.com/EurosiaOfficial',
    linkedin: 'https://linkedin.com/in/EurosiaOfficial'
  });

  // Pull social profiles dynamically from global SEO settings or default back to official ones
  useEffect(() => {
    fetch('/api/v1/seo/public/config')
      .then(res => res.json())
      .then(data => {
        if (data && data.global) {
          setSocialLinks({
            facebook: data.global.facebookUrl || 'https://www.facebook.com/EurosiaOfficial',
            twitter: data.global.twitterUrl || 'https://x.com/EurosiaOfficial',
            linkedin: data.global.linkedinUrl || 'https://linkedin.com/in/EurosiaOfficial'
          });
        }
      })
      .catch(() => {});
  }, []);

  const [activeRoute, setActiveRoute] = useState<string>(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const cleanHash = hash.replace(/^#\/?/, '');
    if (['services', 'about', 'why-us', 'contact'].includes(cleanHash)) {
      return cleanHash;
    }
    if (cleanHash === 'console') {
      return 'console';
    }
    return 'home';
  });

  // Synchronize router on URL hash change events
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const cleanHash = hash.replace(/^#\/?/, '').toLowerCase();

      if (['services', 'about', 'why-us', 'contact'].includes(cleanHash)) {
        setActiveRoute(cleanHash);
        setMode('website');
      } else if (['console', 'login', 'register', 'dashboard', 'profile', 'admin', 'seo-settings'].includes(cleanHash)) {
        setActiveRoute(cleanHash);
        setMode('console');
        if (cleanHash === 'register') {
          setStage('register');
        } else if (cleanHash === 'login') {
          setStage('login');
        } else {
          const token = localStorage.getItem('eurosia_token');
          if (!token) {
            window.location.hash = '#login';
            setStage('login');
          } else {
            setStage('dashboard');
          }
        }
      } else {
        setActiveRoute('home');
        setMode('website');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run once initially on mount

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const [loggedInUser, setLoggedInUser] = useState<any>(() => {
    try {
      const token = localStorage.getItem('eurosia_token');
      if (token) {
        const decoded = safeDecodeToken(token);
        if (decoded && decoded.exp > Date.now()) {
          return decoded;
        }
        localStorage.removeItem('eurosia_token');
      }
    } catch (e) {
      localStorage.removeItem('eurosia_token');
    }
    return null;
  });

  const [stage, setStage] = useState<'login' | 'register' | 'success' | 'dashboard'>(() => {
    // If user token is already valid on load, keep dashboard state ready for routing
    const token = localStorage.getItem('eurosia_token');
    if (token) {
      try {
        const decoded = safeDecodeToken(token);
        if (decoded && decoded.exp > Date.now()) {
          const hash = typeof window !== 'undefined' ? window.location.hash.replace(/^#\/?/, '').toLowerCase() : '';
          if (hash === 'register') return 'register';
          if (hash === 'login') return 'login';
          return 'dashboard';
        }
      } catch (e) {}
    }
    const hash = typeof window !== 'undefined' ? window.location.hash.replace(/^#\/?/, '').toLowerCase() : '';
    if (hash === 'register') return 'register';
    return 'login';
  });

  // Listen for unauthorized events to redirect to login
  useEffect(() => {
    const handleUnauthorized = () => {
      handleLogout();
    };
    window.addEventListener('secops-unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('secops-unauthorized', handleUnauthorized);
    };
  }, []);

  // Apply root variables depending on isDark state
  useEffect(() => {
    if (!isDark) {
      document.documentElement.style.setProperty('--dark', '#f0f2f8');
      document.documentElement.style.setProperty('--navy', '#e8ecf5');
      document.documentElement.style.setProperty('--white', '#0A1025');
      document.documentElement.style.setProperty('--gray', '#4a5568');
      document.documentElement.style.setProperty('--card-bg', 'rgba(232,236,245,0.9)');
    } else {
      document.documentElement.style.setProperty('--dark', '#050816');
      document.documentElement.style.setProperty('--navy', '#0A1025');
      document.documentElement.style.setProperty('--white', '#FFFFFF');
      document.documentElement.style.setProperty('--gray', '#B8C1D1');
      document.documentElement.style.setProperty('--card-bg', 'rgba(10,16,37,0.85)');
    }
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const handleLoginSuccess = (user: any) => {
    setLoggedInUser(user);
    setStage('success');
  };

  const handleRedirectComplete = () => {
    setStage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('eurosia_token');
    setLoggedInUser(null);
    setStage('login');
    window.location.hash = '#login';
  };

  return (
    <div 
      className="min-h-screen font-sans flex flex-col justify-between transition-colors duration-500 overflow-x-hidden relative"
      style={{
        backgroundColor: isDark ? '#050816' : '#f0f2f8',
        color: isDark ? '#ffffff' : '#0a1025'
      }}
    >
      {/* GLOWING AMBIENT NEON CYBER VECTOR BACKGROUNDS */}
      <Background isDark={isDark} />

      {/* SEC-OPS FLOATING STATUS TOAST CENTER */}
      <ToastContainer />

      {/* DYNAMIC METADATA HEAD MANAGER AND SOCIAL GRAPH WRITER */}
      <SeoManager activeRoute={activeRoute} inConsoleMode={mode === 'console'} />

      {/* NEW INTEGRATIVE NAVIGATION BAR WITH SCROLL EMBEDDING */}
      <Navbar 
        isDark={isDark} 
        onToggleTheme={handleToggleTheme} 
        onLaunchConsole={() => { window.location.hash = '#console'; }}
        inConsoleMode={mode === 'console'}
        onExitConsole={() => { window.location.hash = '#home'; }}
        activeRoute={activeRoute}
        socialLinks={socialLinks}
        loggedInUser={loggedInUser}
        onLogout={handleLogout}
      />

      {/* DYNAMIC VIEW ROUTING MAIN BODY */}
      <main className="flex-1 relative z-10 w-full flex flex-col justify-center py-16 sm:py-20">
        {mode === 'website' ? (
          /* PRIMARY CORPORATE SOLUTIONS INFRASTRUCTURE */
          <div className="w-full flex flex-col">
            <AnimatePresence mode="wait">
              {activeRoute === 'home' && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <Hero isDark={isDark} onLaunchConsole={() => { window.location.hash = '#console'; }} />
                </motion.div>
              )}
              {activeRoute === 'services' && (
                <motion.div
                  key="services"
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.25 }}
                  className="w-full"
                >
                  <Services isDark={isDark} />
                </motion.div>
              )}
              {activeRoute === 'about' && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="w-full"
                >
                  <About isDark={isDark} socialLinks={socialLinks} />
                </motion.div>
              )}
              {activeRoute === 'why-us' && (
                <motion.div
                  key="why-us"
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.99 }}
                  transition={{ duration: 0.25 }}
                  className="w-full"
                >
                  <WhyUs isDark={isDark} />
                </motion.div>
              )}
              {activeRoute === 'contact' && (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="w-full"
                >
                  <Contact isDark={isDark} socialLinks={socialLinks} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* OPERATIONAL SECOPS TERMINAL DIRECT TUNNEL */
          <div className="w-full">
            {stage !== 'dashboard' ? (
              /* TWO COLUMN GRAPHICAL SPLIT SCREEN (Login + Success Handshake) */
              <div className="grid grid-cols-1 lg:grid-cols-12 w-full max-w-7xl mx-auto items-stretch py-8 sm:py-12">
                {/* Left structural presentation banner */}
                <div className="lg:col-span-7 flex items-center justify-center">
                  <LandingView isDark={isDark} />
                </div>

                {/* Right authentic administrative transceiver screen */}
                <div 
                  className="lg:col-span-5 xl:col-span-5 flex items-center justify-center px-6 py-12 lg:py-16 border-t lg:border-t-0 lg:border-l backdrop-blur-3xl transition-all duration-300 rounded-xl"
                  style={{
                    borderColor: isDark ? 'rgba(77, 141, 255, 0.18)' : 'rgba(10, 16, 37, 0.12)',
                    backgroundColor: isDark ? 'rgba(10, 16, 37, 0.55)' : 'rgba(232, 236, 245, 0.55)'
                  }}
                >
                  {stage === 'login' ? (
                    <LoginForm isDark={isDark} onLoginSuccess={handleLoginSuccess} />
                  ) : stage === 'register' ? (
                    <RegisterForm isDark={isDark} onRegisterSuccess={() => { setStage('login'); window.location.hash = '#login'; }} onNavigateToLogin={() => { setStage('login'); window.location.hash = '#login'; }} />
                  ) : (
                    <SuccessView user={loggedInUser} onRedirectComplete={handleRedirectComplete} />
                  )}
                </div>
              </div>
            ) : (
              /* FULL SCREEN COMPREHENSIVE TACTICAL SEC-OPS DASHBOARD VIEW */
              <div className="w-full max-w-7xl mx-auto">
                <DashboardView user={loggedInUser} isDark={isDark} onLogout={handleLogout} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* SYSTEM STATS FOOTER MODULE */}
      <Footer isDark={isDark} socialLinks={socialLinks} />

      {/* WhatsApp floating button */}
      <a href="https://wa.me/8801711408725" target="_blank" rel="noreferrer"
        style={{ position:'fixed', bottom:'28px', right:'28px', zIndex:200, width:'56px', height:'56px', borderRadius:'50%', background:'#00C853', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 24px rgba(0,200,83,0.4)', transition:'transform .2s,box-shadow .2s', textDecoration:'none' }}
        onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='scale(1.1)';el.style.boxShadow='0 6px 28px rgba(0,200,83,0.55)'}}
        onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.transform='scale(1)';el.style.boxShadow='0 4px 24px rgba(0,200,83,0.4)'}}
        title="Chat on WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}
