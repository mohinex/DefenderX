import { Request, Response, NextFunction } from "express";
import { verifyAccessJWT } from "../utils/jwt";
import { db } from "../repositories/database";

export const authenticateSession = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(412).json({ error: "SESSION_EXPIRED", message: "Operator signature token required." });
    return;
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyAccessJWT(token);

  if (!decoded) {
    res.status(403).json({ error: "SIGNATURE_MALFORMED", message: "Secure authentication handshake failed." });
    return;
  }

  // Cross-reference user state in database
  const targetUser = db.getUserByEmail(decoded.email);
  if (!targetUser) {
    res.status(401).json({ error: "NODE_NOT_FOUND", message: "Operator profile is deactivated or not found." });
    return;
  }

  // Inject session credentials
  (req as any).sessionUser = targetUser.user;
  next();
};

export const requireRole = (allowedRoles: ("admin" | "analyst" | "readonly")[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).sessionUser;
    if (!user) {
      res.status(412).json({ error: "SESSION_EXPIRED", message: "Operator signature missing during operational security call." });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        error: "INSUFFICIENT_ACCESS",
        message: `Clearance L9 / operational checks failed. Your role (${user.role.toUpperCase()}) cannot execute this operation.`,
      });
      return;
    }

    next();
  };
};
