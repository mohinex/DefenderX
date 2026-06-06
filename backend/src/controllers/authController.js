import bcrypt from "bcrypt";
import prisma from "../config/db.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";

export const AuthController = {
  // Register new Security Operator
  async register(req, res, next) {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: "Define email, password and full name coordinates.",
          data: null,
          errors: ["MISSING_PARAMS"]
        });
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Handshake refused: Operational email already enrolled in registry database.",
          data: null,
          errors: ["DUPLICATE_EMAIL"]
        });
      }

      const hash = await bcrypt.hash(password, 10);
      
      // Seed roles table if empty on registration
      let roleObj = await prisma.role.findUnique({ where: { name: "readonly" } });
      if (!roleObj) {
        roleObj = await prisma.role.create({
          data: { name: "readonly", description: "Default Read-only compliance auditor" }
        });
        await prisma.role.create({
          data: { name: "admin", description: "L9 Root Security Administrator" }
        });
      }

      // Check if this is the first operator registered; automatically default to admin
      const totalUsers = await prisma.user.count();
      const actualRole = totalUsers === 0 ? "admin" : "readonly";
      const assignedRole = await prisma.role.findUnique({ where: { name: actualRole } });

      const createdUser = await prisma.user.create({
        data: {
          email,
          passwordHash: hash,
          isVerified: false,
          profile: {
            create: { name }
          },
          userRoles: {
            create: { roleId: assignedRole.id }
          }
        },
        include: {
          profile: true,
          userRoles: {
            include: { role: true }
          }
        }
      });

      // Issue email verification token
      const verTokenString = Math.random().toString(36).substring(2, 12).toUpperCase();
      await prisma.emailVerificationToken.create({
        data: {
          userId: createdUser.id,
          token: verTokenString,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 Hours
        }
      });

      // Write System configuration Audit Trail
      await prisma.auditLog.create({
        data: {
          operator: createdUser.email,
          action: `Self-registered new operational user node: ${createdUser.email} [ROLE: ${actualRole}]`,
          ip: req.ip
        }
      });

      return res.status(201).json({
        success: true,
        message: "Operator node constructed. Security verification instructions dispatched.",
        data: {
          id: createdUser.id,
          email: createdUser.email,
          name: createdUser.profile.name,
          role: actualRole,
          verificationCode: verTokenString // Display for development convenience
        },
        errors: null
      });

    } catch (err) {
      next(err);
    }
  },

  // Handshake verification (operators login)
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Input login email and passcode identifiers.",
          data: null,
          errors: ["INVALID_INPUT"]
        });
      }

      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          profile: true,
          userRoles: {
            include: { role: true }
          }
        }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Cipher match denied: Incorrect credentials.",
          data: null,
          errors: ["AUTHENTICATION_REFUSED"]
        });
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({
          success: false,
          message: "Cipher match denied: Incorrect credentials.",
          data: null,
          errors: ["AUTHENTICATION_REFUSED"]
        });
      }

      const roleName = user.userRoles[0]?.role?.name || "readonly";
      const accessLevel = roleName === "admin" ? "L9 Secure Clear" : roleName === "analyst" ? "L4 Operations" : "L2 Audit Only";

      const accessToken = generateAccessToken({ id: user.id, email: user.email, roles: [roleName] });
      const refreshToken = generateRefreshToken({ id: user.id });

      // Save Refresh Token back to state
      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      });

      // Write Login transaction audit log
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          operator: user.email,
          action: "Operator initiated secure control deck handshake session.",
          ip: req.ip
        }
      });

      return res.json({
        success: true,
        message: "Perimeter bridge authenticated. Session live.",
        data: {
          token: accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.profile?.name || "Security Specialist",
            role: roleName,
            accessLevel
          }
        },
        errors: null
      });

    } catch (err) {
      next(err);
    }
  },

  // Logout Session
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        await prisma.refreshToken.updateMany({
          where: { token: refreshToken },
          data: { isRevoked: true }
        });
      }
      return res.json({
        success: true,
        message: "Active bridge session decoupled. Logging out operator.",
        data: null,
        errors: null
      });
    } catch (err) {
      next(err);
    }
  },

  // Token longevity recycle (refresh token check)
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: "Session recycle refused: Missing refresh parameters.",
          data: null,
          errors: ["MISSING_TOKEN"]
        });
      }

      const record = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: { include: { userRoles: { include: { role: true } } } } }
      });

      if (!record || record.isRevoked || record.expiresAt < new Date()) {
        return res.status(401).json({
          success: false,
          message: "Decoupled refresh parameters: Register session again.",
          data: null,
          errors: ["EXPIRED_REFRESH_TOKEN"]
        });
      }

      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) {
        return res.status(401).json({
          success: false,
          message: "Faulty refresh session indicators.",
          data: null,
          errors: ["INVALID_REFRESH_SIGNATURE"]
        });
      }

      const roleName = record.user.userRoles[0]?.role?.name || "readonly";
      const nextAccess = generateAccessToken({ id: record.user.id, email: record.user.email, roles: [roleName] });

      return res.json({
        success: true,
        message: "Handshake session recycled recursively.",
        data: {
          token: nextAccess
        },
        errors: null
      });
    } catch (err) {
      next(err);
    }
  },

  // Forgot password
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.json({
          success: true,
          message: "Dispatched recovery instructions if the node matches active database entries.",
          data: null,
          errors: null
        });
      }

      const resetToken = Math.random().toString(36).substring(2, 18).toUpperCase();
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token: resetToken,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 Hour lifespan
        }
      });

      return res.json({
        success: true,
        message: "Passcode verification override tokens issued.",
        data: {
          token: resetToken
        },
        errors: null
      });
    } catch (err) {
      next(err);
    }
  },

  // Reset password
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Supply active token overrides and revised passwords.",
          data: null,
          errors: ["MISSING_PARAMS"]
        });
      }

      const activeRecord = await prisma.passwordResetToken.findUnique({
        where: { token },
        include: { user: true }
      });

      if (!activeRecord || activeRecord.expiresAt < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Expired recovery override token. Resubmit forgot passcode protocol.",
          data: null,
          errors: ["INVALID_TOKEN"]
        });
      }

      const nextHash = await bcrypt.hash(newPassword, 10);
      await prisma.$transaction([
        prisma.user.update({
          where: { id: activeRecord.userId },
          data: { passwordHash: nextHash }
        }),
        prisma.passwordResetToken.delete({
          where: { id: activeRecord.id }
        })
      ]);

      return res.json({
        success: true,
        message: "Operator profile passwords safely updated. Authenticate with revised creds.",
        data: null,
        errors: null
      });
    } catch (err) {
      next(err);
    }
  },

  // Verification
  async verifyEmail(req, res, next) {
    try {
      const { token } = req.body;
      const verifiedRecord = await prisma.emailVerificationToken.findUnique({
        where: { token },
        include: { user: true }
      });

      if (!verifiedRecord || verifiedRecord.expiresAt < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired cryptographic confirmation token code.",
          data: null,
          errors: ["VERIFY_FAILED"]
        });
      }

      await prisma.$transaction([
        prisma.user.update({
          where: { id: verifiedRecord.userId },
          data: { isVerified: true }
        }),
        prisma.emailVerificationToken.delete({
          where: { id: verifiedRecord.id }
        })
      ]);

      return res.json({
        success: true,
        message: "Operator profile verification index marked compliant.",
        data: null,
        errors: null
      });
    } catch (err) {
      next(err);
    }
  },

  // Current session parameters
  async me(req, res, next) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        include: {
          profile: true,
          userRoles: { include: { role: true } }
        }
      });
      const roleName = user.userRoles[0]?.role?.name || "readonly";
      const accessLevel = roleName === "admin" ? "L9 Secure Clear" : roleName === "analyst" ? "L4 Operations" : "L2 Audit Only";

      return res.json({
        success: true,
        message: "Current operator context verified.",
        data: {
          id: user.id,
          email: user.email,
          name: user.profile?.name || "Security Specialist",
          role: roleName,
          accessLevel
        },
        errors: null
      });
    } catch (err) {
      next(err);
    }
  },

  // User revised password
  async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      const valid = await bcrypt.compare(oldPassword, user.passwordHash);
      if (!valid) {
        return res.status(400).json({
          success: false,
          message: "Active identifier validation failed: incorrect old passcode.",
          data: null,
          errors: ["PASSWORD_COLLISION"]
        });
      }

      const nextHash = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: req.user.id },
        data: { passwordHash: nextHash }
      });

      return res.json({
        success: true,
        message: "Passcode updated securely.",
        data: null,
        errors: null
      });
    } catch (err) {
      next(err);
    }
  }
};
