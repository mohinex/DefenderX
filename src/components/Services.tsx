import React from 'react'
import { Shield, Search, Lock, Cloud, Mail, AlertTriangle, CheckCircle, Cpu } from 'lucide-react'

const services = [
  { icon:Shield, color:'#FF3B30', bg:'rgba(255,59,48,0.12)', title:'SOC Monitoring', tag:'SOC',
    desc:'24/7 Security Operations Center with real-time threat detection, event correlation, and instant incident response.',
    features:['Real-time SIEM','Event correlation','Alert triage','24/7 analyst coverage'] },
  { icon:Search, color:'#4D8DFF', bg:'rgba(77,141,255,0.12)', title:'VAPT / Pentest', tag:'VAPT',
    desc:'Comprehensive vulnerability assessment and penetration testing to identify security gaps before attackers do.',
    features:['Web app testing','Network pentest','CVE discovery','Remediation report'] },
  { icon:Cpu, color:'#00C853', bg:'rgba(0,200,83,0.12)', title:'Endpoint Security', tag:'EDR',
    desc:'Advanced endpoint detection and response protecting every device — laptops, mobiles, servers — from threats.',
    features:['Device monitoring','AV management','Threat isolation','Remote wipe'] },
  { icon:Cloud, color:'#4D8DFF', bg:'rgba(77,141,255,0.12)', title:'Cloud Security', tag:'XDR',
    desc:'Secure your AWS, GCP, and Azure infrastructure with continuous misconfiguration detection and cloud threat hunting.',
    features:['Cloud posture','Misconfiguration audit','IAM review','DLP enforcement'] },
  { icon:Mail, color:'#EF9F27', bg:'rgba(239,159,39,0.12)', title:'Email Security', tag:'EMAIL',
    desc:'Stop phishing, malware, and BEC attacks with AI-powered email filtering and SPF/DKIM/DMARC enforcement.',
    features:['Phishing prevention','Malware filtering','DMARC setup','Sandboxing'] },
  { icon:AlertTriangle, color:'#FF3B30', bg:'rgba(255,59,48,0.12)', title:'Incident Response', tag:'IR',
    desc:'Rapid incident response and forensic investigation to contain breaches and restore operations with minimal downtime.',
    features:['24/7 IR team','Forensic analysis','Breach containment','Post-incident report'] },
  { icon:CheckCircle, color:'#00C853', bg:'rgba(0,200,83,0.12)', title:'Compliance & Audit', tag:'GRC',
    desc:'Achieve and maintain ISO 27001, NIST, GDPR, and PCI-DSS compliance with automated audit trails.',
    features:['ISO 27001','GDPR','PCI-DSS','Audit reports'] },
  { icon:Lock, color:'#4D8DFF', bg:'rgba(77,141,255,0.12)', title:'Threat Intelligence', tag:'CTI',
    desc:'AI-powered threat intelligence with IOC feeds, dark web monitoring, and predictive risk scoring.',
    features:['IOC feeds','Dark web watch','Risk scoring','AI prediction'] },
]

interface ServicesProps {
  isDark?: boolean
}

export default function Services({ isDark = true }: ServicesProps) {
  return (
    <section id="services" className="section" style={{ background: isDark ? 'rgba(10,16,37,0.3)' : 'rgba(235,240,250,0.5)' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:'56px' }}>
          <div className="badge" style={{ marginBottom:'16px', display:'inline-flex' }}>SECURITY SERVICES</div>
          <h2 className="section-title" style={{ marginBottom:'16px', color: isDark ? 'white' : '#050816' }}>
            Complete Cyber Defense <span style={{ color:'#4D8DFF' }}>Coverage</span>
          </h2>
          <p className="section-sub" style={{ margin:'0 auto', color: isDark ? '#B8C1D1' : '#4E5A70' }}>
            Eight integrated security modules working together to protect every layer of your digital infrastructure.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'20px' }}>
          {services.map(s => {
            const Icon = s.icon
            return (
              <div 
                key={s.title} 
                className="card" 
                style={{ 
                  padding:'24px', 
                  background: isDark ? 'rgba(10,16,37,0.7)' : 'rgba(255,255,255,0.85)',
                  borderColor: isDark ? 'rgba(77,141,255,0.15)' : 'rgba(10,16,37,0.1)'
                }}
              >
                <div style={{ display:'flex', alignItems:'flex-start', gap:'14px', marginBottom:'14px' }}>
                  <div style={{ width:'44px', height:'44px', borderRadius:'10px', background:s.bg,
                    border:`1px solid ${s.color}33`, display:'flex', alignItems:'center',
                    justifyContent:'center', flexShrink:0 }}>
                    <Icon size={20} color={s.color} />
                  </div>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px', flexWrap:'wrap' }}>
                      <span style={{ fontFamily:'Manrope,sans-serif', fontSize:'15px',
                        fontWeight:800, color: isDark ? 'white' : '#050816' }}>{s.title}</span>
                      <span style={{ padding:'2px 8px', background:`${s.color}18`,
                        border:`1px solid ${s.color}33`, borderRadius:'10px',
                        fontFamily:'Share Tech Mono,monospace', fontSize:'9px',
                        letterSpacing:'1px', color:s.color }}>{s.tag}</span>
                    </div>
                    <p style={{ fontSize:'12px', color: isDark ? '#B8C1D1' : '#4E5A70', lineHeight:1.6 }}>{s.desc}</p>
                  </div>
                </div>
                <div style={{ borderTop: isDark ? '1px solid rgba(77,141,255,0.1)' : '1px solid rgba(10,16,37,0.06)', paddingTop:'14px' }}>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                    {s.features.map(f => (
                      <span key={f} style={{ fontSize:'11px', padding:'3px 9px',
                        background: isDark ? 'rgba(77,141,255,0.07)' : 'rgba(10,16,37,0.03)', 
                        border: isDark ? '1px solid rgba(77,141,255,0.15)' : '1px solid rgba(10,16,37,0.06)',
                        borderRadius:'12px', color: isDark ? '#B8C1D1' : '#4E5A70' }}>{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
