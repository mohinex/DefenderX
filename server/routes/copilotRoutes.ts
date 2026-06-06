import { Router } from "express";
import { CopilotController } from "../controllers/copilotController";
import { authenticateSession } from "../middlewares/authMiddleware";
import { securityLimiter, sanitizePayloadInput } from "../middlewares/securityMiddleware";

const router = Router();

router.post("/chat", authenticateSession, securityLimiter, sanitizePayloadInput, CopilotController.chat);

export default router;
