import { Request, Response } from "express";
import { CopilotService } from "../services/copilotService";

export class CopilotController {
  public static async chat(req: Request, res: Response): Promise<void> {
    try {
      const { query, alertContext } = req.body;
      const user = (req as any).sessionUser;

      if (typeof query !== "string") {
        res.status(400).json({ error: "PARAMS_INVALID", message: "Operator inquiries must be in standard text format." });
        return;
      }

      const trimmedQuery = query.trim();
      if (trimmedQuery.length === 0) {
        res.status(400).json({ error: "PARAMS_EMPTY", message: "System advisories cannot review empty inquiry states." });
        return;
      }

      if (trimmedQuery.length > 1000) {
        res.status(400).json({ error: "OVERFLOW_ATTEMPT", message: "Buffer safe check violated. Chat query text too long." });
        return;
      }

      const responsePayload = await CopilotService.queryCopilot(
        trimmedQuery,
        alertContext,
        user.name,
        user.accessLevel
      );

      res.json(responsePayload);
    } catch (e: any) {
      console.error("[COPILOT CONTROLLER ERROR]", e);
      res.status(500).json({ error: "INTERNAL_FAULT", message: "Copilot consultation channel temporarily occupied. Stand by." });
    }
  }
}
