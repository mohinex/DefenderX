import express from "express";
import { AdminController } from "../controllers/adminController.js";
import { requireAuth, reqRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(requireAuth);

// System security variables (Admins only)
router.get("/settings", reqRole(["admin"]), AdminController.getSettings);
router.post("/settings", reqRole(["admin"]), AdminController.updateSettings);

// Audit ledger trails (Admins and Analysts only)
router.get("/audit-logs", reqRole(["admin", "analyst"]), AdminController.getAuditLogs);

// Single specialist's activity logs
router.get("/activity-logs", AdminController.getActivityLogs);

export default router;
