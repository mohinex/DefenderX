export type UserRole = 'admin' | 'analyst' | 'readonly';

export interface User {
  email: string;
  name: string;
  role: UserRole;
  accessLevel: string;
}

export interface ThreatAlert {
  id: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  source: string;
  status: 'active' | 'investigating' | 'resolved';
  description: string;
  category: 'DDOS' | 'RANSOMWARE' | 'PORT_SCAN' | 'INTRUSION' | 'MALWARE';
}

export interface FirewallRule {
  id: string;
  port: number;
  service: string;
  status: 'blocked' | 'open' | 'monitored';
}

export interface SecOpsStatus {
  globalThreatLevel: 'low' | 'moderate' | 'elevated' | 'severe' | 'critical';
  defenseMode: 'STANDARD' | 'SHIELDED' | 'HIGH_INTENSITY_LOCKDOWN';
  activeThreatCount: number;
  cpuLoad: number;
  activeConnections: number;
  systemUptime: string;
}

export interface SecurityEventLog {
  id: string;
  timestamp: string;
  source: string;
  logtext: string;
  type: 'incoming' | 'blocked' | 'resolved' | 'system';
}
