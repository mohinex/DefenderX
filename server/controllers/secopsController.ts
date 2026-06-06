import { Request, Response } from "express";
import { SecOpsService } from "../services/secopsService";

export class SecOpsController {
  public static getAlerts(req: Request, res: Response): void {
    try {
      const data = SecOpsService.getAlerts();
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: "INTERNAL_FAULT", message: "Failed to query system active threat structures." });
    }
  }

  public static updateAlert(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const operator = (req as any).sessionUser;

      if (typeof id !== "string" || typeof status !== "string") {
        res.status(400).json({ error: "PARAMS_INVALID", message: "Threat identifier or target state structure malformed." });
        return;
      }

      if (status !== "investigating" && status !== "resolved") {
        res.status(400).json({ error: "INVALID_STATE", message: "Assigned target incident state contains an illegal option." });
        return;
      }

      const clientIp = req.header("x-forwarded-for") || req.socket.remoteAddress || "127.0.0.1";
      const result = SecOpsService.updateAlertStatus(id, status, operator.name, clientIp);

      if ("error" in result) {
        res.status(result.status || 400).json({ error: result.error, message: "Threat transition step rejected." });
        return;
      }

      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: "INTERNAL_FAULT", message: "Critical threat tracking compilation error." });
    }
  }

  public static getLogs(req: Request, res: Response): void {
    try {
      const data = SecOpsService.getLogs();
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: "INTERNAL_FAULT", message: "Logs querying segment failed." });
    }
  }

  public static getFirewall(req: Request, res: Response): void {
    try {
      const data = SecOpsService.getFirewallRules();
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: "INTERNAL_FAULT", message: "Port routing catalog querying failed." });
    }
  }

  public static getAuditLogs(req: Request, res: Response): void {
    try {
      const data = SecOpsService.getAuditLogs();
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: "INTERNAL_FAULT", message: "Logs querying from audit database failed." });
    }
  }

  public static addLog(req: Request, res: Response): void {
    try {
      const { source, logtext, type } = req.body;

      if (!source || !logtext || !type) {
        res.status(400).json({ error: "PARAMS_MISSING", message: "Required logging properties are missing." });
        return;
      }

      if (type !== "incoming" && type !== "blocked" && type !== "resolved" && type !== "system") {
        res.status(400).json({ error: "PARAMS_INVALID", message: "Supplied event category is unknown." });
        return;
      }

      const result = SecOpsService.addCustomLog(source, logtext, type);
      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: "INTERNAL_FAULT", message: "System trace registration error." });
    }
  }

  public static toggleFirewall(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const operator = (req as any).sessionUser;

      if (typeof id !== "string") {
        res.status(400).json({ error: "PARAMS_INVALID", message: "Port identifier string token is invalid." });
        return;
      }

      const clientIp = req.header("x-forwarded-for") || req.socket.remoteAddress || "127.0.0.1";
      const result = SecOpsService.toggleFirewallRule(id, operator.name, clientIp);

      if ("error" in result) {
        res.status(result.status || 400).json({ error: result.error, message: "Rule mapping toggle rejected." });
        return;
      }

      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: "INTERNAL_FAULT", message: "Rule compiler translation failed." });
    }
  }

  public static setPosture(req: Request, res: Response): void {
    try {
      const { mode } = req.body;
      const operator = (req as any).sessionUser;

      if (mode !== "STANDARD" && mode !== "SHIELDED" && mode !== "HIGH_INTENSITY_LOCKDOWN") {
        res.status(400).json({ error: "PARAMS_INVALID", message: "Selected posture layout configuration has unregistered states." });
        return;
      }

      const clientIp = req.header("x-forwarded-for") || req.socket.remoteAddress || "127.0.0.1";
      const result = SecOpsService.setSecurityPosture(mode, operator.name, clientIp);

      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: "INTERNAL_FAULT", message: "Global state controller translation failed." });
    }
  }
}
