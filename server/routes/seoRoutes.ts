import { Router } from "express";
import { SeoController } from "../controllers/seoController";
import { authenticateSession, requireRole } from "../middlewares/authMiddleware";

const router = Router();

// Publicly reachable endpoints
router.get("/public/config", SeoController.getPublicConfig);
router.post("/public/broken-link", SeoController.reportBrokenLink);

// Authenticated operators only
router.use(authenticateSession);

router.get("/pages", SeoController.getPages);
router.put("/pages/:path", requireRole(["admin", "analyst"]), SeoController.updatePage);

router.get("/global", SeoController.getGlobal);
router.put("/global", requireRole(["admin"]), SeoController.updateGlobal);

router.get("/redirects", SeoController.getRedirects);
router.post("/redirects", requireRole(["admin"]), SeoController.addRedirect);
router.delete("/redirects/:id", requireRole(["admin"]), SeoController.removeRedirect);

router.get("/broken-links", SeoController.getBrokenLinks);
router.delete("/broken-links", requireRole(["admin", "analyst"]), SeoController.clearBrokenLinks);

router.get("/sitemap-health", SeoController.getSitemapHealth);

export default router;
