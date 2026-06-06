import { Request, Response } from "express";
import { db } from "../repositories/database";

export class SeoController {
  // Public - Config bundle for frontend hydration
  public static getPublicConfig(req: Request, res: Response): void {
    try {
      const global = db.getSeoGlobal();
      const pages = db.getSeoPages();
      res.json({ global, pages });
    } catch (e) {
      res.status(500).json({ error: "SEO_FAULT", message: "Failed to load public SEO parameters." });
    }
  }

  // Public - Client logs broken links
  public static reportBrokenLink(req: Request, res: Response): void {
    try {
      const { url, referrer } = req.body;
      if (typeof url !== "string") {
        res.status(400).json({ error: "INVALID_BODY", message: "Broken link URL must be a string." });
        return;
      }
      const cleanUrl = url.trim();
      const cleanReferrer = typeof referrer === "string" ? referrer.trim() : "";
      
      const logged = db.recordBrokenLink(cleanUrl, cleanReferrer, 404);
      res.status(201).json({ status: "LOGGED", logged });
    } catch (e) {
      res.status(500).json({ error: "SEO_FAULT", message: "Failed to register broken link log." });
    }
  }

  // Admin - Get page metadata configs
  public static getPages(req: Request, res: Response): void {
    try {
      const pages = db.getSeoPages();
      res.json(pages);
    } catch (e) {
      res.status(500).json({ error: "SEO_FAULT", message: "Failed to retrieve SEO pages registry." });
    }
  }

  // Admin - Update page metadata config
  public static updatePage(req: Request, res: Response): void {
    try {
      const { path: pathParam } = req.params;
      const { title, description, keywords, ogTitle, ogDescription, ogImage, twitterCard, canonicalUrl, structuredDataJson } = req.body;

      if (!pathParam) {
        res.status(400).json({ error: "PATH_REQUIRED", message: "Page pathname identifier is required." });
        return;
      }

      const updates = {
        title: typeof title === "string" ? title.trim() : undefined,
        description: typeof description === "string" ? description.trim() : undefined,
        keywords: Array.isArray(keywords) ? keywords.map((k: any) => String(k).trim()) : undefined,
        ogTitle: typeof ogTitle === "string" ? ogTitle.trim() : undefined,
        ogDescription: typeof ogDescription === "string" ? ogDescription.trim() : undefined,
        ogImage: typeof ogImage === "string" ? ogImage.trim() : undefined,
        twitterCard: (twitterCard === "summary" || twitterCard === "summary_large_image") ? twitterCard : undefined,
        canonicalUrl: typeof canonicalUrl === "string" ? canonicalUrl.trim() : undefined,
        structuredDataJson: typeof structuredDataJson === "string" ? structuredDataJson.trim() : undefined,
      };

      const updated = db.updateSeoPage(pathParam, updates);
      
      // Log this admin action
      const operator = (req as any).sessionUser?.name || "Global Administrator";
      db.addAuditLog(operator, `SEO MANIFEST UPDATE - Modified page configurations and JSON-LD schema for '${pathParam}' path.`, req.ip || "127.0.0.1");

      res.json({ status: "SUCCESS", updated });
    } catch (e) {
      res.status(500).json({ error: "SEO_FAULT", message: "Failed to update page SEO configuration." });
    }
  }

  // Admin - Get global metadata variables
  public static getGlobal(req: Request, res: Response): void {
    try {
      const config = db.getSeoGlobal();
      res.json(config);
    } catch (e) {
      res.status(500).json({ error: "SEO_FAULT", message: "Failed to load global SEO parameters." });
    }
  }

  // Admin - Update global settings
  public static updateGlobal(req: Request, res: Response): void {
    try {
      const { siteName, robotsTxt, googleAnalyticsId, googleSearchConsoleVerification, bingWebmasterVerification, organizationSchemaJson, localBusinessSchemaJson, facebookUrl, twitterUrl, linkedinUrl } = req.body;

      const updates = {
        siteName: typeof siteName === "string" ? siteName.trim() : undefined,
        robotsTxt: typeof robotsTxt === "string" ? robotsTxt.trim() : undefined,
        googleAnalyticsId: typeof googleAnalyticsId === "string" ? googleAnalyticsId.trim() : undefined,
        googleSearchConsoleVerification: typeof googleSearchConsoleVerification === "string" ? googleSearchConsoleVerification.trim() : undefined,
        bingWebmasterVerification: typeof bingWebmasterVerification === "string" ? bingWebmasterVerification.trim() : undefined,
        organizationSchemaJson: typeof organizationSchemaJson === "string" ? organizationSchemaJson.trim() : undefined,
        localBusinessSchemaJson: typeof localBusinessSchemaJson === "string" ? localBusinessSchemaJson.trim() : undefined,
        facebookUrl: typeof facebookUrl === "string" ? facebookUrl.trim() : undefined,
        twitterUrl: typeof twitterUrl === "string" ? twitterUrl.trim() : undefined,
        linkedinUrl: typeof linkedinUrl === "string" ? linkedinUrl.trim() : undefined,
      };

      const updated = db.updateSeoGlobal(updates);

      // Log action
      const operator = (req as any).sessionUser?.name || "Global Administrator";
      db.addAuditLog(operator, `SEO GLOBAL UPDATE - Reconfigured search variables, bots instructions, and system schemas.`, req.ip || "127.0.0.1");

      res.json({ status: "SUCCESS", updated });
    } catch (e) {
      res.status(500).json({ error: "SEO_FAULT", message: "Failed to update global SEO configuration." });
    }
  }

  // Admin - Fetch redirects
  public static getRedirects(req: Request, res: Response): void {
    try {
      const data = db.getSeoRedirects();
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: "SEO_FAULT", message: "Failed to pull router redirects." });
    }
  }

  // Admin - Create a redirect rule
  public static addRedirect(req: Request, res: Response): void {
    try {
      const { sourcePath, targetPath, statusCode } = req.body;
      if (typeof sourcePath !== "string" || typeof targetPath !== "string" || !sourcePath.startsWith("/") || !targetPath.startsWith("/")) {
        res.status(400).json({ error: "PARAMS_INVALID", message: "Redirect routes must start with a forward slash (/)." });
        return;
      }
      const code = (statusCode === 301 || statusCode === 302) ? statusCode : 301;
      const created = db.addSeoRedirect(sourcePath.trim(), targetPath.trim(), code);

      // Log action
      const operator = (req as any).sessionUser?.name || "Global Administrator";
      db.addAuditLog(operator, `SEO REDIRECT CREATE - Added redirection rule matching '${sourcePath}' routing into '${targetPath}' [${code}].`, req.ip || "127.0.0.1");

      res.status(201).json({ status: "CREATED", created });
    } catch (e) {
      res.status(500).json({ error: "SEO_FAULT", message: "Failed to configure redirect mapping." });
    }
  }

  // Admin - Delete redirect rule
  public static removeRedirect(req: Request, res: Response): void {
    try {
      const { id } = req.params;
      const removed = db.removeSeoRedirect(id);
      if (!removed) {
        res.status(404).json({ error: "NOT_FOUND", message: "Target redirect rule could not be located." });
        return;
      }

      const operator = (req as any).sessionUser?.name || "Global Administrator";
      db.addAuditLog(operator, `SEO REDIRECT PURGED - Removed custom router redirect index '${id}'.`, req.ip || "127.0.0.1");

      res.json({ status: "DELETED" });
    } catch (e) {
      res.status(500).json({ error: "SEO_FAULT", message: "Failed to wipe target redirect mapping." });
    }
  }

  // Admin - Load broken link logs
  public static getBrokenLinks(req: Request, res: Response): void {
    try {
      const logs = db.getBrokenLinks();
      res.json(logs);
    } catch (e) {
      res.status(500).json({ error: "SEO_FAULT", message: "Failed to query system broken link metrics." });
    }
  }

  // Admin - Clear broken links
  public static clearBrokenLinks(req: Request, res: Response): void {
    try {
      db.clearBrokenLinks();
      const operator = (req as any).sessionUser?.name || "Global Administrator";
      db.addAuditLog(operator, `SEO REPAIR - Emptying logs database tracking broken outbound client links.`, req.ip || "127.0.0.1");
      res.json({ status: "SUCCESS" });
    } catch (e) {
      res.status(500).json({ error: "SEO_FAULT", message: "Failed to purge broken links index." });
    }
  }

  // Admin - SEO Score Checker & Audit Engine
  public static getSitemapHealth(req: Request, res: Response): void {
    try {
      const pages = db.getSeoPages();
      const globals = db.getSeoGlobal();
      const broken = db.getBrokenLinks();
      const redirects = db.getSeoRedirects();

      const pageReports: any[] = [];
      let cumulativeScore = 0;
      const suggestions: string[] = [];
      const missingMetas: string[] = [];
      const duplicateMetas: string[] = [];

      // Check for duplicate titles or descriptions
      const titlesMap: Record<string, string[]> = {};
      const descMap: Record<string, string[]> = {};

      pages.forEach(p => {
        let pageScore = 0;
        const pageSuggestions: string[] = [];
        const pageMissing: string[] = [];

        // Dynamic audits
        if (p.title) {
          pageScore += 20;
          if (p.title.length < 40) {
            pageSuggestions.push(`Title tag is too short (${p.title.length} characters). Target is 40-70 characters to avoid snippet truncation.`);
          } else if (p.title.length > 70) {
            pageSuggestions.push(`Title tag is too long (${p.title.length} characters). Keep under 70 characters for premium search result layout.`);
          }
          if (!titlesMap[p.title]) titlesMap[p.title] = [];
          titlesMap[p.title].push(p.path);
        } else {
          pageMissing.push("Meta Title is missing");
          pageSuggestions.push("Strictly define a meta title. Search crawlers will auto-generate low quality snippets otherwise.");
        }

        if (p.description) {
          pageScore += 20;
          if (p.description.length < 120) {
            pageSuggestions.push(`Meta Description too compact (${p.description.length} characters). Target 120-160 characters for high description density.`);
          } else if (p.description.length > 160) {
            pageSuggestions.push(`Meta Description too long (${p.description.length} characters). Limit to 160 characters to avoid truncation by Google.`);
          }
          if (!descMap[p.description]) descMap[p.description] = [];
          descMap[p.description].push(p.path);
        } else {
          pageMissing.push("Meta Description is missing");
          pageSuggestions.push("Critical: Build a compelling meta description highlighting your cyber defense platform services.");
        }

        if (p.keywords && p.keywords.length > 0) {
          pageScore += 10;
        } else {
          pageMissing.push("Keywords array is empty");
          pageSuggestions.push("Establish 3-5 focus keywords for specific service queries on Bing and DuckDuckGo.");
        }

        if (p.ogTitle) {
          pageScore += 10;
        } else {
          pageMissing.push("og:title parameter missing");
        }

        if (p.ogDescription) {
          pageScore += 10;
        } else {
          pageMissing.push("og:description parameter missing");
        }

        if (p.ogImage) {
          pageScore += 10;
        } else {
          pageMissing.push("og:image social thumbnail missing");
          pageSuggestions.push("Upload dedicated social graph preview banner (og:image) for WhatsApp and LinkedIn shares.");
        }

        if (p.canonicalUrl) {
          pageScore += 10;
        } else {
          pageMissing.push("Canonical URL is unconfigured");
          pageSuggestions.push("Define a canonical URL (e.g., https://eurosia.com/#index) to avoid index dilution.");
        }

        if (p.structuredDataJson) {
          try {
            JSON.parse(p.structuredDataJson);
            pageScore += 10;
          } catch (e) {
            pageSuggestions.push("Structured JSON-LD schema is syntax malformed. Fix structure to enable rich FAQ/Breadcrumb snippet cards.");
          }
        }

        cumulativeScore += pageScore;
        
        pageMissing.forEach(m => missingMetas.push(`[/${p.path}] ${m}`));
        pageSuggestions.forEach(s => suggestions.push(`[/${p.path}] ${s}`));

        pageReports.push({
          path: p.path,
          score: pageScore,
          missing: pageMissing,
          suggestions: pageSuggestions
        });
      });

      // Find duplicates
      Object.entries(titlesMap).forEach(([title, paths]) => {
        if (paths.length > 1) {
          duplicateMetas.push(`Duplicate Meta Title found: '${title}' shared across [${paths.map(p => "/" + p).join(", ")}] pathing indices.`);
          suggestions.push(`Avoid duplicate title tags. Write specific focused descriptors on [${paths.map(p => "/" + p).join(", ")}] routes.`);
        }
      });

      Object.entries(descMap).forEach(([desc, paths]) => {
        if (paths.length > 1) {
          duplicateMetas.push(`Duplicate Meta Description found across [${paths.map(p => "/" + p).join(", ")}].`);
        }
      });

      // Global parameters score multipliers
      let globalsScore = 100;
      if (!globals.googleAnalyticsId) globalsScore -= 20;
      if (!globals.googleSearchConsoleVerification) globalsScore -= 20;
      if (!globals.robotsTxt) globalsScore -= 20;
      if (broken.length > 0) globalsScore -= Math.min(20, broken.length * 5); // broken links degrade UX score

      const finalAuditScore = Math.round((cumulativeScore / (pages.length || 1) + globalsScore) / 2);

      res.json({
        overallScore: finalAuditScore,
        pagesAnalysis: pageReports,
        suggestions,
        missingMetas,
        duplicateMetas,
        brokenLinksCount: broken.length,
        redirectsCount: redirects.length,
        googleAnalyticsStatus: !!globals.googleAnalyticsId ? "ACTIVE" : "MISSING_TAG",
        searchConsoleStatus: !!globals.googleSearchConsoleVerification ? "VERIFIED" : "UNBOUND",
        healthLevel: finalAuditScore >= 90 ? "Excellent" : finalAuditScore >= 75 ? "Satisfactory" : "Attention Required"
      });
    } catch (e) {
      res.status(500).json({ error: "SEO_FAULT", message: "Failed during automatic SEO audit check." });
    }
  }

  // Public/Sitemap handler - generates dynamic live XML
  public static getSitemapXml(req: Request, res: Response): void {
    try {
      const pages = db.getSeoPages();
      const baseUrl = "https://eurosia.com";

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      pages.forEach(p => {
        const routeLoc = p.path === "home" ? "" : `#${p.path}`;
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/${routeLoc}</loc>\n`;
        xml += `    <lastmod>${new Date().toISOString().substring(0, 10)}</lastmod>\n`;
        xml += `    <changefreq>daily</changefreq>\n`;
        xml += `    <priority>${p.path === "home" ? "1.0" : "0.8"}</priority>\n`;
        xml += `  </url>\n`;
      });

      xml += `</urlset>`;

      res.header("Content-Type", "application/xml");
      res.status(200).send(xml);
    } catch (e) {
      res.status(500).send("Error generating XML sitemap");
    }
  }

  // Public/Robots handler - dynamic robots
  public static getRobotsTxt(req: Request, res: Response): void {
    try {
      const config = db.getSeoGlobal();
      res.header("Content-Type", "text/plain");
      res.status(200).send(config.robotsTxt);
    } catch (e) {
      res.status(200).send("User-agent: *\nAllow: /\nSitemap: https://eurosia.com/sitemap.xml");
    }
  }
}
