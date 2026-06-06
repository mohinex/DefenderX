import React from 'react'
import { CheckCircle } from 'lucide-react'

const layers = [
  { num:'L1', name:'Perimeter Defense', desc:'Firewall, DDoS mitigation, IP blacklisting, geo-blocking', color:'#FF3B30' },
  { num:'L2', name:'Network Security', desc:'Traffic analysis, VPN integrity, DNS filtering, VLAN', color:'#EF9F27' },
  { num:'L3', name:'Endpoint Protection', desc:'Device health, AV coverage, suspicious process detection', color:'#00C853' },
  { num:'L4', name:'Application Security', desc:'WAF, SQL injection, XSS blocking, API rate limiting', color:'#4D8DFF' },
  { num:'L5', name:'Identity & Access', desc:'Login monitoring, MFA, brute force detection, sessions', color:'#7F77DD' },
  { num:'L6', name:'Data Security', desc:'Encryption, exfiltration detection, backup integrity, DLP', color:'#0057FF' },
  { num:'L7', name:'Threat Intelligence', desc:'IOC feeds, AI risk scoring, dark web monitoring', color:'#4D8DFF' },
]

const reasons = [
  'Bangladesh-based 24/7 support team',
  'Response time under 2 minutes',
  'Bilingual support (English & Bangla)',
  'Affordable enterprise-grade pricing',
  'Dedicated security engineer per client',
  'Real-time dashboard & reporting',
  'Autonomous threat defense system',
  'ISO 27001 & NIST aligned processes',
]

interface WhyUsProps {
  isDark?: boolean
}

export default function WhyUs({ isDark = true }: WhyUsProps) {
  return (
    <section id="why-us" className="section" style={{ background: isDark ? 'rgba(10,16,37,0.4)' : 'rgba(235,240,250,0.3)' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:'60px' }}>
          <div className="badge" style={{ marginBottom:'16px', display:'inline-flex' }}>WHY CHOOSE US</div>
          <h2 className="section-title" style={{ marginBottom:'16px', color: isDark ? 'white' : '#050816' }}>
            Seven Layer <span style={{ color:'#4D8DFF' }}>Defense Architecture</span>
          </h2>
          <p className="section-sub" style={{ margin:'0 auto', color: isDark ? '#B8C1D1' : '#4E5A70' }}>
            Our flagship 7-layer defense framework ensures no threat slips through.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'60px', alignItems:'start' }} id="why-us-grid">
          {/* Layer stack */}
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {layers.map((l,i) => (
              <div 
                key={l.num} 
                className="card" 
                style={{ 
                  padding:'16px 20px', 
                  display:'flex', 
                  alignItems:'center', 
                  gap:'16px',
                  background: isDark ? 'rgba(10,16,37,0.7)' : 'rgba(255,255,255,0.85)',
                  borderColor: isDark ? 'rgba(77,141,255,0.15)' : 'rgba(10,16,37,0.1)'
                }}
                onMouseEnter={e=>{
                  (e.currentTarget as HTMLElement).style.borderColor = l.color + '88';
                }}
                onMouseLeave={e=>{
                  (e.currentTarget as HTMLElement).style.borderColor = isDark ? 'rgba(77,141,255,0.15)' : 'rgba(10,16,37,0.1)';
                }}
              >
                <div style={{ width:'40px', height:'40px', borderRadius:'8px', background:`${l.color}15`,
                  border:`1px solid ${l.color}33`, display:'flex', alignItems:'center',
                  justifyContent:'center', flexShrink:0 }}>
                  <span style={{ fontFamily:'Share Tech Mono,monospace', fontSize:'12px',
                    fontWeight:700, color:l.color }}>{l.num}</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'Manrope,sans-serif', fontSize:'13px',
                    fontWeight:700, color: isDark ? 'white' : '#050816', marginBottom:'3px' }}>{l.name}</div>
                  <div style={{ fontSize:'12px', color: isDark ? '#B8C1D1' : '#4E5A70' }}>{l.desc}</div>
                </div>
                <div style={{ width:'60px', height:'4px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', borderRadius:'2px', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${85+i*2}%`, background:l.color, borderRadius:'2px' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Right */}
          <div>
            <h3 style={{ fontFamily:'Manrope,sans-serif', fontSize:'24px', fontWeight:800,
              color: isDark ? 'white' : '#050816', marginBottom:'24px' }}>Why EUROSIA Defender X?</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px', marginBottom:'40px' }}>
              {reasons.map(r => (
                <div key={r} style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <CheckCircle size={16} color="#00C853" style={{ flexShrink:0 }} />
                  <span style={{ fontSize:'14px', color: isDark ? '#B8C1D1' : '#4E5A70' }}>{r}</span>
                </div>
              ))}
            </div>
            <div style={{ 
              background: isDark ? 'linear-gradient(135deg,rgba(255,59,48,0.1),rgba(0,87,255,0.1))' : 'linear-gradient(135deg,rgba(255,59,48,0.05),rgba(0,87,255,0.05))',
              border: isDark ? '1px solid rgba(77,141,255,0.25)' : '1px solid rgba(10,16,37,0.12)', 
              borderRadius:'12px', 
              padding:'24px', 
              textAlign:'center',
              boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.02)'
            }}>
              <div style={{ fontFamily:'Share Tech Mono,monospace', fontSize:'11px',
                letterSpacing:'2px', color:'#4D8DFF', marginBottom:'8px' }}>OVERALL DEFENSE SCORE</div>
              <div style={{ fontFamily:'Manrope,sans-serif', fontSize:'56px',
                fontWeight:900, color:'#00C853', lineHeight:1 }}>97%</div>
              <div style={{ fontSize:'13px', color: isDark ? '#B8C1D1' : '#4E5A70', marginTop:'8px' }}>Industry-leading protection</div>
              <div style={{ display:'flex', gap:'8px', justifyContent:'center', marginTop:'16px' }}>
                {layers.map(l => (
                  <div key={l.num} style={{ flex:1, height:'6px', background:l.color, borderRadius:'3px', opacity:0.8 }} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @media(max-width:768px){
            #why-us-grid { grid-template-columns:1fr !important; gap:40px !important; }
          }
        `}</style>
      </div>
    </section>
  )
}
