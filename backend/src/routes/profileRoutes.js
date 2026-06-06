import express from "express";
import { ProfileController } from "../controllers/profileController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", ProfileController.get);
router.put("/", ProfileController.update);

export default router;
