import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { authenticateSession } from "../middlewares/authMiddleware";
import { securityLimiter, sanitizePayloadInput } from "../middlewares/securityMiddleware";

const router = Router();

// Rate limited & validated endpoints
router.post("/login", securityLimiter, sanitizePayloadInput, AuthController.login);
router.post("/register", securityLimiter, sanitizePayloadInput, AuthController.register);
router.post("/forgot-password", securityLimiter, sanitizePayloadInput, AuthController.forgotPassword);
router.post("/reset-password", securityLimiter, sanitizePayloadInput, AuthController.resetPassword);

// Verification and helper endpoints
router.get("/verify-email", AuthController.verifyEmail);
router.post("/refresh", AuthController.refresh);

// Authenticated session states
router.post("/logout", authenticateSession, AuthController.logout);
router.get("/profile", authenticateSession, AuthController.getProfile);

export default router;
