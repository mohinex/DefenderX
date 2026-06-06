import { useEffect, useState } from "react";

interface SeoPageConfig {
  path: string;
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: "summary" | "summary_large_image";
  canonicalUrl: string;
  structuredDataJson: string;
}

interface SeoGlobalConfig {
  siteName: string;
  robotsTxt: string;
  googleAnalyticsId: string;
  googleSearchConsoleVerification: string;
  bingWebmasterVerification: string;
  organizationSchemaJson: string;
  localBusinessSchemaJson: string;
}

interface SeoBundle {
  global: SeoGlobalConfig | null;
  pages: SeoPageConfig[];
}

interface SeoManagerProps {
  activeRoute: string;
  inConsoleMode: boolean;
}

export default function SeoManager({ activeRoute, inConsoleMode }: SeoManagerProps) {
  const [seo, setSeo] = useState<SeoBundle>({ global: null, pages: [] });

  // Fetch configs from backend
  useEffect(() => {
    fetch("/api/v1/seo/public/config")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load SEO bundle");
      })
      .then((data: SeoBundle) => {
        setSeo(data);
        
        // Dynamic validation of Google Analytics script tag
        if (data.global?.googleAnalyticsId && typeof window !== "undefined") {
          const gaId = data.global.googleAnalyticsId;
          const GA_SCRIPT_ID = "seo-ga-init";
          
          if (!document.getElementById(GA_SCRIPT_ID)) {
            // Load script
            const s1 = document.createElement("script");
            s1.id = GA_SCRIPT_ID;
            s1.async = true;
            s1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
            document.head.appendChild(s1);

            const s2 = document.createElement("script");
            s2.innerHTML = `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `;
            document.head.appendChild(s2);
          }
        }
      })
      .catch((err) => {
        console.error("[SEO] Public configuration hydration failure:", err);
      });
  }, []);

  // Update DOM tags whenever active changes
  useEffect(() => {
    if (seo.pages.length === 0) return;

    // Map routes
    const lookupPath = inConsoleMode ? "console" : activeRoute;
    let page = seo.pages.find((p) => p.path === lookupPath);

    // Outbound fallback
    if (!page) {
      page = seo.pages.find((p) => p.path === "home");
      
      // If client attempts to query a totally non-existent path, note it into backend broken link manager
      if (lookupPath !== "console" && lookupPath !== "home" && lookupPath !== "services" && lookupPath !== "about" && lookupPath !== "why-us" && lookupPath !== "contact") {
        fetch("/api/v1/seo/public/broken-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: window.location.hash || window.location.pathname,
            referrer: document.referrer || "Direct Link"
          })
        }).catch(() => {});
      }
    }

    if (!page) return;

    // 1. Title
    document.title = page.title || `${seo.global?.siteName || "Eurosia Defender X"} — Cyber Platform`;

    // Helpers to inject meta tag cleanly
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.head.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Base Description
    if (page.description) {
      updateMetaTag("description", page.description);
    }

    // 3. Keywords
    if (page.keywords && page.keywords.length > 0) {
      updateMetaTag("keywords", page.keywords.join(", "));
    }

    // 4. Open Graph Social Banners
    updateMetaTag("og:title", page.ogTitle || page.title, true);
    updateMetaTag("og:description", page.ogDescription || page.description, true);
    updateMetaTag("og:type", "website", true);
    updateMetaTag("og:url", page.canonicalUrl || window.location.href, true);
    if (page.ogImage) {
      updateMetaTag("og:image", page.ogImage, true);
    }
    updateMetaTag("og:site_name", seo.global?.siteName || "Eurosia Defender X", true);

    // 5. Twitter / X Share Format
    updateMetaTag("twitter:card", page.twitterCard || "summary_large_image");
    updateMetaTag("twitter:title", page.ogTitle || page.title);
    updateMetaTag("twitter:description", page.ogDescription || page.description);
    updateMetaTag("twitter:site", "@EurosiaOfficial");
    updateMetaTag("twitter:creator", "@EurosiaOfficial");
    if (page.ogImage) {
      updateMetaTag("twitter:image", page.ogImage);
    }

    // 6. Search Engine Console Verification Tags
    if (seo.global?.googleSearchConsoleVerification) {
      updateMetaTag("google-site-verification", seo.global.googleSearchConsoleVerification);
    }
    if (seo.global?.bingWebmasterVerification) {
      updateMetaTag("msvalidate.01", seo.global.bingWebmasterVerification);
    }

    // 7. Canonical URL
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", page.canonicalUrl || window.location.href);

    // 8. JSON-LD Schema.org Structured Data block
    const SCHEMAS_SCRIPT_ID = "seo-json-ld-schemas";
    let schemaScript = document.getElementById(SCHEMAS_SCRIPT_ID) as HTMLScriptElement;
    if (schemaScript) {
      schemaScript.remove();
    }
    
    // Stitch page schema + Organization Schema + LocalBusiness Schema altogether in a single indexable graph!
    const graph: any[] = [];

    // Parse page schema
    if (page.structuredDataJson) {
      try {
        graph.push(JSON.parse(page.structuredDataJson));
      } catch (e) {}
    }

    // Parse organization-level microdata
    if (seo.global?.organizationSchemaJson) {
      try {
        graph.push(JSON.parse(seo.global.organizationSchemaJson));
      } catch (e) {}
    }

    // Parse local business microdata
    if (seo.global?.localBusinessSchemaJson) {
      try {
        graph.push(JSON.parse(seo.global.localBusinessSchemaJson));
      } catch (e) {}
    }

    if (graph.length > 0) {
      schemaScript = document.createElement("script");
      schemaScript.id = SCHEMAS_SCRIPT_ID;
      schemaScript.type = "application/ld+json";
      schemaScript.innerHTML = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": graph
      }, null, 2);
      document.head.appendChild(schemaScript);
    }

  }, [activeRoute, inConsoleMode, seo]);

  return null; // Silent meta manager
}
