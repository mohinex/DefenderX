import React from 'react'
import { ShieldCheck, Users, Globe, Award, Facebook, Twitter, Linkedin } from 'lucide-react'

const highlights = [
  { icon: ShieldCheck, color: '#00C853', label: 'Bangladesh Based', desc: 'Local experts, global standards' },
  { icon: Users, color: '#4D8DFF', label: 'Expert Team', desc: 'Certified security professionals' },
  { icon: Globe, color: '#FF3B30', label: 'Global Standards', desc: 'ISO 27001, NIST, GDPR aligned' },
  { icon: Award, color: '#EF9F27', label: 'Trusted Partner', desc: '500+ clients protected' },
]

interface AboutProps {
  isDark?: boolean
  socialLinks?: { facebook: string; twitter: string; linkedin: string }
}

export default function About({ isDark = true, socialLinks }: AboutProps) {
  return (
    <section id="about" className="section" style={{ background: isDark ? 'transparent' : '#f0f4fc' }}>
      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'72px', alignItems:'center' }} id="about-grid">

          {/* Left — terminal card */}
          <div style={{ position:'relative' }}>
            <div style={{ 
              background: isDark ? 'rgba(10,16,37,0.8)' : 'rgba(255,255,255,0.9)', 
              border: isDark ? '1px solid rgba(77,141,255,0.2)' : '1px solid rgba(10,16,37,0.1)',
              borderRadius:'16px', 
              padding:'32px', 
              backdropFilter:'blur(16px)',
              boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'20px' }}>
                {['#FF3B30','#EF9F27','#00C853'].map(c =>
                  <div key={c} style={{ width:'10px', height:'10px', borderRadius:'50%', background:c }} />)}
                <span style={{ fontFamily:'Share Tech Mono,monospace', fontSize:'11px',
                  color:'#4D8DFF', marginLeft:'8px', letterSpacing:'1px' }}>EUROSIA // SYSTEM INFO</span>
              </div>
              <div style={{ fontFamily:'Share Tech Mono,monospace', fontSize:'13px',
                color: isDark ? '#B8C1D1' : '#4E5A70', lineHeight:2 }}>
                {[
                  ['Company','EUROSIA Defender X'],
                  ['Founded','2020 — Bangladesh'],
                  ['Headquarters','Dhaka, Bangladesh'],
                  ['Services','Cybersecurity (B2B)'],
                  ['Coverage','Nationwide + Remote'],
                  ['Certifications','ISO 27001 Aligned'],
                  ['Response SLA','< 2 minutes'],
                  ['Status',''],
                ].map(([k,v]) => (
                  <div key={k} style={{ display:'flex', gap:'16px' }}>
                    <span style={{ color:'#4D8DFF', minWidth:'140px' }}>{k}:</span>
                    {k==='Status'
                      ? <span style={{ color:'#00C853' }}>✓ OPERATIONAL</span>
                      : <span style={{ color: isDark ? 'white' : '#050816' }}>{v}</span>}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position:'absolute', bottom:'-20px', right:'-20px',
              background:'linear-gradient(135deg,#FF3B30,#0057FF)', borderRadius:'12px',
              padding:'16px 20px', textAlign:'center', boxShadow: '0 4px 15px rgba(0,87,255,0.3)' }}>
              <div style={{ fontFamily:'Manrope,sans-serif', fontSize:'28px', fontWeight:900, color:'white' }}>24/7</div>
              <div style={{ fontFamily:'Share Tech Mono,monospace', fontSize:'9px',
                letterSpacing:'2px', color:'rgba(255,255,255,0.8)', marginTop:'2px' }}>SOC ACTIVE</div>
            </div>
          </div>

          {/* Right */}
          <div>
            <div className="badge" style={{ marginBottom:'20px' }}>ABOUT EUROSIA</div>
            <h2 className="section-title" style={{ marginBottom:'20px', color: isDark ? 'white' : '#050816' }}>
              Bangladesh's Premier <span style={{ color:'#4D8DFF' }}>Cyber Defense</span> Platform
            </h2>
            <p className="section-sub" style={{ marginBottom:'28px', color: isDark ? '#B8C1D1' : '#4E5A70' }}>
              EUROSIA Defender X is a next-generation cybersecurity platform built for Bangladeshi businesses.
              We combine enterprise-grade security tools with local expertise to protect organizations from evolving cyber threats.
            </p>
            <p style={{ fontSize:'14px', color: isDark ? '#B8C1D1' : '#4E5A70', lineHeight:1.8, marginBottom:'32px' }}>
              From SOC monitoring and VAPT scanning to autonomous threat defense and 7-layer security architecture —
              we provide comprehensive protection that scales with your business. Our certified engineers are available 24/7.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
              {highlights.map(h => {
                const Icon = h.icon
                return (
                  <div key={h.label} style={{ display:'flex', gap:'12px', alignItems:'flex-start' }}>
                    <div style={{ width:'36px', height:'36px', borderRadius:'8px',
                      background:`${h.color}15`, border:`1px solid ${h.color}33`,
                      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Icon size={16} color={h.color} />
                    </div>
                    <div>
                      <div style={{ fontFamily:'Manrope,sans-serif', fontSize:'13px',
                        fontWeight:700, color: isDark ? 'white' : '#050816', marginBottom:'2px' }}>{h.label}</div>
                      <div style={{ fontSize:'12px', color: isDark ? '#B8C1D1' : '#4E5A70' }}>{h.desc}</div>
                    </div>
                  </div>
                )
              })}
            </div>
            {/* Social profiles row in About Page */}
            <div style={{ marginTop: '36px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '11px', color: '#4D8DFF', letterSpacing: '2px', textTransform: 'uppercase' }}>CONNECT WITH US:</span>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a href={socialLinks?.facebook || "https://www.facebook.com/EurosiaOfficial"} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', borderRadius: '8px', background: 'rgba(24,119,242,0.1)', border: '1px solid rgba(24,119,242,0.2)', textDecoration: 'none', color: '#1877F2', fontSize: '12px', gap: '8px', transition: 'all 0.2s', fontFamily: 'Manrope, sans-serif', fontWeight: 600 }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(24,119,242,0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(24,119,242,0.1)'}>
                  <Facebook size={12} />
                  Facebook
                </a>
                <a href={socialLinks?.twitter || "https://x.com/EurosiaOfficial"} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', borderRadius: '8px', background: 'rgba(29,161,186,0.1)', border: '1px solid rgba(29,161,186,0.2)', textDecoration: 'none', color: '#1DA1F2', fontSize: '12px', gap: '8px', transition: 'all 0.2s', fontFamily: 'Manrope, sans-serif', fontWeight: 600 }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(29,161,186,0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(29,161,186,0.1)'}>
                  <Twitter size={12} />
                  X / Twitter
                </a>
                <a href={socialLinks?.linkedin || "https://linkedin.com/in/EurosiaOfficial"} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', borderRadius: '8px', background: 'rgba(10,102,194,0.1)', border: '1px solid rgba(10,102,194,0.2)', textDecoration: 'none', color: '#0A66C2', fontSize: '12px', gap: '8px', transition: 'all 0.2s', fontFamily: 'Manrope, sans-serif', fontWeight: 600 }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(10,102,194,0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(10,102,194,0.1)'}>
                  <Linkedin size={12} />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @media(max-width:768px){
            #about-grid { grid-template-columns:1fr !important; gap:48px !important; }
          }
        `}</style>
      </div>
    </section>
  )
}
