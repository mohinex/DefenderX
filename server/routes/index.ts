import { Router } from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import secopsRoutes from "./secopsRoutes";
import copilotRoutes from "./copilotRoutes";
import contactRoutes from "./contactRoutes";
import seoRoutes from "./seoRoutes";

const router = Router();

// Endpoint grouping layout
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/users", userRoutes);
router.use("/api/v1/secops", secopsRoutes);
router.use("/api/v1/copilot", copilotRoutes);
router.use("/api/v1/contact", contactRoutes);
router.use("/api/v1/seo", seoRoutes);

export default router;
