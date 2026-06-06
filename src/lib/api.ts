// ==========================================
// ENTERPRISE SECOPS CLIENT-SIDE API CLIENT
// ==========================================
import { ThreatAlert, FirewallRule, SecurityEventLog } from "../types";

export interface LoggedUser {
  email: string;
  name: string;
  role: "admin" | "analyst" | "readonly";
  accessLevel: string;
  exp: number;
}

// Global in-memory/localStorage store for offline operation fallback
const OFFLINE_STORE_KEY = "eurosia_offline_db";

interface OfflineSchema {
  alerts: ThreatAlert[];
  firewall: FirewallRule[];
  logs: SecurityEventLog[];
  defensePosture: { globalThreatLevel: string; defenseMode: string };
  users: { email: string; name: string; role: "admin" | "analyst" | "readonly"; accessLevel: string }[];
}

const DEFAULT_OFFLINE_DB: OfflineSchema = {
  alerts: [
    {
      id: "AL-109",
      timestamp: "00:02:18 AGO",
      severity: "critical",
      title: "Distributed Denial of Service (DDoS) Raid [OFFLINE MODE]",
      source: "185.190.140.23",
      status: "active",
      description: "High frequency volumetric SYN flood targeting Gateway-99 (Port 443). Traffic volume exceeding 14.2 Gbps.",
      category: "DDOS",
    },
    {
      id: "AL-108",
      timestamp: "00:14:45 AGO",
      severity: "warning",
      title: "Phishing Ransomware Variant Isolated [OFFLINE MODE]",
      source: "10.0.12.89",
      status: "investigating",
      description: "Intelligent signature matching detected LockBit 3.0 attempt in accounting server segment. Decryption attempts blocked.",
      category: "RANSOMWARE",
    },
    {
      id: "AL-107",
      timestamp: "00:41:12 AGO",
      severity: "info",
      title: "Reconnaissance Port Scanning [OFFLINE MODE]",
      source: "45.143.203.49",
      status: "resolved",
      description: "Sequential TCP port scan detected on Subnet C external routers. 1,024 ports scanned and packet drops initiated.",
      category: "PORT_SCAN",
    },
    {
      id: "AL-106",
      timestamp: "01:12:00 AGO",
      severity: "warning",
      title: "Brute-Force Attack Throttled [OFFLINE MODE]",
      source: "213.255.45.109",
      status: "resolved",
      description: "Repeated unauthorized SSH access attempts on cluster terminal-77. IP blocked after 5 failed authentication phases.",
      category: "INTRUSION",
    },
  ],
  firewall: [
    { id: "1", port: 22, service: "SSH (Secure Command Shell)", status: "monitored" },
    { id: "2", port: 80, service: "HTTP (Standard Web Traffic)", status: "open" },
    { id: "3", port: 443, service: "HTTPS (Encrypted SSL Web)", status: "monitored" },
    { id: "4", port: 3306, service: "MySQL Enterprise Database", status: "blocked" },
    { id: "5", port: 1433, service: "MS-SQL Node Communication", status: "blocked" },
  ],
  logs: [
    { id: "log-1", timestamp: "01:02:10", source: "LOCAL_TUNNEL", logtext: "SecOps Core operating under offline-secure sandbox buffers.", type: "system" },
  ],
  defensePosture: { globalThreatLevel: "elevated", defenseMode: "SHIELDED" },
  users: [
    { email: "admin@eurosia.com", name: "Admin Operator", role: "admin", accessLevel: "L9 Secure Clear" },
    { email: "user@eurosia.com", name: "Security Analyst", role: "analyst", accessLevel: "L4 Operations" },
    { email: "readonly@eurosia.com", name: "Read-Only Operator", role: "readonly", accessLevel: "L2 Audit Only" },
  ],
};

function getOfflineDB(): OfflineSchema {
  try {
    const raw = localStorage.getItem(OFFLINE_STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem(OFFLINE_STORE_KEY, JSON.stringify(DEFAULT_OFFLINE_DB));
  return DEFAULT_OFFLINE_DB;
}

function saveOfflineDB(db: OfflineSchema) {
  try {
    localStorage.setItem(OFFLINE_STORE_KEY, JSON.stringify(db));
  } catch (e) {}
}

const requestCache: Record<string, any> = {};

export const safeDecodeToken = (token: string): any | null => {
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

// Direct server API connection helper
export async function securedFetch(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = localStorage.getItem("eurosia_token");
  
  // Custom headers instantiation
  const headers = new Headers(options.headers || {});
  if (token) {
    try {
      // Clean decoded JWT access check
      const payload = safeDecodeToken(token);
      if (payload && payload.exp > Date.now()) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    } catch (e) {}
  }
  
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const completeOptions = { ...options, headers };

  try {
    const response = await fetch(endpoint, completeOptions);
    
    if (response.status === 401 || response.status === 412 || response.status === 403) {
      // Authorization failure triggers clear session signals
      localStorage.removeItem("eurosia_token");
      window.dispatchEvent(new CustomEvent("secops-unauthorized"));
      throw new Error("UNAUTHORIZED_TUNNEL_HANDSHAKE");
    }

    if (!response.ok) {
      const errPayload = await response.json().catch(() => ({}));
      throw new Error(errPayload.message || `API Error Status: ${response.status}`);
    }

    return await response.json();
  } catch (err: any) {
    // If the network request fails or is blocked by an offline mode environment 
    console.warn(`[API-FALLBACK] Connecting to '${endpoint}' failed. Diverting execution flow into offline sandbox:`, err.message);
    return handleOfflineFallback(endpoint, options, err.message);
  }
}

// Handle all states offline when server isn't available
function handleOfflineFallback(endpoint: string, options: RequestInit, errMsg: string): any {
  const db = getOfflineDB();
  const method = (options.method || "GET").toUpperCase();

  // Authentication Handshake Fallback
  if (endpoint.includes("/auth/login") && method === "POST") {
    const body = JSON.parse(options.body as string || "{}");
    const email = (body.email || "").toLowerCase().trim();
    const pass = body.password;

    const matchedUser = db.users.find(u => u.email.toLowerCase() === email);
    
    // Default valid passwords for falling back
    const defaultPasswords: Record<string, string> = {
      "admin@eurosia.com": "EUROSIA@Admin2024",
      "user@eurosia.com": "User@2024",
      "readonly@eurosia.com": "Readonly@2024",
    };

    if (matchedUser && pass === (defaultPasswords[matchedUser.email] || "User@2024")) {
      const user: LoggedUser = {
        email: matchedUser.email,
        name: matchedUser.name,
        role: matchedUser.role,
        accessLevel: matchedUser.accessLevel,
        exp: Date.now() + 86400000,
      };

      // Set custom offline notification event
      window.dispatchEvent(new CustomEvent("secops-toast", {
        detail: { text: "CONNECTED VIA OFFLINE DECENTRALIZED HANDSHAKE UNIT", type: "system" }
      }));

      const rawToken = btoa(JSON.stringify(user));
      return { status: "BRIDGED_LOCK_ACTIVE", token: rawToken, user };
    } else {
      throw new Error("Incorrect offline token credentials.");
    }
  }

  // Fetch users fallback
  if (endpoint.includes("/api/v1/users") && method === "GET") {
    return { users: db.users };
  }

  // Update user role fallback
  if (endpoint.includes("/api/v1/users/") && endpoint.includes("/role") && method === "PATCH") {
    const emailToFind = endpoint.split("/").slice(-2)[0].toLowerCase().trim();
    const body = JSON.parse(options.body as string || "{}");
    const newRole = body.role;

    // Extract our own token to check check isAuthorized admin
    const token = localStorage.getItem("eurosia_token");
    let isAuthorized = false;
    let operatorName = "Offline Operator";

    if (token) {
      try {
        const decoded = safeDecodeToken(token);
        if (decoded) {
          isAuthorized = decoded.role === "admin";
          operatorName = decoded.name;
        }
      } catch (e) {}
    }

    if (!isAuthorized) {
      throw new Error("L9 clearance administrative credentials required to manage roles offline.");
    }

    const idx = db.users.findIndex(u => u.email.toLowerCase() === emailToFind);
    if (idx !== -1) {
      const matchedU = db.users[idx];
      
      // Self-lockout check
      let selfEmail = "";
      if (token) {
        try {
          const decoded = safeDecodeToken(token);
          if (decoded) {
            selfEmail = decoded.email.toLowerCase().trim();
          }
        } catch(e){}
      }
      if (selfEmail === emailToFind && newRole !== "admin") {
        throw new Error("Safety bypass triggered: You cannot revoke admin privileges from your own active profile.");
      }

      const oldRole = matchedU.role;
      matchedU.role = newRole;

      if (newRole === "admin") matchedU.accessLevel = "L9 Secure Clear";
      else if (newRole === "analyst") matchedU.accessLevel = "L4 Operations";
      else matchedU.accessLevel = "L2 Audit Only";

      db.logs.unshift({
        id: `log-${Math.random().toString().substring(2, 6)}`,
        timestamp: new Date().toISOString().substring(11, 19),
        source: "ACCESS_CTRL",
        logtext: `Offline Role update: Operator ${matchedU.name} clearance re-assigned from ${oldRole.toUpperCase()} to ${newRole.toUpperCase()} by ${operatorName}`,
        type: "system",
      });

      saveOfflineDB(db);
      return { success: true, user: matchedU };
    } else {
      throw new Error("Specified offline operator was not found.");
    }
  }

  // Fetch alerts fallback
  if (endpoint.includes("/secops/alerts") && method === "GET") {
    return {
      alerts: db.alerts,
      threatLevel: db.defensePosture.globalThreatLevel,
      defenseMode: db.defensePosture.defenseMode,
    };
  }

  // Update alert status fallback
  if (endpoint.includes("/secops/alerts/") && method === "PATCH") {
    const alertId = endpoint.split("/").pop();
    const body = JSON.parse(options.body as string || "{}");
    const nextStatus = body.status;

    const token = localStorage.getItem("eurosia_token");
    let isReadonly = false;
    if (token) {
      try {
        const decoded = safeDecodeToken(token);
        if (decoded) {
          isReadonly = decoded.role === "readonly";
        }
      } catch (e) {}
    }
    if (isReadonly) {
      throw new Error("Insufficient privilege: Read-Only accounts cannot mutate active threat alerts.");
    }

    const idx = db.alerts.findIndex(a => a.id === alertId);
    if (idx !== -1) {
      db.alerts[idx].status = nextStatus;
      db.logs.unshift({
        id: `log-${Math.random().toString().substring(2, 6)}`,
        timestamp: new Date().toISOString().substring(11, 19),
        source: alertId || "OFFLINE_CORE",
        logtext: `Offline update: Threat categorized '${nextStatus.toUpperCase()}' by operator.`,
        type: nextStatus === "resolved" ? "resolved" : "incoming",
      });
      saveOfflineDB(db);
    }
    return { success: true, alert: db.alerts[idx] };
  }

  // Fetch security event logs fallback
  if (endpoint.includes("/secops/logs") && method === "GET") {
    return { logs: db.logs };
  }

  // Append new custom logs
  if (endpoint.includes("/secops/logs") && method === "POST") {
    const body = JSON.parse(options.body as string || "{}");

    const token = localStorage.getItem("eurosia_token");
    let isReadonly = false;
    if (token) {
      try {
        const decoded = safeDecodeToken(token);
        if (decoded) {
          isReadonly = decoded.role === "readonly";
        }
      } catch (e) {}
    }
    if (isReadonly) {
      throw new Error("Insufficient privilege: Read-Only accounts cannot inject manual log operations.");
    }

    db.logs.unshift({
      id: `log-${Math.random().toString().substring(2, 6)}`,
      timestamp: new Date().toISOString().substring(11, 19),
      source: body.source || "LOCAL",
      logtext: body.logtext || "",
      type: body.type || "system",
    });
    if (db.logs.length > 40) db.logs.pop();
    saveOfflineDB(db);
    return { success: true, logs: db.logs };
  }

  // Fetch firewall rules fallback
  if (endpoint.includes("/secops/firewall") && method === "GET") {
    return { firewall: db.firewall };
  }

  // Toggle firewall rule fallback (L9 check)
  if (endpoint.includes("/secops/firewall/") && method === "PATCH") {
    const ruleId = endpoint.split("/").pop();
    const token = localStorage.getItem("eurosia_token");
    let isAuthorized = false;
    let operatorName = "Offline Operator";

    if (token) {
      try {
        const decoded = safeDecodeToken(token);
        if (decoded) {
          isAuthorized = decoded.role === "admin";
          operatorName = decoded.name;
        }
      } catch (e) {}
    }

    if (!isAuthorized) {
      throw new Error("L9 clearance parameters required to manage firewall rules offline.");
    }

    const idx = db.firewall.findIndex(f => f.id === ruleId);
    if (idx !== -1) {
      const rule = db.firewall[idx];
      const oldStatus = rule.status;
      const nextStatus = oldStatus === "blocked" ? "monitored" : "blocked";
      db.firewall[idx].status = nextStatus;

      db.logs.unshift({
        id: `log-${Math.random().toString().substring(2, 6)}`,
        timestamp: new Date().toISOString().substring(11, 19),
        source: "FIREWALL_ENG",
        logtext: `Offline: Port ${rule.port} status altered to ${nextStatus.toUpperCase()} by ${operatorName}`,
        type: nextStatus === "blocked" ? "blocked" : "resolved",
      });

      if (rule.port === 22 && nextStatus === "blocked") {
        db.alerts = db.alerts.map(a => (a.category === "INTRUSION" ? { ...a, status: "resolved" } : a));
      }

      saveOfflineDB(db);
    }
    return { success: true, rule: db.firewall[idx] };
  }

  // Pivot global defense posture fallback
  if (endpoint.includes("/secops/posture") && method === "POST") {
    const body = JSON.parse(options.body as string || "{}");
    const mode = body.mode;
    const token = localStorage.getItem("eurosia_token");
    let isAuthorized = false;
    let operatorName = "Offline Operator";

    if (token) {
      try {
        const decoded = safeDecodeToken(token);
        if (decoded) {
          isAuthorized = decoded.role === "admin";
          operatorName = decoded.name;
        }
      } catch (e) {}
    }

    if (!isAuthorized) {
      throw new Error("Failed validation check. Insufficient clearance level.");
    }

    db.defensePosture.defenseMode = mode;
    db.defensePosture.globalThreatLevel = mode === "STANDARD" ? "moderate" : mode === "SHIELDED" ? "elevated" : "severe";

    db.logs.unshift({
      id: `log-${Math.random().toString().substring(2, 6)}`,
      timestamp: new Date().toISOString().substring(11, 19),
      source: "TACTICAL_CTL",
      logtext: `Offline pivot: Global posture turned fully to ${mode} by ${operatorName}.`,
      type: mode === "HIGH_INTENSITY_LOCKDOWN" ? "blocked" : "system",
    });

    if (mode === "HIGH_INTENSITY_LOCKDOWN") {
      db.firewall = db.firewall.map(f => (f.port === 3306 || f.port === 1433 ? { ...f, status: "blocked" as const } : f));
    }

    saveOfflineDB(db);
    return { success: true, posture: db.defensePosture };
  }

  // Copilot Advisory Fallback
  if (endpoint.includes("/copilot/chat") && method === "POST") {
    const body = JSON.parse(options.body as string || "{}");
    const query = (body.query || "").toLowerCase();
    const alertContext = body.alertContext;

    let responseText = "";
    if (query.includes("firewall") || query.includes("port")) {
      responseText = `Eurosia Offline Copilot (Offline Mode):
1. Review connection ports: Currently, standard database ports are isolated.
2. Port 22 SSH remains heavily monitored. Verify analyst shell clearances before routing connections.
3. Establish active SSL traffic rules on secure networks.`;
    } else if (alertContext) {
      responseText = `SecOps Offline Incident Guide for active alert ${alertContext.id} (${alertContext.title}):
1. Immediately isolate the network branch containing source host: ${alertContext.source}.
2. Since threat category is ${alertContext.category}, pivot state coordinates to investigations.
3. Audit recent log heartbeats streamed from surrounding controller nodes.`;
    } else {
      responseText = `SecOps Offline Copilot AI (Offline Mode):
Welcome Operator. Secure direct server connection is down, but we are running on offline backup matrices.
I recommend toggling insecure ports or shifting posture bounds to LOCKDOWN if perimeter alerts intensify.`;
    }

    return {
      sender: "copilot",
      text: responseText,
      source: "OFFLINE_LOCAL_EXPERT_CORE",
    };
  }

  throw new Error(`Offline Sandbox Routing not found for endpoint: ${endpoint}`);
}
