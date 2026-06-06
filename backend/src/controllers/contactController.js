import prisma from "../config/db.js";

export const ContactController = {
  // Store support inquiries
  async handleSubmit(req, res, next) {
    try {
      const { name, email, company, subject, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          message: "Input name, email address context, and message content.",
          data: null,
          errors: ["INVALID_INQUIRY"]
        });
      }

      const inquiry = await prisma.contactMessage.create({
        data: { name, email, company, subject, message }
      });

      return res.status(212).json({
        success: true,
        message: "Support coordinates captured securely. Specialist review scheduled.",
        data: inquiry,
        errors: null
      });
    } catch (err) {
      next(err);
    }
  },

  // Audit list support inquiries (admins / analysts only)
  async listAll(req, res, next) {
    try {
      const inquiries = await prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" }
      });

      return res.json({
        success: true,
        message: "Parsed contact messages dossier log.",
        data: { messages: inquiries },
        errors: null
      });
    } catch (err) {
      next(err);
    }
  },

  // Update support resolution state
  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body; // reviewed, archived, pending

      const inquiry = await prisma.contactMessage.update({
        where: { id },
        data: { status }
      });

      return res.json({
        success: true,
        message: `Inquiry status categorized to '${status.toUpperCase()}'.`,
        data: inquiry,
        errors: null
      });
    } catch (err) {
      next(err);
    }
  }
};
