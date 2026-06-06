import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mainRouter from "./routes/index.js";

const app = express();

// Secure parameters and standard protection rules
app.use(helmet());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Request parameters parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dynamic HTTP transceivers logging
app.use(morgan("dev"));

// Automated Live Health Check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Eurosia Cyber-Shield Platform backend transceivers active.",
    data: {
      status: "healthy",
      timestamp: new Date().toISOString()
    },
    errors: null
  });
});

// Primary index routing hookup
app.use("/api", mainRouter);

// Fallback 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Requested transceiver node not found.",
    data: null,
    errors: ["ROUTE_NOT_FOUND"]
  });
});

// Centralized Security & Exception Fallback Error Handler
app.use((err, req, res, next) => {
  console.error("[CRITICAL BACKEND EXCEPTION]", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "An unexpected security incident occurred at the perimeter core.",
    data: null,
    errors: [err.code || "INTERNAL_CORE_DISRUPT"]
  });
});

export default app;
