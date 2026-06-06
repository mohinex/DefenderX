import express from "express";
import { SeoController } from "../controllers/seoController.js";
import { requireAuth, reqRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(requireAuth);

router.get("/global", SeoController.getGlobal);
router.post("/global", reqRole(["admin"]), SeoController.updateGlobal);

router.get("/pages", SeoController.getPages);
router.post("/pages/:path(*)", reqRole(["admin"]), SeoController.updatePage);

router.get("/redirects", SeoController.getRedirects);
router.post("/redirects", reqRole(["admin"]), SeoController.createRedirect);
router.delete("/redirects/:id", reqRole(["admin"]), SeoController.deleteRedirect);

router.get("/broken-links", SeoController.getBrokenLinks);
router.delete("/broken-links", reqRole(["admin"]), SeoController.clearBrokenLinks);

router.get("/sitemap-health", SeoController.getSitemapHealth);

export default router;
