export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "analyst" | "readonly";
  accessLevel: string;
  isVerified: boolean;
  verificationToken?: string;
  resetToken?: string;
  resetTokenExp?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityPosture {
  globalThreatLevel: string;
  defenseMode: string;
}

export interface ThreatAlert {
  id: string;
  timestamp: string;
  severity: "critical" | "warning" | "info";
  title: string;
  source: string;
  status: "active" | "investigating" | "resolved";
  description: string;
  category: "DDOS" | "RANSOMWARE" | "PORT_SCAN" | "INTRUSION" | "MALWARE";
}

export interface FirewallRule {
  id: string;
  port: number;
  service: string;
  status: "blocked" | "open" | "monitored";
}

export interface SecurityEventLog {
  id: string;
  timestamp: string;
  source: string;
  logtext: string;
  type: "incoming" | "blocked" | "resolved" | "system";
}

export interface AuditLog {
  id: string;
  timestamp: string;
  operator: string;
  action: string;
  ip: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  status: "pending" | "reviewed";
  createdAt: string;
}

export interface SeoPageConfig {
  path: string; // e.g. "home", "services", "about", "why-us", "contact"
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: "summary" | "summary_large_image";
  canonicalUrl: string;
  structuredDataJson: string; // Dynamic JSON-LD content
}

export interface SeoGlobalConfig {
  siteName: string;
  robotsTxt: string;
  googleAnalyticsId: string;
  googleSearchConsoleVerification: string;
  bingWebmasterVerification: string;
  organizationSchemaJson: string;
  localBusinessSchemaJson: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
}

export interface SeoRedirect {
  id: string;
  sourcePath: string; // starting with e.g. /old-services
  targetPath: string; // starting with e.g. /#services
  statusCode: number; // 301 or 302
  createdAt: string;
}

export interface BrokenLink {
  id: string;
  url: string;
  referrer: string;
  detectedAt: string;
  statusCode: number;
}

