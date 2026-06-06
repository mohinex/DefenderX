import express from "express";
import { ContactController } from "../controllers/contactController.js";
import { requireAuth, reqRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public feedback submission is unlocked
router.post("/submit", ContactController.handleSubmit);

// Inquiries review requires Admin/Analyst credentials
router.get("/all", requireAuth, reqRole(["admin", "analyst"]), ContactController.listAll);
router.patch("/:id/status", requireAuth, reqRole(["admin", "analyst"]), ContactController.updateStatus);

export default router;
