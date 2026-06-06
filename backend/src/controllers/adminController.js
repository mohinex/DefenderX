import prisma from "../config/db.js";

export const AdminController = {
  // Get administrative security config
  async getSettings(req, res, next) {
    try {
      const records = await prisma.adminSetting.findMany();
      // Set defaults if empty
      if (records.length === 0) {
        await prisma.adminSetting.createMany({
          data: [
            { key: "threat_guard", value: "enabled", description: "Perimeter volumetric threat monitor state" },
            { key: "automatic_posture_lock", value: "disabled", description: "Shifts network mode to SHIELDED on intrusion thresholds" },
            { key: "session_timeout_minutes", value: "30", description: "De-authenticate operator sessions after inactivity thresholds" }
          ]
        });
      }

      const freshList = await prisma.adminSetting.findMany();
      return res.json({
        success: true,
        message: "Parsed administrative console variables.",
        data: { settings: freshList },
        errors: null
      });
    } catch (err) {
      next(err);
    }
  },

  // Modify administrative settings
  async updateSettings(req, res, next) {
    try {
      const { settings } = req.body; // Array of { key, value }
      if (!settings || !Array.isArray(settings)) {
        return res.status(400).json({
          success: false,
          message: "Define correct settings schema dataset.",
          data: null,
          errors: ["INVALID_PARAMS"]
        });
      }

      const updates = settings.map(item => {
        return prisma.adminSetting.upsert({
          where: { key: item.key },
          update: { value: item.value },
          create: { key: item.key, value: item.value }
        });
      });

      await prisma.$transaction(updates);

      // Audit console adjustments
      await prisma.auditLog.create({
        data: {
          operator: req.user.email,
          action: "Modified global console administrative settings.",
          ip: req.ip
        }
      });

      return res.json({
        success: true,
        message: "Settings committed to system controller state.",
        data: null,
        errors: null
      });
    } catch (err) {
      next(err);
    }
  },

  // Read centralized transaction changes
  async getAuditLogs(req, res, next) {
    try {
      const logs = await prisma.auditLog.findMany({
        orderBy: { timestamp: "desc" },
        take: 50
      });

      return res.json({
        success: true,
        message: "Audit trail log records parsed.",
        data: { auditLogs: logs },
        errors: null
      });
    } catch (err) {
      next(err);
    }
  },

  // Read specific operator sessions
  async getActivityLogs(req, res, next) {
    try {
      const logs = await prisma.activityLog.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" },
        take: 100
      });

      return res.json({
        success: true,
        message: "Activity log parsed.",
        data: { activityLogs: logs },
        errors: null
      });
    } catch (err) {
      next(err);
    }
  }
};
