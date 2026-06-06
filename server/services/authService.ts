import { db } from "../repositories/database";
import { signAccessJWT } from "../utils/jwt";
import { User } from "../types";

export class AuthService {
  public static login(email: string, pass: string) {
    const record = db.getUserByEmail(email);
    if (!record) return { error: "NODE_NOT_FOUND", status: 404 };

    if (pass !== record.pass) {
      return { error: "CREDENTIALS_MISMATCH", status: 401 };
    }

    const { user } = record;
    const tokenExp = Date.now() + 864 * 100000; // 24 hours
    const tokenPayload = {
      email: user.email,
      name: user.name,
      role: user.role,
      accessLevel: user.accessLevel,
      exp: tokenExp,
    };

    const accessToken = signAccessJWT(tokenPayload);
    const refreshToken = "rf-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Persist refresh token to store
    db.updateUserSecCredentials(user.email, { refreshToken });

    return {
      success: true,
      token: accessToken,
      refreshToken,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
        accessLevel: user.accessLevel,
      }
    };
  }

  public static register(email: string, name: string, pass: string) {
    const existing = db.getUserByEmail(email);
    if (existing) {
      return { error: "USER_ALREADY_EXISTS", status: 400 };
    }

    const id = "u-" + Math.random().toString(36).substring(2, 9);
    const verificationToken = "ver-" + Math.random().toString(36).substring(2, 15);

    const newUser: User = {
      id,
      email: email.trim().toLowerCase(),
      name: name.trim(),
      role: "readonly", // Default safe role
      accessLevel: "L2 Audit Only",
      isVerified: false,
      verificationToken,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.createUser(email, newUser, pass);

    return {
      success: true,
      message: "Security node registered. Please request verify parameters.",
      user: newUser
    };
  }

  public static verifyEmail(email: string, token: string) {
    const record = db.getUserByEmail(email);
    if (!record) return { error: "NODE_NOT_FOUND", status: 404 };

    if (record.user.isVerified) {
      return { success: true, message: "Security operator already verified." };
    }

    if (record.user.verificationToken !== token) {
      return { error: "INVALID_VERIFICATION_TOKEN", status: 400 };
    }

    record.user.isVerified = true;
    record.user.verificationToken = undefined;
    db.updateUser(email, record.user);

    return { success: true, message: "Operator email successfully verified." };
  }

  public static requestPasswordReset(email: string) {
    const record = db.getUserByEmail(email);
    if (!record) return { error: "NODE_NOT_FOUND", status: 404 };

    const resetToken = "rst-" + Math.random().toString(36).substring(2, 11);
    const resetTokenExp = Date.now() + 3600000; // 1 hour

    const updatedUser = {
      ...record.user,
      resetToken,
      resetTokenExp
    };

    db.updateUser(email, updatedUser);

    return {
      success: true,
      message: "Reset pass-token generated and queued successfully.",
      resetToken // In a production application, sent via SMTP
    };
  }

  public static resetPassword(email: string, token: string, newPass: string) {
    const record = db.getUserByEmail(email);
    if (!record) return { error: "NODE_NOT_FOUND", status: 404 };

    const { resetToken, resetTokenExp } = record.user;
    if (!resetToken || resetToken !== token || !resetTokenExp || resetTokenExp < Date.now()) {
      return { error: "INVALID_OR_EXPIRED_RESET_TOKEN", status: 400 };
    }

    // Update user passphrase
    db.updateUserSecCredentials(email, { pass: newPass });

    // Clean tokens
    const restoredUser = {
      ...record.user,
      resetToken: undefined,
      resetTokenExp: undefined
    };

    db.updateUser(email, restoredUser);

    return { success: true, message: "Security parameters updated. Force logout clean state triggered." };
  }

  public static refreshAccessToken(email: string, rToken: string) {
    const record = db.getUserByEmail(email);
    if (!record) return { error: "NODE_NOT_FOUND", status: 404 };

    if (!record.refreshToken || record.refreshToken !== rToken) {
      return { error: "REFRESH_SIGNATURE_MISMATCH", status: 401 };
    }

    const { user } = record;
    const tokenExp = Date.now() + 864 * 100000; // 24 hours
    const tokenPayload = {
      email: user.email,
      name: user.name,
      role: user.role,
      accessLevel: user.accessLevel,
      exp: tokenExp,
    };

    const accessToken = signAccessJWT(tokenPayload);

    return {
      success: true,
      token: accessToken
    };
  }
}
