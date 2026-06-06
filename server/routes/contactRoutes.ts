import { Router } from "express";
import { ContactController } from "../controllers/contactController";
import { authenticateSession, requireRole } from "../middlewares/authMiddleware";
import { securityLimiter, sanitizePayloadInput } from "../middlewares/securityMiddleware";

const router = Router();

// Publicly exposable connection forms (rate-limited and sanitized)
router.post("/", securityLimiter, sanitizePayloadInput, ContactController.submitInquiry);

// Administrative audit stream of consulting submissions
router.get("/", authenticateSession, requireRole(["admin", "analyst"]), ContactController.getInquiries);

export default router;
