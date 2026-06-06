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
