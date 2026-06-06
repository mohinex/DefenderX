import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authenticateSession, requireRole } from "../middlewares/authMiddleware";
import { sanitizePayloadInput } from "../middlewares/securityMiddleware";

const router = Router();

router.use(authenticateSession);

// General operator endpoints
router.get("/", UserController.getAll);
router.patch("/profile", sanitizePayloadInput, UserController.updateProfile);

// Administrative role escalation (L9 authorization required!)
router.patch("/:email/role", requireRole(["admin"]), UserController.updateRole);

export default router;
