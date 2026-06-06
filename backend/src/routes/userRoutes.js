import express from "express";
import { UserController } from "../controllers/userController.js";
import { requireAuth, reqRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(requireAuth);

// Analysts and Admins can view other specialists
router.get("/", reqRole(["admin", "analyst"]), UserController.getAll);
router.get("/:id", reqRole(["admin", "analyst"]), UserController.getOne);

// Only structural Admins can update demographics or decomission profiles
router.put("/:id", reqRole(["admin"]), UserController.update);
router.delete("/:id", reqRole(["admin"]), UserController.delete);
router.patch("/:id/role", reqRole(["admin"]), UserController.updateRole);

export default router;
