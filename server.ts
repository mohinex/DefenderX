import express, { Request, Response, NextFunction } from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import mainRouter from "./server/routes/index";
import { injectSecurityHeaders } from "./server/middlewares/securityMiddleware";
import { SeoController } from "./server/controllers/seoController";

// Load Environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Mount secure parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inject HTTP header protection (Anti-Clickjacking, CSP, Frame defense)
app.use(injectSecurityHeaders);

// Root level crawler endpoints
app.get("/sitemap.xml", SeoController.getSitemapXml);
app.get("/robots.txt", SeoController.getRobotsTxt);

// Inject Logger for incoming SecOps control requests
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const elapsed = Date.now() - start;
    const clientIp = req.header("x-forwarded-for") || req.socket.remoteAddress || "127.0.0.1";
    console.log(`[SECOPS-EXEC] ${new Date().toISOString()} | ${req.method} ${req.originalUrl} | STATUS ${res.statusCode} | IP ${clientIp} | ${elapsed}ms`);
  });
  next();
});

// Mount modular routing architectures
app.use("/", mainRouter);

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode: Hook up direct Vite server HMR middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("[INIT] Development Vite Dev Server mounted successfully.");
  } else {
    // Production Assets Pipeline configuration
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    console.log(`[INIT] Production assets compiler mounted at: ${distPath}`);
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Core Exception Handler (Uncaught fallback)
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("[CRITICAL SYSTEM FAULT]", err);
    res.status(500).json({
      error: "FATAL_PERIMETER_FAIL",
      message: "An internal security perimeter error has occurred. Standby while system reboots.",
    });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER_LIVE] Eurosia Defender X online. Transceiver bridged at: http://localhost:${PORT}`);
  });
}

startServer();
export default app;
