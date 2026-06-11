import React, { useState, useEffect } from 'react'
import { Menu, X, Sun, Moon, Terminal, Facebook, Twitter, Linkedin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface NavbarProps {
  isDark: boolean
  onToggleTheme: () => void
  onLaunchConsole: () => void
  inConsoleMode: boolean
  onExitConsole: () => void
  activeRoute?: string
  socialLinks?: { facebook: string; twitter: string; linkedin: string }
  loggedInUser?: any
  onLogout?: () => void
}

export default function Navbar({
  isDark,
  onToggleTheme,
  onLaunchConsole,
  inConsoleMode,
  onExitConsole,
  activeRoute = '/',
  socialLinks,
  loggedInUser,
  onLogout,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  const dynamicLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Why Us', href: '/why-us' },
    { label: 'Contact', href: '/contact' },
  ];

  if (!loggedInUser) {
    dynamicLinks.push({ label: 'Login', href: '/login' });
    dynamicLinks.push({ label: 'Register', href: '/register' });
  } else {
    dynamicLinks.push({ label: 'Dashboard', href: '/dashboard' });
    dynamicLinks.push({ label: 'Profile', href: '/profile' });
    dynamicLinks.push({ label: 'Admin', href: '/admin' });
    dynamicLinks.push({ label: 'SEO Settings', href: '/seo-settings' });
    dynamicLinks.push({ label: 'Logout', href: '/logout' });
  }

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleNav = (href: string) => {
    setMenuOpen(false)
    if (href === '/logout') {
      if (onLogout) onLogout();
      navigate('/');
    } else {
      const currentPath = window.location.pathname;
      if (currentPath === href && href !== '/') {
        // Already on the same page: scroll smoothly directly
        const sectionId = href.substring(1);
        const element = document.getElementById(sectionId);
        if (element) {
          const navbarHeight = 64;
          const buffer = 20;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - (navbarHeight + buffer);
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      } else {
        if (href === '/') {
          navigate('/');
        } else if (href.startsWith('/')) {
          const sectionId = href.substring(1);
          // Route and target the anchor section
          navigate(`${href}#${sectionId}`);
        } else {
          navigate(href);
        }
      }
    }
  }

  return (
    <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, height:'64px',
      background: scrolled ? 'rgba(5,8,22,0.97)' : 'rgba(5,8,22,0.7)',
      borderBottom:'1px solid rgba(77,141,255,0.18)', backdropFilter:'blur(20px)', transition:'all .3s' }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 24px', height:'100%',
        display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative' }}>

        {/* Logo */}
        <button onClick={() => {
          if (inConsoleMode && onExitConsole) {
            onExitConsole()
          } else {
            handleNav('/')
          }
        }}
          className="group"
          style={{ display:'flex', alignItems:'center', gap:'10px', background:'none', border:'none', cursor:'pointer', textAlign: 'left' }}>
          <svg width="36" height="36" viewBox="0 0 64 64" fill="none" className="transition-transform duration-300 group-hover:scale-105">
            <path d="M32 4L8 14v18c0 14 10.4 27.1 24 30 13.6-2.9 24-16 24-30V14L32 4z"
              fill="rgba(255,59,48,0.15)" stroke="#FF3B30" strokeWidth="1.6" className="transition-all duration-300 group-hover:fill-red-500/25"/>
            <text x="32" y="42" textAnchor="middle" fontFamily="Manrope,sans-serif"
              fontSize="22" fontWeight="900" fill="#FF3B30">X</text>
          </svg>
          <div>
            <div className="transition-all duration-300 group-hover:text-red-500 group-hover:translate-x-0.5" style={{ fontFamily:'Manrope,sans-serif', fontSize:'14px', fontWeight:900,
              letterSpacing:'1.5px', color:'white', lineHeight:1 }}>
              EUROSIA <span className="transition-all duration-300 group-hover:text-white" style={{ color:'#FF3B30' }}>X</span>
            </div>
            <div className="transition-all duration-300 group-hover:text-white" style={{ fontFamily:'Share Tech Mono,monospace', fontSize:'9px',
              letterSpacing:'3px', color:'#4D8DFF', marginTop:'2px' }}>DEFENDER</div>
          </div>
        </button>

        {/* Desktop Nav */}
        <div className="desktop-nav" style={{ display:'flex', alignItems:'center', gap:'32px' }}>
          {dynamicLinks.map(l => {
            const isActive = activeRoute === l.href;
            return (
              <button key={l.href} onClick={() => handleNav(l.href)}
                style={{ background:'none', border:'none', cursor:'pointer',
                  fontFamily:'Inter,sans-serif', fontSize:'13px',
                  color: isActive ? '#4D8DFF' : 'rgba(184,193,209,0.9)', transition:'all .2s', fontWeight: isActive ? 700 : 500, position:'relative' }}
                onMouseEnter={e=>(e.currentTarget.style.color= isActive ? '#4D8DFF' : 'white')}
                onMouseLeave={e=>(e.currentTarget.style.color= isActive ? '#4D8DFF' : 'rgba(184,193,209,0.9)')}>
                {l.label}
                {isActive && (
                  <span style={{ 
                    position: 'absolute', 
                    bottom: '-6px', 
                    left: '15%', 
                    right: '15%', 
                    height: '2px', 
                    backgroundColor: '#4D8DFF', 
                    borderRadius: '2px' 
                  }} />
                )}
              </button>
            )
          })}
        </div>

        {/* CTA Buttons */}
        <div className="desktop-nav" style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          
          {/* Dynamic Social Network Handles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '4px' }}>
            <a 
              href={socialLinks?.facebook || "https://www.facebook.com/EurosiaOfficial"} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ 
                color: '#B8C1D1', 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px', 
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                transition: 'all 0.2s' 
              }} 
              onMouseEnter={e => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }} 
              onMouseLeave={e => {
                e.currentTarget.style.color = '#B8C1D1';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }} 
              title="Facebook Profile Page"
            >
              <Facebook size={12} />
            </a>
            <a 
              href={socialLinks?.twitter || "https://x.com/EurosiaOfficial"} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                color: '#B8C1D1', 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px', 
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#B8C1D1';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
              title="X / Twitter Handle"
            >
              <Twitter size={12} />
            </a>
            <a 
              href={socialLinks?.linkedin || "https://linkedin.com/in/EurosiaOfficial"} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{
                color: '#B8C1D1', 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px', 
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#B8C1D1';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
              title="LinkedIn Work Identity"
            >
              <Linkedin size={12} />
            </a>
          </div>

          {/* Theme Toggler */}
          <button 
            onClick={onToggleTheme}
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#B8C1D1',
              transition: 'all 0.2s'
            }}
            title="Toggle Visual Mode"
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = '#B8C1D1';
            }}
          >
            {isDark ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-slate-200" />}
          </button>

          {/* SECOPS Console Mode Trigger */}
          {inConsoleMode ? (
            <button
               onClick={() => { handleNav('/'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: 'rgba(255, 59, 48, 0.12)',
                border: '1px solid rgba(255, 59, 48, 0.3)',
                borderRadius: '8px',
                color: '#FF3B30',
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all .2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 59, 48, 0.22)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 59, 48, 0.12)' }}
            >
              <Terminal size={12} />
              EXIT UTILITY
            </button>
          ) : (
            <button
               onClick={() => { handleNav('/dashboard'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: 'rgba(77, 141, 255, 0.12)',
                border: '1px solid rgba(77, 141, 255, 0.3)',
                borderRadius: '8px',
                color: '#4C8DFF',
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all .2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(77, 141, 255, 0.22)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(77, 141, 255, 0.12)' }}
            >
              <Terminal size={12} />
              SECOPS TERMINAL
            </button>
          )}

          <a href="https://wa.me/8801711408725" target="_blank" rel="noreferrer"
            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 18px',
              background:'rgba(0,200,83,0.12)', border:'1px solid rgba(0,200,83,0.3)',
              borderRadius:'8px', color:'#00C853', fontFamily:'Manrope,sans-serif',
              fontSize:'12px', fontWeight:700, letterSpacing:'1px', textDecoration:'none', transition:'all .2s' }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(0,200,83,0.2)'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(0,200,83,0.12)'}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#00C853">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp
          </a>
          <button onClick={() => handleNav('/contact')}
            style={{ padding:'8px 20px', background:'linear-gradient(90deg,#FF3B30,#0057FF)',
              color:'white', border:'none', borderRadius:'8px',
              fontFamily:'Manrope,sans-serif', fontSize:'12px', fontWeight:700,
              letterSpacing:'1px', cursor:'pointer', transition:'opacity .2s' }}
            onMouseEnter={e=>(e.currentTarget.style.opacity='0.85')}
            onMouseLeave={e=>(e.currentTarget.style.opacity='1')}>
            GET STARTED
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="mobile-hamburger" onClick={() => setMenuOpen(v => !v)}
          style={{ display:'none', background:'none', border:'none', cursor:'pointer',
            color:'white', alignItems:'center', justifyItems:'center', justifyContent:'center' }}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {dynamicLinks.map(l => {
          const isActive = activeRoute === l.href;
          return (
            <button key={l.href} onClick={() => handleNav(l.href)}
              style={{ background:'none', border:'none', cursor:'pointer',
                fontFamily:'Inter,sans-serif', fontSize:'15px',
                color: isActive ? '#4D8DFF' : 'rgba(184,193,209,0.9)', textAlign:'left', padding:'6px 0', fontWeight: isActive ? 700 : 500 }}>
              {l.label}
            </button>
          )
        })}

        {/* Theme select in mobile menu */}
        <button 
          onClick={onToggleTheme}
          style={{ 
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            color: '#B8C1D1',
            fontSize: '13px',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          {isDark ? <><Sun size={14} className="text-amber-400" /> Light Mode</> : <><Moon size={14} className="text-slate-200" /> Dark Mode</>}
        </button>

        {/* Secure console trigger in mobile menu */}
        {inConsoleMode ? (
          <button
            onClick={() => {
              onExitConsole()
              setMenuOpen(false)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px',
              background: 'rgba(255, 59, 48, 0.15)',
              border: '1px solid rgba(255, 59, 48, 0.3)',
              borderRadius: '8px',
              color: '#FF3B30',
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Terminal size={14} />
            EXIT SECOPS UTILITY
          </button>
        ) : (
          <button
            onClick={() => {
              onLaunchConsole()
              setMenuOpen(false)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px',
              background: 'rgba(77, 141, 255, 0.15)',
              border: '1px solid rgba(77, 141, 255, 0.3)',
              borderRadius: '8px',
              color: '#4C8DFF',
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Terminal size={14} />
            LAUNCH SECOPS CLIENT
          </button>
        )}

        <a href="https://wa.me/8801711408725" target="_blank" rel="noreferrer"
          style={{ color:'#00C853', textDecoration:'none', fontSize:'14px', fontWeight:600 }}>
          WhatsApp: +880 1711 408725
        </a>
      </div>
    </nav>
  )
}
