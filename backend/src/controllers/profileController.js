import prisma from "../config/db.js";

export const ProfileController = {
  // Get active user profile particulars
  async get(req, res, next) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId: req.user.id }
      });

      if (!profile) {
        // Safe lazy instantiate profile if not created during signup
        const lazyProfile = await prisma.profile.create({
          data: {
            userId: req.user.id,
            name: req.user.email.split("@")[0]
          }
        });
        return res.json({
          success: true,
          message: "Profile instantiated lazy.",
          data: lazyProfile,
          errors: null
        });
      }

      return res.json({
        success: true,
        message: "Profile particulars parsed.",
        data: profile,
        errors: null
      });
    } catch (err) {
      next(err);
    }
  },

  // Update profile details
  async update(req, res, next) {
    try {
      const { name, phone, company, bio, avatarUrl } = req.body;

      const profile = await prisma.profile.upsert({
        where: { userId: req.user.id },
        update: { name, phone, company, bio, avatarUrl },
        create: { userId: req.user.id, name, phone, company, bio, avatarUrl }
      });

      return res.json({
        success: true,
        message: "Demographics profile parameters verified.",
        data: profile,
        errors: null
      });
    } catch (err) {
      next(err);
    }
  }
};
