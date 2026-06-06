import prisma from "../config/db.js";

export const NotificationController = {
  // Pull notifications mapped to operator ID
  async fetchAll(req, res, next) {
    try {
      const messages = await prisma.notification.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" }
      });

      return res.json({
        success: true,
        message: "Notifications inbox synchronized.",
        data: { notifications: messages },
        errors: null
      });
    } catch (err) {
      next(err);
    }
  },

  // Mark specific notification node as read
  async markRead(req, res, next) {
    try {
      const { id } = req.params;

      const message = await prisma.notification.update({
        where: { id },
        data: { isRead: true }
      });

      return res.json({
        success: true,
        message: "Notification status indexed as read.",
        data: message,
        errors: null
      });
    } catch (err) {
      next(err);
    }
  },

  // Prune specific notification from inbox
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      await prisma.notification.delete({
        where: { id }
      });

      return res.json({
        success: true,
        message: "Notification node pruned from security alerts buffer.",
        data: null,
        errors: null
      });
    } catch (err) {
      next(err);
    }
  }
};
