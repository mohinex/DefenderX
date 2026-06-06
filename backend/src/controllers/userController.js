import prisma from "../config/db.js";

export const UserController = {
  // Get all registered operators
  async getAll(req, res, next) {
    try {
      const users = await prisma.user.findMany({
        include: {
          profile: true,
          userRoles: { include: { role: true } }
        }
      });

      const formatted = users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.profile?.name || "Unassigned Specialist",
        role: u.userRoles[0]?.role?.name || "readonly",
        accessLevel: u.userRoles[0]?.role?.name === "admin" ? "L9 Secure Clear" : u.userRoles[0]?.role?.name === "analyst" ? "L4 Operations" : "L2 Audit Only",
        isVerified: u.isVerified,
        createdAt: u.createdAt
      }));

      return res.json({
        success: true,
        message: "Retrieved operational roster details.",
        data: { users: formatted },
        errors: null
      });
    } catch (err) {
      next(err);
    }
  },

  // Get specific operator profile
  async getOne(req, res, next) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          profile: true,
          userRoles: { include: { role: true } }
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Operator profile node not present.",
          data: null,
          errors: ["SPECIALIST_NOT_FOUND"]
        });
      }

      return res.json({
        success: true,
        message: "Operator node mapped successfully.",
        data: {
          id: user.id,
          email: user.email,
          name: user.profile?.name || "",
          role: user.userRoles[0]?.role?.name || "readonly",
          isVerified: user.isVerified,
          createdAt: user.createdAt
        },
        errors: null
      });
    } catch (err) {
      next(err);
    }
  },

  // Update specific operator parameters
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, isVerified } = req.body;

      const user = await prisma.user.update({
        where: { id },
        data: {
          isVerified,
          profile: {
            update: { name }
          }
        },
        include: { profile: true }
      });

      return res.json({
        success: true,
        message: "Operator data parameters modified.",
        data: {
          id: user.id,
          email: user.email,
          name: user.profile?.name,
          isVerified: user.isVerified
        },
        errors: null
      });
    } catch (err) {
      next(err);
    }
  },

  // Delete/Decomission specific operator profile
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      
      const targetUser = await prisma.user.findUnique({ where: { id } });
      if (!targetUser) {
        return res.status(404).json({
          success: false,
          message: "Target user not found.",
          data: null,
          errors: ["NOT_FOUND"]
        });
      }

      if (id === req.user.id) {
        return res.status(400).json({
          success: false,
          message: "Safety constraint active: Decommissioning your own active terminal session is denied.",
          data: null,
          errors: ["SELF_DELETION_REFUSED"]
        });
      }

      await prisma.user.delete({ where: { id } });

      return res.json({
        success: true,
        message: "Operational specialist profile decommissioned from security register database.",
        data: null,
        errors: null
      });
    } catch (err) {
      next(err);
    }
  },

  // Re-assign role parameters
  async updateRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body; // admin, analyst, readonly

      if (!["admin", "analyst", "readonly"].includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Undefined role class coordinates.",
          data: null,
          errors: ["BAD_REQUEST"]
        });
      }

      const user = await prisma.user.findUnique({
        where: { id },
        include: { userRoles: { include: { role: true } } }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Operator not found.",
          data: null,
          errors: ["NOT_FOUND"]
        });
      }

      // Safe lockout safeguard
      if (user.id === req.user.id && role !== "admin") {
        return res.status(400).json({
          success: false,
          message: "Safety validation triggered: Revoking admin access level privileges on your active profile is forbidden.",
          data: null,
          errors: ["SELF_PRIV_REVOKE_DENIED"]
        });
      }

      const roleRecord = await prisma.role.findUnique({ where: { name: role } });
      if (!roleRecord) {
        return res.status(400).json({
          success: false,
          message: "Required role identity class not initialized.",
          data: null,
          errors: ["SYS_SETUP_ERR"]
        });
      }

      await prisma.userRole.updateMany({
        where: { userId: user.id },
        data: { roleId: roleRecord.id }
      });

      await prisma.auditLog.create({
        data: {
          operator: req.user.email,
          action: `Role level altered for specialist ${user.email} from ${user.userRoles[0]?.role?.name} to ${role.toUpperCase()}`,
          ip: req.ip
        }
      });

      return res.json({
        success: true,
        message: `Clearance role identity successfully updated to [${role.toUpperCase()}].`,
        data: {
          id: user.id,
          email: user.email,
          role
        },
        errors: null
      });

    } catch (err) {
      next(err);
    }
  }
};
