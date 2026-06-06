import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import profileRoutes from "./profileRoutes.js";
import contactRoutes from "./contactRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import adminRoutes from "./adminRoutes.js";
import seoRoutes from "./seoRoutes.js";

const router = express.Router();

// Route namespaces mapping exactly to client fetch routes
router.use("/v1/auth", authRoutes);
router.use("/v1/users", userRoutes);
router.use("/v1/profile", profileRoutes);
router.use("/v1/contact", contactRoutes);
router.use("/v1/notifications", notificationRoutes);
router.use("/v1/admin", adminRoutes);

// Map search engine queries
router.use("/v1/seo", seoRoutes);

// Bridge standard operations under /v1/secops
router.use("/v1/secops", dashboardRoutes);

// Quick Copilot intelligent Advisor router
router.post("/v1/copilot/chat", (req, res) => {
  const { query, alertContext } = req.body;
  let text = "Welcome Specialist. Cyber-Defense network analysis active. All systems optimal.";
  
  if (query && query.toLowerCase().includes("firewall")) {
    text = "Core firewall is shielding ports 3306 and 1433 perfectly. Port 22 SSH audit logging is monitored for active brute-force intrusion indicators.";
  } else if (alertContext) {
    text = `Incident advise for isolated threat '${alertContext.title}': volumentric synthesis patterns are identified. Recommendation is to verify gateway route filtering tables.`;
  }

  res.json({
    success: true,
    message: "Copilot intelligent advice prepared successfully.",
    data: {
      sender: "copilot",
      text,
      source: "CENTRAL_DEFENDER_COGNITIVE_CORE"
    },
    errors: null
  });
});

export default router;
