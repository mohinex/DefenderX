import { Request, Response, NextFunction } from "express";

// sliding window ip request tracking dictionary
const ipRequestHistory: Record<string, { count: number; expiresAt: number }> = {};
const RATE_WINDOW_MS = 60000; // 1 minute
const MAX_BURSTS = 150; // allow generous headroom for live terminals

export const securityLimiter = (req: Request, res: Response, next: NextFunction) => {
  const clientIp = req.header("x-forwarded-for") || req.socket.remoteAddress || "127.0.0.1";
  const now = Date.now();

  const history = ipRequestHistory[clientIp];
  if (!history || now > history.expiresAt) {
    ipRequestHistory[clientIp] = { count: 1, expiresAt: now + RATE_WINDOW_MS };
  } else {
    history.count++;
  }

  if (ipRequestHistory[clientIp].count > MAX_BURSTS) {
    console.warn(`[PERIMETER WARNING] Rate throttle hit: ${clientIp}`);
    res.status(429).json({
      error: "RATE_LIMIT_EXCEEDED",
      message: "Gateway mitigation: Request density exceeds secure operational boundaries.",
      retryAfterSeconds: 30,
    });
    return;
  }
  next();
};

export const injectSecurityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https://* referrer; connect-src 'self' https://* wss://*;"
  );
  next();
};

export const sanitizePayloadInput = (req: Request, res: Response, next: NextFunction) => {
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /UNION\s+SELECT/gi,
    /document\.cookie/gi,
    /window\.location/gi,
    /javascript:/gi,
    /<iframe/gi,
    /onerror=/gi,
    /onload=/gi,
    /onclick=/gi,
    /exec\s*\(/gi,
    /<svg[^>]*onload/gi
  ];

  const checkUnsafeStr = (val: any): boolean => {
    if (typeof val === "string") {
      return dangerousPatterns.some(pattern => pattern.test(val));
    }
    if (val && typeof val === "object") {
      return Object.values(val).some(inner => checkUnsafeStr(inner));
    }
    return false;
  };

  if (req.body && checkUnsafeStr(req.body)) {
    console.warn(`[SECURITY SECURITY] Unsafe string footprint matched in POST body.`);
    res.status(400).json({
      error: "SANITIZATION_FAILED",
      message: "Direct perimeter policy violation checklist matched: script-like parameters intercepted."
    });
    return;
  }

  if (req.query && checkUnsafeStr(req.query)) {
    console.warn(`[SECURITY SECURITY] Unsafe string footprint matched in query parameters.`);
    res.status(400).json({
      error: "SANITIZATION_FAILED",
      message: "Direct perimeter policy violation checklist matched: script-like parameters intercepted in query."
    });
    return;
  }

  next();
};

export const protectSourceCode = (req: Request, res: Response, next: NextFunction) => {
  const urlPath = req.path.toLowerCase();
  
  // Define sensitive paths and extensions
  const isSourcePath = urlPath.startsWith("/src/") || urlPath.startsWith("/server/") || urlPath.startsWith("/backend/") || urlPath.includes("/dist/server.cjs");
  const isSensitiveExtension = urlPath.endsWith(".ts") || urlPath.endsWith(".tsx") || urlPath.endsWith(".jsx") || urlPath.endsWith(".json") || urlPath.endsWith(".env") || urlPath.endsWith(".env.example") || urlPath.endsWith(".map") || urlPath.endsWith(".prisma");

  // Keep package.json, lockfiles, database configurations completely private
  const isCriticalFile = urlPath.includes("package.json") || urlPath.includes("tsconfig.json") || urlPath.includes("db.json") || urlPath.includes(".env");

  if (isSourcePath || isSensitiveExtension || isCriticalFile) {
    // If we're in production, strictly forbid all source code paths
    if (process.env.NODE_ENV === "production") {
      console.warn(`[PERIMETER PREVENT] Blocked production exposure of source file: ${req.originalUrl}`);
      res.status(403).json({
        error: "ACCESS_DENIED",
        message: "Perimeter policy violation: Access to raw source codes is strictly forbidden in production mode.",
      });
      return;
    }

    // In development mode, only allow legitimate Vite compiler requests
    const secFetchDest = req.headers["sec-fetch-dest"] as string || "";
    const acceptHeader = req.headers["accept"] as string || "";
    
    const isViteImport = req.query.import !== undefined || req.url.includes("?t=") || req.url.includes("v=");
    
    // Determine true client IP under proxy/containerized environments
    const getRealClientIp = (r: Request): string => {
      const forwarded = r.headers["x-forwarded-for"];
      if (forwarded && typeof forwarded === "string") {
        const parts = forwarded.split(",");
        return parts[0].trim();
      }
      return r.ip || r.socket.remoteAddress || "127.0.0.1";
    };

    const realIp = getRealClientIp(req);
    const isLocalhost = realIp === "127.0.0.1" || realIp === "::1" || realIp === "::ffff:127.0.0.1";

    const referer = req.headers.referer || "";
    const origin = req.headers.origin || "";
    const host = req.headers.host || "";
    const forwardedHost = (req.headers["x-forwarded-host"] as string) || "";

    const hasValidReferer = referer !== "" && (
      referer.includes("localhost") ||
      referer.includes("127.0.0.1") ||
      referer.includes(".run.app") ||
      (host !== "" && referer.includes(host.split(":")[0])) ||
      (forwardedHost !== "" && referer.includes(forwardedHost.split(":")[0]))
    );

    const hasValidOrigin = origin !== "" && (
      origin.includes("localhost") ||
      origin.includes("127.0.0.1") ||
      origin.includes(".run.app") ||
      (host !== "" && origin.includes(host.split(":")[0])) ||
      (forwardedHost !== "" && origin.includes(forwardedHost.split(":")[0]))
    );

    const isNavigation = secFetchDest === "document";

    if (isLocalhost) {
      return next();
    }

    if (isViteImport) {
      return next();
    }

    // Allow legitimate non-navigation requests from recognized origins
    if (!isNavigation && (hasValidReferer || hasValidOrigin)) {
      return next();
    }

    // Block any standard, direct browser or automated direct probe requests
    console.warn(`[PERIMETER PREVENT] Blocked external direct fetch of development source file: ${req.originalUrl}`);
    res.status(403).json({
      error: "ACCESS_DENIED",
      message: "Perimeter policy violation: Direct request to raw source files is prohibited.",
    });
    return;
  }

  next();
};
