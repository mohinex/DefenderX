import React from 'react'
import { Facebook, Twitter, Linkedin, Phone, Mail } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface FooterProps {
  isDark?: boolean
  socialLinks?: { facebook: string; twitter: string; linkedin: string }
}

export default function Footer({ isDark = true, socialLinks }: FooterProps) {
  const navigate = useNavigate()

  const handleFooterNav = (route: string, anchor: string) => {
    const currentPath = window.location.pathname;
    if (currentPath === route) {
      const element = document.getElementById(anchor.replace('#', ''));
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
      navigate(`${route}${anchor}`);
    }
  };

  const textColor = isDark ? '#B8C1D1' : '#4E5A70'
  const hoverColor = isDark ? 'white' : '#050816'
  const borderColor = isDark ? 'rgba(77,141,255,0.18)' : 'rgba(10,16,37,0.12)'
  const brandColor = isDark ? 'white' : '#050816'

  return (
    <footer 
      style={{ 
        background: isDark ? 'rgba(5,8,22,0.98)' : '#f0f4fc', 
        borderTop: `1px solid ${borderColor}`, 
        paddingTop: '56px',
        transition: 'all .3s'
      }}
    >
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', paddingBottom: '48px' }} id="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <svg width="40" height="40" viewBox="0 0 64 64" fill="none">
                <path d="M32 4L8 14v18c0 14 10.4 27.1 24 30 13.6-2.9 24-16 24-30V14L32 4z"
                  fill="rgba(255,59,48,0.15)" stroke="#FF3B30" strokeWidth="1.6"/>
                <text x="32" y="42" textAnchor="middle" fontFamily="Manrope,sans-serif"
                  fontSize="22" fontWeight="900" fill="#FF3B30">X</text>
              </svg>
              <div>
                <div style={{ fontFamily: 'Manrope,sans-serif', fontSize: '16px', fontWeight: 900,
                  letterSpacing: '1.5px', color: brandColor }}>EUROSIA <span style={{ color: '#FF3B30' }}>X</span></div>
                <div style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: '9px',
                  letterSpacing: '3px', color: '#4D8DFF' }}>DEFENDER</div>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: textColor, lineHeight: 1.75, maxWidth: '280px', marginBottom: '20px' }}>
              Bangladesh's Next-Generation Cyber Security Platform.
              Protecting digital assets with enterprise-grade defense solutions.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { icon: Facebook, url: socialLinks?.facebook || 'https://www.facebook.com/EurosiaOfficial', color: '#1877F2' },
                { icon: Twitter, url: socialLinks?.twitter || 'https://x.com/EurosiaOfficial', color: '#1DA1F2' },
                { icon: Linkedin, url: socialLinks?.linkedin || 'https://linkedin.com/in/EurosiaOfficial', color: '#0A66C2' },
              ].map(({ icon: Icon, url, color }, idx) => (
                <a key={idx} href={url} target="_blank" rel="noopener noreferrer"
                  style={{ width: '34px', height: '34px', borderRadius: '8px',
                    background: `${color}15`, border: `1px solid ${color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none', transition: 'all .2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${color}30` }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${color}15` }}>
                  <Icon size={15} color={color} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <div style={{ fontFamily: 'Manrope,sans-serif', fontSize: '12px', fontWeight: 700,
              letterSpacing: '2px', color: '#4D8DFF', marginBottom: '16px' }}>SERVICES</div>
            {['SOC Monitoring', 'VAPT / Pentest', 'Endpoint Security', 'Cloud Security',
              'Email Security', 'Incident Response', 'Compliance', 'Threat Intel'].map(s => (
              <div key={s} style={{ marginBottom: '9px' }}>
                <button onClick={() => handleFooterNav('/services', '#services')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px',
                    color: textColor, transition: 'color .2s', padding: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.color = hoverColor }}
                  onMouseLeave={e => { e.currentTarget.style.color = textColor }}>{s}</button>
              </div>
            ))}
          </div>

          {/* Company */}
          <div>
            <div style={{ fontFamily: 'Manrope,sans-serif', fontSize: '12px', fontWeight: 700,
              letterSpacing: '2px', color: '#4D8DFF', marginBottom: '16px' }}>COMPANY</div>
            {[
              ['About', '/about', '#about'],
              ['Why Us', '/why-us', '#why-us'],
              ['7-Layer Defense', '/why-us', '#why-us'],
              ['Contact', '/contact', '#contact']
            ].map(([l, r, h]) => (
              <div key={l} style={{ marginBottom: '9px' }}>
                <button onClick={() => handleFooterNav(r, h)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px',
                    color: textColor, transition: 'color .2s', padding: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.color = hoverColor }}
                  onMouseLeave={e => { e.currentTarget.style.color = textColor }}>{l}</button>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontFamily: 'Manrope,sans-serif', fontSize: '12px', fontWeight: 700,
              letterSpacing: '2px', color: '#4D8DFF', marginBottom: '16px' }}>CONTACT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="tel:+8801711408725" style={{ display: 'flex', gap: '8px', alignItems: 'center',
                textDecoration: 'none', color: textColor, fontSize: '13px', transition: 'color .2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = hoverColor }}
                onMouseLeave={e => { e.currentTarget.style.color = textColor }}>
                <Phone size={13} color="#00C853" /> +880 1711 408725
              </a>
              <a href="tel:+8801709371514" style={{ display: 'flex', gap: '8px', alignItems: 'center',
                textDecoration: 'none', color: textColor, fontSize: '13px', transition: 'color .2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = hoverColor }}
                onMouseLeave={e => { e.currentTarget.style.color = textColor }}>
                <Phone size={13} color="#00C853" /> +880 1709 371514
              </a>
              <a href="mailto:support@eurosia.com.bd" style={{ display: 'flex', gap: '8px', alignItems: 'center',
                textDecoration: 'none', color: textColor, fontSize: '13px', transition: 'color .2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = hoverColor }}
                onMouseLeave={e => { e.currentTarget.style.color = textColor }}>
                <Mail size={13} color="#4D8DFF" /> support@eurosia.com.bd
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: `1px solid ${isDark ? 'rgba(77,141,255,0.12)' : 'rgba(10,16,37,0.08)'}`, padding: '20px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: isDark ? 'rgba(184,193,209,0.5)' : 'rgba(10,16,37,0.5)' }}>
            © 2026 EUROSIA Systems. All rights secured.
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#00C853',
              animation: 'pulse 2s infinite', display: 'block' }} />
            <span style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: '11px',
              color: '#00C853', letterSpacing: '1px' }}>ALL SYSTEMS OPERATIONAL</span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['SOC', 'SIEM', 'XDR', 'EDR', 'IAM'].map(t => (
              <span key={t} style={{ fontFamily: 'Share Tech Mono,monospace', fontSize: '11px',
                color: '#4D8DFF', letterSpacing: '1px' }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width:768px){ #footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; } }
        @media(max-width:480px){ #footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  )
}
