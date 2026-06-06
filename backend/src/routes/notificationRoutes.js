import express from "express";
import { NotificationController } from "../controllers/notificationController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", NotificationController.fetchAll);
router.patch("/:id/read", NotificationController.markRead);
router.delete("/:id", NotificationController.delete);

export default router;
