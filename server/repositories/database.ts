import fs from "fs";
import path from "path";
import { User, ThreatAlert, FirewallRule, SecurityEventLog, AuditLog, SecurityPosture, ContactInquiry, SeoPageConfig, SeoGlobalConfig, SeoRedirect, BrokenLink } from "../types";

const DB_DIR = path.join(process.cwd(), "server", "data");
const DB_PATH = path.join(DB_DIR, "db.json");

interface DatabaseSchema {
  users: Record<string, { user: User; pass: string; refreshToken?: string }>;
  alerts: ThreatAlert[];
  firewallRules: FirewallRule[];
  logs: SecurityEventLog[];
  auditLogs: AuditLog[];
  posture: SecurityPosture;
  contactInquiries: ContactInquiry[];
  seoPages: SeoPageConfig[];
  seoGlobal: SeoGlobalConfig;
  seoRedirects: SeoRedirect[];
  brokenLinks: BrokenLink[];
}

class SecurityDatabase {
  private state: DatabaseSchema;

  constructor() {
    this.state = this.loadInitialState();
  }

  private loadInitialState(): DatabaseSchema {
    const DEFAULT_SEO_PAGES: SeoPageConfig[] = [
      {
        path: "home",
        title: "Eurosia Defender X — Bangladesh's Next-Generation Cyber Security Platform",
        description: "Deploy enterprise cyber defense with Eurosia Defender X. Real-time SOC monitoring, unified SIEM, intelligent XDR threat hunting, and compliance audit loggers.",
        keywords: ["cybersecurity", "bangladesh SOC", "threat management", "firewall monitor"],
        ogTitle: "Eurosia Defender X — Bangladesh's Next-Generation Defensive Core",
        ogDescription: "Bangladesh's Next-Generation cyber security platform. Real-time SOC dashboard, secure IAM, network shunting, and corporate vulnerability scanning controls.",
        ogImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200&h=630",
        twitterCard: "summary_large_image",
        canonicalUrl: "https://eurosia.com/#home",
        structuredDataJson: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Eurosia Defender X Home",
          "description": "Next-Generation cyber security platform in Bangladesh."
        }, null, 2)
      },
      {
        path: "services",
        title: "Managed Security Services (SOC/MDR) — Eurosia Defender X",
        description: "Identify & eliminate zero-day risks. High-speed vulnerability audits, stateful firewall scanning, perimeter hardening assessments, and phishing security tests.",
        keywords: ["penetration test", "vuln sweep", "threat quarantine", "perimeter proxy"],
        ogTitle: "Managed Security Services (SOC/MDR) — Eurosia Defender X",
        ogDescription: "Identify & eliminate zero-day risks. High-speed vulnerability audits, stateful firewall scanning, perimeter hardening assessments, and phishing security tests.",
        ogImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200&h=630",
        twitterCard: "summary_large_image",
        canonicalUrl: "https://eurosia.com/#services",
        structuredDataJson: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Eurosia Services Portfolio",
          "description": "Vulnerability pen testing and active threat response portfolios."
        }, null, 2)
      },
      {
        path: "about",
        title: "Defensive Vision & SecOps Command Team — About Eurosia Defender X",
        description: "We protect Bangladesh's financial institutions, web software systems, and cloud databases from state-sponsored threat operators and automated DDoS probes.",
        keywords: ["secops engineers", "security vision", "bank hardening", "active mitigation"],
        ogTitle: "Defensive Vision & SecOps Command Team — About Eurosia Defender X",
        ogDescription: "We protect Bangladesh's financial institutions, web software systems, and cloud databases from state-sponsored threat operators and automated DDoS probes.",
        ogImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200&h=630",
        twitterCard: "summary_large_image",
        canonicalUrl: "https://eurosia.com/#about",
        structuredDataJson: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About Eurosia Defender",
          "description": "Our deep mission to protect critical industrial workspaces."
        }, null, 2)
      },
      {
        path: "why-us",
        title: "Why Corporate Platforms Select Eurosia Defender X Shield Systems",
        description: "Zero cold-start container response times, 100% off-site air gapped database copies, custom threat response models, and real-time auditable packet monitoring.",
        keywords: ["air gapped records", "defense score advantages", "zero cold starts"],
        ogTitle: "Why Corporate Platforms Select Eurosia Defender X Shield Systems",
        ogDescription: "Zero cold-start container response times, 100% off-site air gapped database copies, custom threat response models, and real-time auditable packet monitoring.",
        ogImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200&h=630",
        twitterCard: "summary_large_image",
        canonicalUrl: "https://eurosia.com/#why-us",
        structuredDataJson: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Strategic Advantages — Eurosia Defender",
          "description": "Explore our defensive score matrices."
        }, null, 2)
      },
      {
        path: "contact",
        title: "Establish Secure Transceiver Connection — Contact Security Dispatch",
        description: "Log your cyber incident, file secure vulnerability sweep queries, or establish encrypted private VPN networks with our 24/7 security dispatch center.",
        keywords: ["incident hot channel", "request vulnerability sweep", "encrypted routing"],
        ogTitle: "Establish Secure Transceiver Connection — Contact Security Dispatch",
        ogDescription: "Log your cyber incident, file secure vulnerability sweep queries, or establish encrypted private VPN networks with our 24/7 security dispatch center.",
        ogImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200&h=630",
        twitterCard: "summary_large_image",
        canonicalUrl: "https://eurosia.com/#contact",
        structuredDataJson: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Eurosia Hotline Command Center",
          "description": "Contact Eurosia secure dispatch team."
        }, null, 2)
      }
    ];

    const DEFAULT_SEO_GLOBAL: SeoGlobalConfig = {
      siteName: "Eurosia Defender X Core System",
      robotsTxt: "User-agent: *\nAllow: /\nSitemap: https://eurosia.com/sitemap.xml",
      googleAnalyticsId: "G-GA4EURSIA77",
      googleSearchConsoleVerification: "gsc-verification-code-eurosia-12345",
      bingWebmasterVerification: "bing-verification-code-eurosia-12345",
      facebookUrl: "https://www.facebook.com/EurosiaOfficial",
      twitterUrl: "https://x.com/EurosiaOfficial",
      linkedinUrl: "https://linkedin.com/in/EurosiaOfficial",
      organizationSchemaJson: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "url": "https://eurosia.com",
        "logo": "https://eurosia.com/assets/logo.png",
        "name": "Eurosia Technologies",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+8801711408725",
          "contactType": "Emergency Threat Response Team"
        },
        "sameAs": [
          "https://www.facebook.com/EurosiaOfficial",
          "https://x.com/EurosiaOfficial",
          "https://linkedin.com/in/EurosiaOfficial"
        ]
      }, null, 2),
      localBusinessSchemaJson: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Eurosia SecOps HQ",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Motijheel Commercial Area, Tower 12",
          "addressLocality": "Dhaka",
          "postalCode": "1000",
          "addressCountry": "BD"
        },
        "telephone": "+8801711408725"
      }, null, 2)
    };

    const DEFAULT_SEO_REDIRECTS: SeoRedirect[] = [
      {
        id: "red-991",
        sourcePath: "/old-services",
        targetPath: "/#services",
        statusCode: 301,
        createdAt: new Date().toISOString()
      },
      {
        id: "red-992",
        sourcePath: "/emergency-help",
        targetPath: "/#contact",
        statusCode: 302,
        createdAt: new Date().toISOString()
      }
    ];

    const DEFAULT_BROKEN_LINKS: BrokenLink[] = [
      {
        id: "br-110",
        url: "/wp-admin.php",
        referrer: "https://crawler.attacker-recon.net",
        detectedAt: new Date(Date.now() - 3600000 * 2.5).toISOString(),
        statusCode: 404
      },
      {
        id: "br-111",
        url: "/assets/compromised-credentials.env",
        referrer: "https://github.com/security-leaks/search",
        detectedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        statusCode: 404
      }
    ];

    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_PATH)) {
        const fileContent = fs.readFileSync(DB_PATH, "utf-8");
        const parsed = JSON.parse(fileContent);
        let migrated = false;
        if (!parsed.seoPages) {
          parsed.seoPages = DEFAULT_SEO_PAGES;
          migrated = true;
        }
        if (!parsed.seoGlobal) {
          parsed.seoGlobal = DEFAULT_SEO_GLOBAL;
          migrated = true;
        } else {
          // Sync missing social fields to existing globally stored config schema
          if (!parsed.seoGlobal.facebookUrl) {
            parsed.seoGlobal.facebookUrl = DEFAULT_SEO_GLOBAL.facebookUrl;
            migrated = true;
          }
          if (!parsed.seoGlobal.twitterUrl) {
            parsed.seoGlobal.twitterUrl = DEFAULT_SEO_GLOBAL.twitterUrl;
            migrated = true;
          }
          if (!parsed.seoGlobal.linkedinUrl) {
            parsed.seoGlobal.linkedinUrl = DEFAULT_SEO_GLOBAL.linkedinUrl;
            migrated = true;
          }
          // Sync sameAs block inside existing organization schema JSON if available
          if (parsed.seoGlobal.organizationSchemaJson) {
            try {
              const orgObj = JSON.parse(parsed.seoGlobal.organizationSchemaJson);
              if (!orgObj.sameAs) {
                orgObj.sameAs = [
                  "https://www.facebook.com/EurosiaOfficial",
                  "https://x.com/EurosiaOfficial",
                  "https://linkedin.com/in/EurosiaOfficial"
                ];
                parsed.seoGlobal.organizationSchemaJson = JSON.stringify(orgObj, null, 2);
                migrated = true;
              }
            } catch (e) {}
          }
        }
        if (!parsed.seoRedirects) {
          parsed.seoRedirects = DEFAULT_SEO_REDIRECTS;
          migrated = true;
        }
        if (!parsed.brokenLinks) {
          parsed.brokenLinks = DEFAULT_BROKEN_LINKS;
          migrated = true;
        }
        if (migrated) {
          fs.writeFileSync(DB_PATH, JSON.stringify(parsed, null, 2), "utf-8");
          console.log("[DATABASE] Successfully migrated SEO entities inside dynamic db file.");
        }
        return parsed;
      }
    } catch (e) {
      console.error("[DATABASE] Failed to read cached database on disk. Initializing backup structures:", e);
    }

    // Default High-Integrity Cyberspace Seed Records
    const defaultState: DatabaseSchema = {
      users: {
        "admin@eurosia.com": {
          user: {
            id: "u-admin",
            email: "admin@eurosia.com",
            name: "Admin Operator",
            role: "admin",
            accessLevel: "L9 Secure Clear",
            isVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          pass: "EUROSIA@Admin2024",
        },
        "user@eurosia.com": {
          user: {
            id: "u-analyst",
            email: "user@eurosia.com",
            name: "Security Analyst",
            role: "analyst",
            accessLevel: "L4 Operations",
            isVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          pass: "User@2024",
        },
        "readonly@eurosia.com": {
          user: {
            id: "u-readonly",
            email: "readonly@eurosia.com",
            name: "Read-Only Operator",
            role: "readonly",
            accessLevel: "L2 Audit Only",
            isVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          pass: "Readonly@2024",
        },
      },
      alerts: [
        {
          id: "AL-109",
          timestamp: "00:02:18 AGO",
          severity: "critical",
          title: "Distributed Denial of Service (DDoS) Raid",
          source: "185.190.140.23",
          status: "active",
          description: "High frequency volumetric SYN flood targeting Gateway-99 (Port 443). Traffic volume exceeding 14.2 Gbps.",
          category: "DDOS",
        },
        {
          id: "AL-108",
          timestamp: "00:14:45 AGO",
          severity: "warning",
          title: "Phishing Ransomware Variant Isolated",
          source: "10.0.12.89",
          status: "investigating",
          description: "Intelligent signature matching detected LockBit 3.0 attempt in accounting server segment. Decryption attempts blocked.",
          category: "RANSOMWARE",
        },
        {
          id: "AL-107",
          timestamp: "00:41:12 AGO",
          severity: "info",
          title: "Reconnaissance Port Scanning",
          source: "45.143.203.49",
          status: "resolved",
          description: "Sequential TCP port scan detected on Subnet C external routers. 1,024 ports scanned and packet drops initiated.",
          category: "PORT_SCAN",
        },
        {
          id: "AL-106",
          timestamp: "01:12:00 AGO",
          severity: "warning",
          title: "Brute-Force Attack Throttled",
          source: "213.255.45.109",
          status: "resolved",
          description: "Repeated unauthorized SSH access attempts on cluster terminal-77. IP blocked after 5 failed authentication phases.",
          category: "INTRUSION",
        },
      ],
      firewallRules: [
        { id: "1", port: 22, service: "SSH (Secure Command Shell)", status: "monitored" },
        { id: "2", port: 80, service: "HTTP (Standard Web Traffic)", status: "open" },
        { id: "3", port: 443, service: "HTTPS (Encrypted SSL Web)", status: "monitored" },
        { id: "4", port: 3306, service: "MySQL Enterprise Database", status: "blocked" },
        { id: "5", port: 1433, service: "MS-SQL Node Communication", status: "blocked" },
      ],
      logs: [
        { id: "log-1", timestamp: "00:51:10", source: "ADMIN_ROUTER", logtext: "SecOps Core direct transceiver channel authenticated successfully.", type: "system" },
        { id: "log-2", timestamp: "00:51:24", source: "185.190.140.23", logtext: "SYNDROP Filter flagged volume attack exceeding threshold.", type: "incoming" },
        { id: "log-3", timestamp: "00:51:30", source: "10.0.12.89", logtext: "LockBit signatures caught in Isolated Virtual Subnet B.", type: "blocked" },
        { id: "log-4", timestamp: "00:51:39", source: "MS-SQL-03", logtext: "Database port 1433 state forced to SECURE BYPASS BLOCK by default policy.", type: "system" },
      ],
      auditLogs: [
        {
          id: "audit-98821",
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          operator: "Admin Operator",
          action: "FIREWALL HARDENING - Appended high intensity shunting vectors to isolate relational database ports 3306/1433 by default.",
          ip: "10.0.8.21"
        },
        {
          id: "audit-77218",
          timestamp: new Date(Date.now() - 3600000 * 3.5).toISOString(),
          operator: "Security Analyst",
          action: "INCIDENT CONSTITUTION - Configured trace packet routing into sandbox machine matching critical event AL-108.",
          ip: "10.0.12.89"
        },
        {
          id: "audit-33419",
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
          operator: "Admin Operator",
          action: "TACTICAL PIVOT - Raised default perimeter shield intensity levels from STANDARD to SHIELDED.",
          ip: "127.0.0.1"
        }
      ],
      posture: {
        globalThreatLevel: "elevated",
        defenseMode: "SHIELDED",
      },
      contactInquiries: [],
      seoPages: DEFAULT_SEO_PAGES,
      seoGlobal: DEFAULT_SEO_GLOBAL,
      seoRedirects: DEFAULT_SEO_REDIRECTS,
      brokenLinks: DEFAULT_BROKEN_LINKS,
    };

    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultState, null, 2), "utf-8");
    } catch (e) {
      console.error("[DATABASE] Writing initial database snapshot to volume failed:", e);
    }

    return defaultState;
  }

  private persist() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(this.state, null, 2), "utf-8");
    } catch (e) {
      console.error("[DATABASE] Critical: Persistence failure to synchronized DB file:", e);
    }
  }

  // ==================== USERS REPOSITORY ====================
  public getUserByEmail(email: string) {
    const key = email.toLowerCase().trim();
    return this.state.users[key] || null;
  }

  public createUser(email: string, user: User, passHash: string) {
    const key = email.toLowerCase().trim();
    this.state.users[key] = { user, pass: passHash };
    this.persist();
    return user;
  }

  public updateUser(email: string, user: User) {
    const key = email.toLowerCase().trim();
    if (this.state.users[key]) {
      this.state.users[key].user = user;
      this.persist();
      return user;
    }
    return null;
  }

  public updateUserSecCredentials(email: string, updates: { pass?: string; refreshToken?: string }) {
    const key = email.toLowerCase().trim();
    if (this.state.users[key]) {
      if (updates.pass !== undefined) this.state.users[key].pass = updates.pass;
      if (updates.refreshToken !== undefined) this.state.users[key].refreshToken = updates.refreshToken;
      this.persist();
      return true;
    }
    return false;
  }

  public getAllUsers(): User[] {
    return Object.values(this.state.users).map((u) => u.user);
  }

  // ==================== ALERTS REPOSITORY ====================
  public getAlerts(): ThreatAlert[] {
    return this.state.alerts;
  }

  public getAlertById(id: string): ThreatAlert | null {
    return this.state.alerts.find(a => a.id === id) || null;
  }

  public updateAlert(id: string, status: "active" | "investigating" | "resolved") {
    const alert = this.state.alerts.find(a => a.id === id);
    if (alert) {
      alert.status = status;
      this.persist();
      return alert;
    }
    return null;
  }

  // ==================== FIREWALL RULES ====================
  public getFirewallRules(): FirewallRule[] {
    return this.state.firewallRules;
  }

  public updateFirewallRule(id: string, status: "blocked" | "open" | "monitored") {
    const rule = this.state.firewallRules.find(r => r.id === id);
    if (rule) {
      rule.status = status;
      this.persist();
      return rule;
    }
    return null;
  }

  public setAllFirewallRules(rules: FirewallRule[]) {
    this.state.firewallRules = rules;
    this.persist();
  }

  // ==================== SYSTEM LOGS REPOSITORY ====================
  public getLogs(): SecurityEventLog[] {
    return this.state.logs;
  }

  public addLog(source: string, logtext: string, type: "incoming" | "blocked" | "resolved" | "system") {
    const timestamp = new Date().toISOString().substring(11, 19);
    const newLog: SecurityEventLog = {
      id: `log-${Math.random().toString().substring(2, 7)}`,
      timestamp,
      source,
      logtext,
      type,
    };
    this.state.logs.unshift(newLog);
    if (this.state.logs.length > 50) this.state.logs.pop();
    this.persist();
    return newLog;
  }

  // ==================== AUDIT COMPLIANCE REPOSITORY ====================
  public getAuditLogs(): AuditLog[] {
    return this.state.auditLogs;
  }

  public addAuditLog(operator: string, action: string, ip: string) {
    const newAudit: AuditLog = {
      id: `audit-${Math.random().toString().substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      operator,
      action,
      ip,
    };
    this.state.auditLogs.unshift(newAudit);
    if (this.state.auditLogs.length > 100) this.state.auditLogs.pop();
    this.persist();
    return newAudit;
  }

  // ==================== POSTURE REPOSITORY ====================
  public getPosture(): SecurityPosture {
    return this.state.posture;
  }

  public updatePosture(defenseMode: string, globalThreatLevel: string) {
    this.state.posture.defenseMode = defenseMode;
    this.state.posture.globalThreatLevel = globalThreatLevel;
    this.persist();
    return this.state.posture;
  }

  // ==================== INQUIRIES REPOSITORY ====================
  public addContactInquiry(name: string, email: string, company: string, message: string) {
    const inquiry: ContactInquiry = {
      id: `inq-${Math.random().toString().substring(2, 7)}`,
      name,
      email,
      company,
      message,
      status: "pending",
      createdAt: new Date().toISOString()
    };
    this.state.contactInquiries.push(inquiry);
    this.persist();
    return inquiry;
  }

  public getContactInquiries(): ContactInquiry[] {
    return this.state.contactInquiries;
  }

  // ==================== ENTERPRISE SEO REPOSITORY ====================
  public getSeoPages(): SeoPageConfig[] {
    return this.state.seoPages || [];
  }

  public getSeoPageByPath(pathName: string): SeoPageConfig | null {
    return (this.state.seoPages || []).find(p => p.path === pathName) || null;
  }

  public updateSeoPage(pathName: string, updates: Partial<SeoPageConfig>): SeoPageConfig | null {
    if (!this.state.seoPages) this.state.seoPages = [];
    const index = this.state.seoPages.findIndex(p => p.path === pathName);
    if (index !== -1) {
      this.state.seoPages[index] = { ...this.state.seoPages[index], ...updates };
      this.persist();
      return this.state.seoPages[index];
    } else {
      const newPage: SeoPageConfig = {
        path: pathName,
        title: updates.title || "",
        description: updates.description || "",
        keywords: updates.keywords || [],
        ogTitle: updates.ogTitle || updates.title || "",
        ogDescription: updates.ogDescription || updates.description || "",
        ogImage: updates.ogImage || "",
        twitterCard: updates.twitterCard || "summary_large_image",
        canonicalUrl: updates.canonicalUrl || "",
        structuredDataJson: updates.structuredDataJson || "{}",
      };
      this.state.seoPages.push(newPage);
      this.persist();
      return newPage;
    }
  }

  public getSeoGlobal(): SeoGlobalConfig {
    return this.state.seoGlobal;
  }

  public updateSeoGlobal(updates: Partial<SeoGlobalConfig>): SeoGlobalConfig {
    this.state.seoGlobal = { ...this.state.seoGlobal, ...updates };
    this.persist();
    return this.state.seoGlobal;
  }

  public getSeoRedirects(): SeoRedirect[] {
    return this.state.seoRedirects || [];
  }

  public addSeoRedirect(sourcePath: string, targetPath: string, statusCode: number): SeoRedirect {
    if (!this.state.seoRedirects) this.state.seoRedirects = [];
    const newRedirect: SeoRedirect = {
      id: `red-${Math.random().toString().substring(2, 7)}`,
      sourcePath,
      targetPath,
      statusCode,
      createdAt: new Date().toISOString()
    };
    this.state.seoRedirects.push(newRedirect);
    this.persist();
    return newRedirect;
  }

  public removeSeoRedirect(id: string): boolean {
    if (!this.state.seoRedirects) return false;
    const initialLen = this.state.seoRedirects.length;
    this.state.seoRedirects = this.state.seoRedirects.filter(r => r.id !== id);
    if (this.state.seoRedirects.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  public getBrokenLinks(): BrokenLink[] {
    return this.state.brokenLinks || [];
  }

  public recordBrokenLink(url: string, referrer: string, statusCode: number = 404): BrokenLink {
    if (!this.state.brokenLinks) this.state.brokenLinks = [];
    const existing = this.state.brokenLinks.find(b => b.url === url && b.referrer === referrer);
    if (existing) {
      existing.detectedAt = new Date().toISOString();
      existing.statusCode = statusCode;
      this.persist();
      return existing;
    }

    const newBroken: BrokenLink = {
      id: `br-${Math.random().toString().substring(2, 7)}`,
      url,
      referrer: referrer || "Direct Access",
      detectedAt: new Date().toISOString(),
      statusCode
    };
    this.state.brokenLinks.push(newBroken);
    this.persist();
    return newBroken;
  }

  public clearBrokenLinks(): void {
    this.state.brokenLinks = [];
    this.persist();
  }
}

export const db = new SecurityDatabase();
