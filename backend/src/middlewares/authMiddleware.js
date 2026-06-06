import { verifyAccessToken } from "../utils/jwt.js";
import prisma from "../config/db.js";

export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access verification bypassed: Missing authorization header handshake.",
      data: null,
      errors: ["UNAUTHORIZED"]
    });
  }

  const token = authHeader.split("Bearer ")[1];
  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "Access code invalid or expired session lifespan.",
      data: null,
      errors: ["TOKEN_EXPIRED_OR_INVALID"]
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        userRoles: {
          include: { role: true }
        }
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Operator profile decommissioned.",
        data: null,
        errors: ["USER_NOT_FOUND"]
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      isVerified: user.isVerified,
      roles: user.userRoles.map(ur => ur.role.name)
    };

    next();
  } catch (error) {
    return next(error);
  }
}

export function reqRole(rolesAllowed) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Handsake missing. Authenticate first.",
        data: null,
        errors: ["UNAUTHENTICATED"]
      });
    }

    const hasAllowedRole = req.user.roles.some(r => rolesAllowed.includes(r));
    if (!hasAllowedRole) {
      return res.status(403).json({
        success: false,
        message: "Permission denied. High-level clearance level required.",
        data: null,
        errors: ["FORBIDDEN_LEVEL"]
      });
    }

    next();
  };
}
