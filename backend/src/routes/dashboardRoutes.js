import express from "express";
import { DashboardController } from "../controllers/dashboardController.js";
import { requireAuth, reqRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/metrics", DashboardController.getMetrics);
router.get("/alerts", DashboardController.getAlerts);
router.get("/firewall", DashboardController.getFirewall);
router.patch("/firewall/:id", reqRole(["admin"]), DashboardController.alterFirewall);

router.get("/audit-logs", DashboardController.getAuditLogs);
router.get("/logs", DashboardController.getLogs);
router.post("/logs", DashboardController.createLog);
router.post("/posture", DashboardController.updatePosture);

export default router;
