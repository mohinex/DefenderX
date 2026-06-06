import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { db } from "../repositories/database";

export class AuthController {
  public static login(req: Request, res: Response): void {
    try {
      const { email, password } = req.body;

      if (typeof email !== "string" || typeof password !== "string") {
        res.status(400).json({ error: "PARAMS_INVALID", message: "Handshake parameters must be text string models." });
        return;
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = password.trim();

      if (!cleanEmail || !cleanPass) {
        res.status(400).json({ error: "PARAMS_MISSING", message: "Operator signature or key-phrase missing." });
        return;
      }

      if (cleanEmail.length > 200 || cleanPass.length > 200) {
        res.status(400).json({ error: "OVERFLOW_ATTEMPT", message: "Perimeter warning: input lengths exceed bounds." });
        return;
      }

      const result = AuthService.login(cleanEmail, cleanPass);

      const clientIp = req.header("x-forwarded-for") || req.socket.remoteAddress || "127.0.0.1";

      if ("error" in result) {
        // Authenticate failure auditing match
        db.addLog(cleanEmail, "AUTHENTICATION FAILURE: Malformed pass phrase rejected.", "blocked");
        db.addAuditLog(cleanEmail, "FAILED LOGIN ATTEMPT", clientIp);
        res.status(result.status || 401).json({ error: result.error, message: "Incorrect security token or clearance hash." });
        return;
      }

      db.addLog(cleanEmail, "Transceiver handshake verified. Secure connection tunnel bridged.", "system");
      db.addAuditLog(result.user.name, "SECURE LOGIN", clientIp);

      res.json({
        status: "BRIDGED_LOCK_ACTIVE",
        token: result.token,
        refreshToken: result.refreshToken,
        user: result.user
      });
    } catch (e: any) {
      console.error("[CRITICAL AUTH CONTROLLER ERROR]", e);
      res.status(500).json({ error: "INTERNAL_FAULT", message: "Core login system transient fault." });
    }
  }

  public static register(req: Request, res: Response): void {
    try {
      const { email, name, password } = req.body;

      if (typeof email !== "string" || typeof name !== "string" || typeof password !== "string") {
        res.status(400).json({ error: "PARAMS_INVALID", message: "Registration parameters must be standard strings." });
        return;
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name.trim();
      const cleanPass = password.trim();

      if (!cleanEmail || !cleanName || !cleanPass) {
        res.status(400).json({ error: "PARAMS_MISSING", message: "All parameters are strictly required to index profile." });
        return;
      }

      if (cleanEmail.length > 200 || cleanName.length > 100 || cleanPass.length > 200) {
        res.status(400).json({ error: "OVERFLOW_ATTEMPT", message: "Secure parameters buffer limit matched." });
        return;
      }

      const result = AuthService.register(cleanEmail, cleanName, cleanPass);

      if ("error" in result) {
        res.status(result.status || 400).json({ error: result.error, message: "Operator registration failed." });
        return;
      }

      const clientIp = req.header("x-forwarded-for") || req.socket.remoteAddress || "127.0.0.1";
      db.addLog(cleanEmail, "New security profile provisioned in offline pending mode.", "system");
      db.addAuditLog(cleanName, `SECURE PROFILE CREATED (UNVERIFIED)`, clientIp);

      res.status(201).json(result);
    } catch (e: any) {
      res.status(500).json({ error: "INTERNAL_FAULT", message: "Core registration system fault." });
    }
  }

  public static verifyEmail(req: Request, res: Response): void {
    try {
      const { email, token } = req.query;

      if (typeof email !== "string" || typeof token !== "string") {
        res.status(400).json({ error: "PARAMS_INVALID", message: "Query verifiers must be strings." });
        return;
      }

      const result = AuthService.verifyEmail(email, token);

      if ("error" in result) {
        res.status(result.status || 400).json({ error: result.error, message: "Email verification failed." });
        return;
      }

      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: "INTERNAL_FAULT", message: "Core verification step error." });
    }
  }

  public static forgotPassword(req: Request, res: Response): void {
    try {
      const { email } = req.body;

      if (typeof email !== "string" || !email.trim()) {
        res.status(400).json({ error: "PARAMS_MISSING", message: "Valid email address string required." });
        return;
      }

      const result = AuthService.requestPasswordReset(email);

      if ("error" in result) {
        res.status(result.status || 404).json({ error: result.error, message: "No active operator found with specified address." });
        return;
      }

      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: "INTERNAL_FAULT", message: "Core recovery pipeline error." });
    }
  }

  public static resetPassword(req: Request, res: Response): void {
    try {
      const { email, token, newPassword } = req.body;

      if (typeof email !== "string" || typeof token !== "string" || typeof newPassword !== "string") {
        res.status(400).json({ error: "PARAMS_INVALID", message: "Parameters must be well-formed text sequences." });
        return;
      }

      const result = AuthService.resetPassword(email, token, newPassword);

      if ("error" in result) {
        res.status(result.status || 400).json({ error: result.error, message: "Fail to overwrite security pass phrase." });
        return;
      }

      const clientIp = req.header("x-forwarded-for") || req.socket.remoteAddress || "127.0.0.1";
      db.addLog(email, "Security passphrase updated. Active token instances dropped.", "system");
      db.addAuditLog(email, "FORCE PASSWORD RESET EXECUTED", clientIp);

      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: "INTERNAL_FAULT", message: "Core overwrite failure." });
    }
  }

  public static refresh(req: Request, res: Response): void {
    try {
      const { email, refreshToken } = req.body;

      if (typeof email !== "string" || typeof refreshToken !== "string") {
        res.status(400).json({ error: "PARAMS_INVALID", message: "Handshake session credentials must be primitive strings." });
        return;
      }

      const result = AuthService.refreshAccessToken(email, refreshToken);

      if ("error" in result) {
        res.status(result.status || 401).json({ error: result.error, message: "Handshake sync timeout or bad key payload." });
        return;
      }

      res.json(result);
    } catch (e: any) {
      res.status(500).json({ error: "INTERNAL_FAULT", message: "Core session refresher fault." });
    }
  }

  public static logout(req: Request, res: Response): void {
    try {
      const user = (req as any).sessionUser;
      if (user) {
        const clientIp = req.header("x-forwarded-for") || req.socket.remoteAddress || "127.0.0.1";
        db.addLog(user.email, "Operator profile safe closed. Secure tunnel offline.", "system");
        db.addAuditLog(user.name, "SECURE LOGOUT", clientIp);
        db.updateUserSecCredentials(user.email, { refreshToken: "" });
      }
      res.json({ success: true, message: "Transceiver connection closed cleanly." });
    } catch (e: any) {
      res.status(500).json({ error: "INTERNAL_FAULT", message: "Security console teardown fault." });
    }
  }

  public static getProfile(req: Request, res: Response): void {
    try {
      const user = (req as any).sessionUser;
      res.json({ success: true, user });
    } catch (e: any) {
      res.status(500).json({ error: "INTERNAL_FAULT", message: "Profile query fault." });
    }
  }
}
