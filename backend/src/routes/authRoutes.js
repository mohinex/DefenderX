import express from "express";
import { AuthController } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/refresh", AuthController.refreshToken);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);
router.post("/verify-email", AuthController.verifyEmail);

// User contextual sub-routes (requires dynamic authorization)
router.get("/me", requireAuth, AuthController.me);
router.post("/change-password", requireAuth, AuthController.changePassword);

export default router;
