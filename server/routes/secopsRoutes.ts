import { Router } from "express";
import { SecOpsController } from "../controllers/secopsController";
import { authenticateSession, requireRole } from "../middlewares/authMiddleware";
import { sanitizePayloadInput } from "../middlewares/securityMiddleware";

const router = Router();

router.use(authenticateSession);

// Common console endpoints
router.get("/alerts", SecOpsController.getAlerts);
router.get("/logs", SecOpsController.getLogs);
router.get("/firewall", SecOpsController.getFirewall);
router.get("/audit-logs", SecOpsController.getAuditLogs);

// Analyst tracking & mutation endpoints (Readonly operators blocked!)
router.patch("/alerts/:id", requireRole(["admin", "analyst"]), SecOpsController.updateAlert);
router.post("/logs", requireRole(["admin", "analyst"]), sanitizePayloadInput, SecOpsController.addLog);

// Administrative controller actions (Only L9 admin allowed!)
router.patch("/firewall/:id", requireRole(["admin"]), SecOpsController.toggleFirewall);
router.post("/posture", requireRole(["admin"]), sanitizePayloadInput, SecOpsController.setPosture);

export default router;
