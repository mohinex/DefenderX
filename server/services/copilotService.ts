import { GoogleGenAI } from "@google/genai";
import { db } from "../repositories/database";

let aiClientInstance: GoogleGenAI | null = null;
let aiInitialized = false;

function getAiClient(): GoogleGenAI | null {
  if (aiInitialized) return aiClientInstance;

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      aiClientInstance = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("[COPILOT_ENGINE] Lazy initialization of Gemini Client finished successfully.");
    } catch (e) {
      console.error("[COPILOT_ENGINE] Exception initializing Gemini client:", e);
    }
  }
  aiInitialized = true;
  return aiClientInstance;
}

export class CopilotService {
  public static async queryCopilot(query: string, alertContext: any, operatorName: string, accessLevel: string) {
    const defenseState = db.getPosture();
    const blockedPorts = db.getFirewallRules()
      .filter(f => f.status === "blocked")
      .map(f => f.port)
      .join(", ");

    const coreSystemState = `Posture ${defenseState.defenseMode}, Active threat level ${defenseState.globalThreatLevel}. Active block ports are: [${blockedPorts}].`;

    let prompt = `Role Instruction: You are Eurosia Defender X's next-generation SecOps AI Advisor. 
Provide concise, professional, expert, analytical advisory reviews and concrete tactical remediation steps (labeled with numbered bullets, max 4 bullets) for the operator's inquiry or active security incident.
Write in a highly technical, objective, calm, secure tone. Use human-friendly, crisp language.
Current Operator: ${operatorName} (Clearance: ${accessLevel}).
System State Context: ${coreSystemState}`;

    if (alertContext) {
      prompt += `\nIncident under review details: 
ID: ${alertContext.id}
Incident Name: ${alertContext.title}
Category: ${alertContext.category}
Source origin IP: ${alertContext.source}
Description: ${alertContext.description}
Severity level: ${alertContext.severity}`;
    }

    prompt += `\n\nOperator message: "${query}"\nProvide expert advice:`;

    const client = getAiClient();
    if (client) {
      try {
        const response = await client.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
        });

        const responseText = response.text || "Diagnostic analysis did not output any advisory streams.";
        return {
          sender: "copilot",
          text: responseText,
          source: "LIVE_GEMINI_AI_CONNECTOR",
        };
      } catch (err: any) {
        console.error("[GEMINI_CLIENT] Exception executing advisor prompt. Falling back to core templates:", err);
      }
    }

    // Static Local Rules Engine fallback matching
    const lowerQuery = query.toLowerCase();
    let fallbackReply = "";

    if (lowerQuery.includes("firewall") || lowerQuery.includes("port") || lowerQuery.includes("rules")) {
      fallbackReply = `Eurosia Core Expert Advisory (Offline Fallback Match):
1. Review connection ports: We have detected Port 3306 (MySQL Database) and Port 1433 (MS-SQL Command) are currently BLOCKED, minimizing direct system footprint.
2. Confirm Port 22 SSH monitoring. Standard analysts shouldn't open administrative consoles without VPN encapsulations.
3. Keep standard Port 443 active with deep stateful certificate checking rules.`;
    } else if (lowerQuery.includes("lockdown") || lowerQuery.includes("shield") || lowerQuery.includes("shun")) {
      fallbackReply = `Eurosia Shunting Posture Report (Offline Fallback Match):
1. Direct connection currently runs under "${defenseState.defenseMode}" strategy levels.
2. Under high volumetric floods, trigger standard LOCKDOWN sequences instantly via the command terminal.
3. Shunting policies will block external IP routes automatically within the Class-C subnets.`;
    } else if (alertContext || lowerQuery.includes("threat") || lowerQuery.includes("analysis")) {
      const category = alertContext ? alertContext.category : "GENERAL";
      switch (category) {
        case "DDOS":
          fallbackReply = `DDoS Defense Playbook (Offline Fallback):
1. Set the main gateway router to force drops on raw packet bursts matching TCP SYN flags.
2. Deploy active CDN edge caches to absorb volumetrics before they hit endpoint routing cards.
3. Set the global Security Posture configuration immediately to HIGH_INTENSITY_LOCKDOWN.
4. Block external public facing Port 80 traffic to direct all requests via verified SSL layers.`;
          break;
        case "RANSOMWARE":
          fallbackReply = `Ransomware Containment Directive (Offline Fallback):
1. Quarantine and isolate the virtual segment accounting nodes (Target Segment 10.0.12.89) to prevent cross-server lateral movement.
2. Seal communication port 1433 (MS-SQL) instantly to safeguard live transactional payloads.
3. Initiate secure cold-storage transceiver recoveries from the off-site backup vault.
4. Mount cryptographic inspection scanners on deep system logs to trap residual keys.`;
          break;
        case "PORT_SCAN":
          fallbackReply = `Port Scan Discovery Assessment (Offline Fallback):
1. Blacklist scanned origin sequences matching raw subnet block 45.143.203.xx.
2. Turn off TCP/ICMP ping echo answers, making internal network targets completely silent to external sensors.
3. Upgrade threat posture metrics to track incoming scans as persistent precursors to attacks.`;
          break;
        case "INTRUSION":
          fallbackReply = `Brute Force Intrusion Thwarting Script (Offline Fallback):
1. Lock Port 22 (SSH) status rule to BLOCKED to instantly contain unauthorized terminal scanning.
2. Transition active authentication rules to strictly enforce Hardware MFA tokens for console operators.
3. Ensure failed login rates from similar subnets trigger 12-hour block timeouts dynamically.`;
          break;
        default:
          fallbackReply = `SecOps Diagnostics Advisor (Offline Fallback):
1. Verify system telemetry stats showing ${db.getFirewallRules().filter(f => f.status === "blocked").length} isolated port vectors.
2. Keep continuous inspection alerts active on peripheral connection bridges.
3. Run structural malware checks across critical system directory sectors.`;
      }
    } else {
      fallbackReply = `SecOps Direct Advisory (Offline Fallback):
Hello Operator! Your transceiver connection is registered. The system is operating securely.
If you notice increased alert volumes, you should verify firewall blocks, apply local VPN segments, or pivot the global defense mode to high lockdown blocks immediately.`;
    }

    return {
      sender: "copilot",
      text: fallbackReply,
      source: "OFFLINE_LOCAL_EXPERT_CORE",
      notice: "Operative notice: SECURE CHIP OFFLINE // Running inside native client-safe defense templates."
    };
  }
}
