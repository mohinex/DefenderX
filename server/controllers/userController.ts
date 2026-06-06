import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { signAccessJWT } from "../utils/jwt";

export class UserController {
  public static getAll(req: Request, res: Response): void {
    try {
      const usersList = UserService.getAllUsers();
      res.json({ users: usersList });
    } catch (e: any) {
      res.status(500).json({ error: "INTERNAL_FAULT", message: "Failed to read operator registry index." });
    }
  }

  public static updateRole(req: Request, res: Response): void {
    try {
      const execUser = (req as any).sessionUser;
      const { email } = req.params;
      const { role } = req.body;

      if (typeof email !== "string" || typeof role !== "string") {
        res.status(400).json({ error: "PARAMS_INVALID", message: "Operator email or target clearance level malformed." });
        return;
      }

      if (role !== "admin" && role !== "analyst" && role !== "readonly") {
        res.status(400).json({ error: "INVALID_ROLE", message: "Supplied operational security role contains an illegal identifier." });
        return;
      }

      const cleanEmail = email.toLowerCase().trim();
      const result = UserService.updateOperatorRole(execUser.email, cleanEmail, role);

      if ("error" in result) {
        res.status(result.status || 400).json({ error: result.error, message: result.error === "SELF_LOCKOUT_PREVENTED" ? "Bypass rule blocked: you can't revoke admin credentials from yourself." : "Role overwrite rejected." });
        return;
      }

      const clientIp = req.header("x-forwarded-for") || req.socket.remoteAddress || "127.0.0.1";
      res.json({ success: true, user: result.user });
    } catch (e: any) {
      res.status(500).json({ error: "INTERNAL_FAULT", message: "Role state compilation error." });
    }
  }

  public static updateProfile(req: Request, res: Response): void {
    try {
      const sessionUser = (req as any).sessionUser;
      const { name } = req.body;

      if (typeof name !== "string" || !name.trim()) {
        res.status(400).json({ error: "PARAMS_INVALID", message: "Operator signature name is required." });
        return;
      }

      const result = UserService.updateProfile(sessionUser.email, name);

      if ("error" in result) {
        res.status(result.status || 400).json({ error: result.error });
        return;
      }

      const tokenExp = Date.now() + 864 * 100000; // 24 hours
      const tokenPayload = {
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        accessLevel: result.user.accessLevel,
        exp: tokenExp,
      };
      const newToken = signAccessJWT(tokenPayload);

      res.json({
        ...result,
        token: newToken
      });
    } catch (e: any) {
      res.status(500).json({ error: "INTERNAL_FAULT", message: "Error mutating profile specifications." });
    }
  }
}
