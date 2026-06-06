import { db } from "../repositories/database";

export class SecOpsService {
  public static getAlerts() {
    const posture = db.getPosture();
    return {
      alerts: db.getAlerts(),
      threatLevel: posture.globalThreatLevel,
      defenseMode: posture.defenseMode,
    };
  }

  public static updateAlertStatus(id: string, status: "investigating" | "resolved", operatorName: string, ip: string) {
    const alert = db.getAlertById(id);
    if (!alert) {
      return { error: "ALERT_NOT_FOUND", status: 404 };
    }

    db.updateAlert(id, status);

    // Logging & auditing
    db.addLog(id, `Incident status designated '${status.toUpperCase()}' by operator: ${operatorName}`, status === "resolved" ? "resolved" : "incoming");
    db.addAuditLog(operatorName, `INCIDENT UPDATE - ${id} to ${status.toUpperCase()}`, ip);

    return {
      success: true,
      alert: db.getAlertById(id)
    };
  }

  public static getLogs() {
    return { logs: db.getLogs() };
  }

  public static addCustomLog(source: string, logtext: string, type: "incoming" | "blocked" | "resolved" | "system") {
    const newLog = db.addLog(source, logtext, type);
    return {
      success: true,
      log: newLog,
      logs: db.getLogs()
    };
  }

  public static getFirewallRules() {
    return { firewall: db.getFirewallRules() };
  }

  public static getAuditLogs() {
    return { auditLogs: db.getAuditLogs() };
  }

  public static toggleFirewallRule(id: string, operatorName: string, ip: string) {
    const rules = db.getFirewallRules();
    const rule = rules.find(r => r.id === id);
    if (!rule) {
      return { error: "PORT_NOT_FOUND", status: 404 };
    }

    const oldStatus = rule.status;
    const nextStatus = oldStatus === "blocked" ? "monitored" : "blocked";

    db.updateFirewallRule(id, nextStatus);

    db.addLog(
      "FIREWALL_ENG",
      `Port ${rule.port} (${rule.service}) rules mapped from ${oldStatus.toUpperCase()} to ${nextStatus.toUpperCase()} by ${operatorName}`,
      nextStatus === "blocked" ? "blocked" : "resolved"
    );
    db.addAuditLog(operatorName, `FIREWALL OVERRIDE - PORT ${rule.port} to ${nextStatus.toUpperCase()}`, ip);

    // Automated Policy Reaction: Mitigate specific active intrusion alerts if they get locked down
    if (rule.port === 22 && nextStatus === "blocked") {
      const activeAlerts = db.getAlerts();
      activeAlerts.forEach(a => {
        if (a.category === "INTRUSION" && a.status !== "resolved") {
          db.updateAlert(a.id, "resolved");
          db.addLog(a.id, "SSH network intrusion alert automated mitigation successfully finished.", "resolved");
        }
      });
    }

    return {
      success: true,
      rule: rule
    };
  }

  public static setSecurityPosture(mode: "STANDARD" | "SHIELDED" | "HIGH_INTENSITY_LOCKDOWN", operatorName: string, ip: string) {
    const globalThreatLevel = mode === "STANDARD" ? "moderate" : mode === "SHIELDED" ? "elevated" : "severe";

    db.updatePosture(mode, globalThreatLevel);

    db.addLog("TACTICAL_CTL", `GLOBAL SHIELD STRUCTURE HARDENED TO: ${mode} BY MASTER CONSOLE KEY.`, mode === "HIGH_INTENSITY_LOCKDOWN" ? "blocked" : "system");
    db.addAuditLog(operatorName, `SHIELD LEVEL PIVOTED TO ${mode}`, ip);

    // Automation policy checks: High intensity lockdown blocks all sensitive database services immediately
    if (mode === "HIGH_INTENSITY_LOCKDOWN") {
      const rules = db.getFirewallRules();
      rules.forEach(r => {
        if (r.port === 3306 || r.port === 1433) {
          db.updateFirewallRule(r.id, "blocked");
        }
      });
      db.addLog("SHIELD_SYSTEM", "Policy enforce: Automatic firewall locks deployed on database vectors (Port 3306/1433).", "blocked");
    }

    return {
      success: true,
      posture: db.getPosture()
    };
  }
}
