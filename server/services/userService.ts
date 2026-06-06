import { db } from "../repositories/database";
import { User } from "../types";

export class UserService {
  public static getAllUsers() {
    return db.getAllUsers();
  }

  public static updateOperatorRole(executorEmail: string, targetEmail: string, nextRole: "admin" | "analyst" | "readonly") {
    const targetRecord = db.getUserByEmail(targetEmail);
    if (!targetRecord) {
      return { error: "USER_NOT_FOUND", status: 404 };
    }

    // Safety override lockout block
    if (targetEmail.toLowerCase().trim() === executorEmail.toLowerCase().trim() && nextRole !== "admin") {
      return { error: "SELF_LOCKOUT_PREVENTED", status: 400 };
    }

    const oldRole = targetRecord.user.role;
    targetRecord.user.role = nextRole;

    if (nextRole === "admin") {
      targetRecord.user.accessLevel = "L9 Secure Clear";
    } else if (nextRole === "analyst") {
      targetRecord.user.accessLevel = "L4 Operations";
    } else {
      targetRecord.user.accessLevel = "L2 Audit Only";
    }

    targetRecord.user.updatedAt = new Date().toISOString();
    
    // Save state
    db.updateUser(targetEmail, targetRecord.user);

    return {
      success: true,
      oldRole,
      newRole: nextRole,
      user: targetRecord.user
    };
  }

  public static updateProfile(email: string, name: string) {
    const record = db.getUserByEmail(email);
    if (!record) return { error: "USER_NOT_FOUND", status: 404 };

    record.user.name = name.trim();
    record.user.updatedAt = new Date().toISOString();
    
    db.updateUser(email, record.user);

    return {
      success: true,
      user: record.user
    };
  }
}
