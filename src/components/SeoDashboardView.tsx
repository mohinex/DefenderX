import { useState, useEffect } from "react";
import { 
  BarChart, Globe, HelpCircle, CheckCircle, AlertOctagon, 
  Trash2, PlusCircle, ArrowRight, Save, Layout, Sliders, 
  Link as LinkIcon, RefreshCw, AlertTriangle, Play, HelpCircle as HelpIcon, 
  ExternalLink, Search
} from "lucide-react";
import { securedFetch } from "../lib/api";
import { triggerSecOpsToast } from "./ToastContainer";

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
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
}

interface BrokenLink {
  id: string;
  url: string;
  referrer: string;
  detectedAt: string;
  statusCode: number;
}

interface SeoRedirect {
  id: string;
  sourcePath: string;
  targetPath: string;
  statusCode: number;
  createdAt: string;
}

interface AuditReport {
  overallScore: number;
  suggestions: string[];
  missingMetas: string[];
  duplicateMetas: string[];
  brokenLinksCount: number;
  redirectsCount: number;
  googleAnalyticsStatus: string;
  searchConsoleStatus: string;
  healthLevel: string;
}

export default function SeoDashboardView({ isDark, user }: { isDark: boolean; user: any }) {
  const [audit, setAudit] = useState<AuditReport | null>(null);
  const [globalConfig, setGlobalConfig] = useState<SeoGlobalConfig | null>(null);
  const [pages, setPages] = useState<SeoPageConfig[]>([]);
  const [redirects, setRedirects] = useState<SeoRedirect[]>([]);
  const [brokenLinks, setBrokenLinks] = useState<BrokenLink[]>([]);
  
  const [selectedPagePath, setSelectedPagePath] = useState<string>("home");
  const [pageForm, setPageForm] = useState<Partial<SeoPageConfig>>({});
  const [newRedirect, setNewRedirect] = useState({ sourcePath: "", targetPath: "", statusCode: 301 });
  
  const [isSavingGlobal, setIsSavingGlobal] = useState(false);
  const [isSavingPage, setIsSavingPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSeoData = async () => {
    try {
      setIsLoading(true);
      const auditPayload = await securedFetch("/api/v1/seo/sitemap-health");
      setAudit(auditPayload);

      const globalPayload = await securedFetch("/api/v1/seo/global");
      setGlobalConfig(globalPayload);

      const pagesPayload = await securedFetch("/api/v1/seo/pages");
      setPages(pagesPayload);

      // Hydrate selected page config
      const matchingPage = pagesPayload.find((p: any) => p.path === selectedPagePath);
      if (matchingPage) {
        setPageForm(matchingPage);
      }

      const redirectsPayload = await securedFetch("/api/v1/seo/redirects");
      setRedirects(redirectsPayload);

      const brokenPayload = await securedFetch("/api/v1/seo/broken-links");
      setBrokenLinks(brokenPayload);

    } catch (e) {
      console.error("Failed to fetch administrative SEO resources:", e);
      triggerSecOpsToast("Unbound secure API error: Failed to fetch SEO metadata registry.", "blocked");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoData();
  }, []);

  // Update selected page configurations when navigation shifts
  useEffect(() => {
    const matchingPage = pages.find((p) => p.path === selectedPagePath);
    if (matchingPage) {
      setPageForm(matchingPage);
    } else {
      setPageForm({
        path: selectedPagePath,
        title: "",
        description: "",
        keywords: [],
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        twitterCard: "summary_large_image",
        canonicalUrl: "",
        structuredDataJson: "{}",
      });
    }
  }, [selectedPagePath, pages]);

  // Submit Global Parameters
  const handleSaveGlobal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalConfig) return;
    try {
      setIsSavingGlobal(true);
      const result = await securedFetch("/api/v1/seo/global", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(globalConfig)
      });
      if (result.status === "SUCCESS") {
        triggerSecOpsToast("SEO Global parameters re-coded and active.", "resolved");
        await fetchSeoData();
      }
    } catch (err: any) {
      triggerSecOpsToast(err.message || "Failed to adjust global parameters.", "blocked");
    } finally {
      setIsSavingGlobal(false);
    }
  };

  // Submit Specific Page configuration
  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingPage(true);
      const payload = {
        ...pageForm,
        keywords: Array.isArray(pageForm.keywords) 
          ? pageForm.keywords.map((k) => k.trim()) 
          : []
      };
      
      const result = await securedFetch(`/api/v1/seo/pages/${selectedPagePath}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (result.status === "SUCCESS") {
        triggerSecOpsToast(`/${selectedPagePath} meta-tags successfully refreshed and deployed.`, "resolved");
        await fetchSeoData();
      }
    } catch (err: any) {
      triggerSecOpsToast(err.message || "Failed to adjust page attributes.", "blocked");
    } finally {
      setIsSavingPage(false);
    }
  };

  // Setup Redirect Rule
  const handleAddRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRedirect.sourcePath || !newRedirect.targetPath) {
      triggerSecOpsToast("Define matching source and routing paths.", "blocked");
      return;
    }
    try {
      const result = await securedFetch("/api/v1/seo/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRedirect)
      });
      if (result.status === "CREATED") {
        triggerSecOpsToast(`Redirect Rule established: ${newRedirect.sourcePath} -> ${newRedirect.targetPath}`, "resolved");
        setNewRedirect({ sourcePath: "", targetPath: "", statusCode: 301 });
        await fetchSeoData();
      }
    } catch (err: any) {
      triggerSecOpsToast(err.message || "Unauthorized routing override failed.", "blocked");
    }
  };

  // Remove Redirect Rule
  const handleDeleteRedirect = async (id: string) => {
    if (user.role !== "admin") {
      triggerSecOpsToast("Administrative L9 privileges required to purge router redirects.", "blocked");
      return;
    }
    try {
      const result = await securedFetch(`/api/v1/seo/redirects/${id}`, {
        method: "DELETE"
      });
      if (result.status === "DELETED") {
        triggerSecOpsToast("Redirect law purged from database routing layers.", "system");
        await fetchSeoData();
      }
    } catch (err: any) {
      triggerSecOpsToast(err.message || "Purge request denied.", "blocked");
    }
  };

  // Wipe Broken link reports
  const handleClearBrokenLinks = async () => {
    try {
      await securedFetch("/api/v1/seo/broken-links", { method: "DELETE" });
      triggerSecOpsToast("Broken link metrics cleared successfully.", "resolved");
      await fetchSeoData();
    } catch (err: any) {
      triggerSecOpsToast(err.message || "Clear request failed.", "blocked");
    }
  };

  if (isLoading && !audit) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 select-none">
        <RefreshCw size={36} className="text-indigo-500 animate-spin" />
        <span className="font-mono text-xs text-gray-500 tracking-widest uppercase">Querying indexing registries and sitemap scoring...</span>
      </div>
    );
  }

  // Length calculation indicators
  const titleLen = pageForm.title?.length || 0;
  const descLen = pageForm.description?.length || 0;

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in select-none">
      
      {/* 1. SEO AUDIT AND SITEMAP MONITOR ROW */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Core Radial Score widget */}
        <div 
          className="md:col-span-4 border rounded-xl p-5 select-none backdrop-blur-md flex flex-col justify-between"
          style={{
            borderColor: isDark ? "rgba(77, 141, 255, 0.18)" : "rgba(10, 16, 37, 0.12)",
            backgroundColor: isDark ? "rgba(10, 16, 37, 0.85)" : "rgba(255, 255, 255, 0.8)"
          }}
        >
          <h4 className="font-display font-black text-xs tracking-wider text-gray-400 uppercase mb-4">Enterprise SEO Scoring Audit</h4>
          
          <div className="flex flex-col items-center justify-center gap-2 py-4">
            <div className="relative flex items-center justify-center">
              {/* Spinning status circle */}
              <svg className="w-24 h-24" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  style={{ stroke: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)" }}
                  strokeDasharray="100, 100"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={
                    (audit?.overallScore || 0) >= 90 ? "text-[#00C853]" : 
                    (audit?.overallScore || 0) >= 75 ? "text-amber-500" : "text-red-alert"
                  }
                  strokeDasharray={`${audit?.overallScore || 0}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center flex flex-col items-center">
                <span className="text-2xl font-mono font-black tracking-tighter text-white">
                  {audit?.overallScore}%
                </span>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Health Score</span>
              </div>
            </div>

            <div className="mt-2 text-center">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-black tracking-widest uppercase ${
                audit?.healthLevel === "Excellent" ? "bg-green-alert/15 text-[#00C853] border border-[#00c853]/20" :
                audit?.healthLevel === "Satisfactory" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                "bg-red-alert/10 text-red-alert border border-red-alert/20"
              }`}>
                {audit?.healthLevel} Status
              </span>
            </div>
          </div>

          <div className="border-t pt-3.5 mt-2 flex justify-between items-center text-[10px]" style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)" }}>
            <span className="text-gray-400 font-mono font-bold">ROUTERS EXPOSED IN SITEMAP:</span>
            <span className="font-bold text-white font-mono">{pages.length} PATHS</span>
          </div>
        </div>

        {/* Audit Suggestions Log */}
        <div 
          className="md:col-span-8 border rounded-xl p-5 select-none backdrop-blur-md flex flex-col justify-between h-full"
          style={{
            borderColor: isDark ? "rgba(77, 141, 155, 0.18)" : "rgba(10, 16, 37, 0.12)",
            backgroundColor: isDark ? "rgba(10, 16, 37, 0.85)" : "rgba(255, 255, 255, 0.8)"
          }}
        >
          <div className="flex justify-between items-center border-b pb-3.5 mb-3" style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)" }}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={16} />
              <span className="font-display font-black text-xs tracking-wider uppercase text-white">Crawler Suggestions & Audit Logs</span>
            </div>
            <button 
              onClick={fetchSeoData} 
              className="text-indigo-400 hover:text-white transition-colors flex items-center gap-1 text-[10px] uppercase font-mono tracking-widest font-bold"
            >
              <RefreshCw size={11} className="animate-spin" style={{ animationDuration: "5s" }} /> Re-evaluate Score
            </button>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[160px] space-y-2.5 pr-1 text-[11px] font-sans">
            {audit?.suggestions.length === 0 ? (
              <div className="flex items-center gap-2 text-green-alert font-bold bg-green-500/5 p-3.5 rounded-lg border border-green-500/10">
                <CheckCircle size={15} />
                <span>Excellent. Your platform configuration has passed all 18 Google Lighthouse performance SEO meta audits checklist successfully.</span>
              </div>
            ) : (
              audit?.suggestions.map((suggestion, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2 px-3 rounded-lg bg-black/25 text-gray-300 border border-white/5 leading-relaxed">
                  <AlertOctagon size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{suggestion}</span>
                </div>
              ))
            )}
            
            {audit?.duplicateMetas && audit.duplicateMetas.length > 0 && (
              audit.duplicateMetas.map((dup, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2 px-3 rounded-lg bg-red-alert/5 text-red-alert border border-red-alert/10 leading-relaxed font-mono text-[10px]">
                  <AlertTriangle size={13} className="text-red-alert mt-0.5 flex-shrink-0" />
                  <span>{dup}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 2. DYNAMIC INDEXING MONITOR RAIL */}
      <div 
        className="border rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono"
        style={{
          borderColor: isDark ? "rgba(77, 141, 255, 0.18)" : "rgba(10, 16, 37, 0.12)",
          backgroundColor: isDark ? "rgba(10, 16, 37, 0.55)" : "rgba(232, 236, 245, 0.55)"
        }}
      >
        <div className="flex items-center gap-2 text-white font-sans text-xs">
          <Globe className="text-accent-blue" size={15} />
          <span>Active crawlable robots & dynamic index maps exposed on absolute paths:</span>
        </div>
        <div className="flex gap-3">
          <a 
            href="/robots.txt" 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-black/40 hover:bg-black/60 border border-white/10 text-indigo-400 hover:text-white transition-all font-mono text-[11px] uppercase"
          >
            <ExternalLink size={12} /> robots.txt
          </a>
          <a 
            href="/sitemap.xml" 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-black/40 hover:bg-black/60 border border-white/10 text-indigo-400 hover:text-white transition-all font-mono text-[11px] uppercase"
          >
            <ExternalLink size={12} /> sitemap.xml
          </a>
        </div>
      </div>

      {/* 3. CORE EDITING WORKSPACE MAP - TWO COLUMN CONFIGURE */}
      <div className="grid grid-cols-1 xl:cols-span-12 xl:grid-cols-12 gap-6 items-start">
        
        {/* Left segment - Page-by-page Meta Tag Workspace (7/12 width) */}
        <form 
          onSubmit={handleSavePage}
          className="xl:col-span-7 border rounded-xl p-5 backdrop-blur-md flex flex-col gap-5 text-xs"
          style={{
            borderColor: isDark ? "rgba(77, 141, 255, 0.18)" : "rgba(10, 16, 37, 0.12)",
            backgroundColor: isDark ? "rgba(10, 16, 37, 0.85)" : "rgba(255, 255, 255, 0.8)"
          }}
        >
          <div className="flex justify-between items-center border-b pb-3.5" style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)" }}>
            <div className="flex items-center gap-2">
              <Sliders className="text-accent-blue" size={16} />
              <span className="font-display font-black text-xs tracking-wider uppercase text-white">Page-By-Page Meta Configurator</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 font-bold font-mono">SELECT ROUTE:</span>
              <select 
                value={selectedPagePath}
                onChange={(e) => setSelectedPagePath(e.target.value)}
                className="bg-black/40 text-accent-blue font-mono text-[11px] border border-white/10 rounded px-2.5 py-1.5 focus:outline-none focus:border-accent-blue uppercase font-black"
              >
                {pages.map(p => (
                  <option key={p.path} value={p.path}>/{p.path === "home" ? "" : p.path}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Meta Title */}
            <div>
              <div className="flex justify-between items-center mb-1 text-[11px]">
                <label className="text-gray-400 font-semibold uppercase">Meta Title Tag</label>
                <span className={`font-mono text-[10px] font-bold ${
                  titleLen < 40 ? "text-amber-500" : titleLen <= 70 ? "text-[#00C853]" : "text-red-alert"
                }`}>
                  {titleLen}/70 Chars ({titleLen < 40 ? "Short" : titleLen <= 70 ? "Optimal" : "Too Long"})
                </span>
              </div>
              <input 
                type="text"
                value={pageForm.title || ""}
                onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                placeholder="E.g., Eurosia Defender X | Enterprise Managed Cybersecurity Services"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-3.5 py-2.5 font-sans focus:outline-none focus:border-accent-blue text-white"
              />
            </div>

            {/* Canonical Link */}
            <div>
              <label className="block mb-1 text-gray-400 font-semibold uppercase text-[11px]">Canonical URL Address</label>
              <input 
                type="text"
                value={pageForm.canonicalUrl || ""}
                onChange={(e) => setPageForm({ ...pageForm, canonicalUrl: e.target.value })}
                placeholder="E.g., https://eurosia.com/#services"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-3.5 py-2.5 font-mono focus:outline-none focus:border-accent-blue text-white"
              />
            </div>
          </div>

          {/* Meta Description */}
          <div>
            <div className="flex justify-between items-center mb-1 text-[11px]">
              <label className="text-gray-400 font-semibold uppercase">Meta Description snippet</label>
              <span className={`font-mono text-[10px] font-bold ${
                descLen < 120 ? "text-amber-500" : descLen <= 160 ? "text-[#00C853]" : "text-red-alert"
              }`}>
                {descLen}/160 Chars ({descLen < 120 ? "Too Compact" : descLen <= 160 ? "Optimal" : "Too Long"})
              </span>
            </div>
            <textarea 
              rows={2}
              value={pageForm.description || ""}
              onChange={(e) => setPageForm({ ...pageForm, description: e.target.value })}
              placeholder="Inject a powerful 120-160 characters search snippet summarizing your specialized cloud firewall shields, real-time threat intelligence and virtual security operations..."
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3.5 py-2.5 font-sans focus:outline-none focus:border-accent-blue text-white leading-relaxed"
            />
          </div>

          {/* Meta Keywords */}
          <div>
            <label className="block mb-1 text-gray-400 font-semibold uppercase text-[11px]">Keywords (Comma-Separated Indices)</label>
            <input 
              type="text"
              value={Array.isArray(pageForm.keywords) ? pageForm.keywords.join(", ") : ""}
              onChange={(e) => setPageForm({ ...pageForm, keywords: e.target.value.split(",") })}
              placeholder="cybersecurity, managed firewall, secops dashboard, vulnerability evaluation"
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3.5 py-2.5 font-sans focus:outline-none focus:border-accent-blue text-white"
            />
          </div>

          <div className="border-t pt-4 mt-1 border-white/5">
            <h5 className="font-display font-black text-[11px] tracking-wider text-indigo-400 uppercase mb-3 flex items-center gap-1">
              <span>Open Graph & Social Graph Preview Overrides</span>
              <HelpIcon size={12} className="text-gray-500 cursor-help hover:text-white" onClick={() => triggerSecOpsToast("Social metadata variables matching meta blocks for absolute compliance.", "system")} />
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-gray-400 font-semibold uppercase text-[10px]">OG Tag Title Override</label>
                <input 
                  type="text"
                  value={pageForm.ogTitle || ""}
                  onChange={(e) => setPageForm({ ...pageForm, ogTitle: e.target.value })}
                  placeholder="E.g., Operational Cyber Defense Shield active"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 font-sans focus:outline-none focus:border-accent-blue text-white"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-gray-400 font-semibold uppercase text-[10px]">OG Thumb Image URL</label>
                <input 
                  type="text"
                  value={pageForm.ogImage || ""}
                  onChange={(e) => setPageForm({ ...pageForm, ogImage: e.target.value })}
                  placeholder="E.g., https://eurosia.com/social-og.jpg"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-accent-blue text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <label className="block mb-1 text-gray-400 font-semibold uppercase text-[10px]">OG Description Override</label>
                <textarea 
                  rows={2}
                  value={pageForm.ogDescription || ""}
                  onChange={(e) => setPageForm({ ...pageForm, ogDescription: e.target.value })}
                  placeholder="Snippet summarizing share description overrides."
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 font-sans focus:outline-none focus:border-accent-blue text-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-400 font-semibold uppercase text-[10px]">Twitter/X Template Format</label>
                <select 
                  value={pageForm.twitterCard || "summary_large_image"}
                  onChange={(e) => setPageForm({ ...pageForm, twitterCard: e.target.value as any })}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-accent-blue text-white"
                >
                  <option value="summary">Summary standard compact card</option>
                  <option value="summary_large_image">Summary large banner model</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-t pt-4 border-white/5">
            <label className="block mb-1 text-indigo-400 font-display font-black tracking-wider uppercase text-[11px]">JSON-LD Structured Data Schema (Schema.org)</label>
            <textarea 
              rows={3}
              value={pageForm.structuredDataJson || "{}"}
              onChange={(e) => setPageForm({ ...pageForm, structuredDataJson: e.target.value })}
              placeholder='{ "@type": "WebPage", "name": "Services Node" }'
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 font-mono focus:outline-none focus:border-accent-blue text-xs text-green-alert"
            />
          </div>

          <button 
            type="submit"
            disabled={isSavingPage}
            className="w-full font-display font-black tracking-widest text-[#fff] cursor-pointer rounded-lg py-3 bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 mt-1 flex items-center justify-center gap-2 text-xs uppercase"
          >
            {isSavingPage ? (
              <RefreshCw className="animate-spin" size={14} />
            ) : (
              <Save size={14} />
            )}
            Save /{selectedPagePath} Metadata configs
          </button>
        </form>

        {/* Right Segment - Social Simulation & Global Parameters & Systems (5/12 width) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          
          {/* Real-time Google and Social graph live simulators */}
          <div 
            className="border rounded-xl p-5 backdrop-blur-md flex flex-col gap-4 text-xs"
            style={{
              borderColor: isDark ? "rgba(77, 141, 255, 0.18)" : "rgba(10, 16, 37, 0.12)",
              backgroundColor: isDark ? "rgba(10, 16, 37, 0.85)" : "rgba(255, 255, 255, 0.8)"
            }}
          >
            <h4 className="font-display font-black text-xs tracking-wider uppercase text-white border-b pb-2" style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)" }}>SEO Search and Social Share Previews</h4>
            
            {/* Google preview simulator */}
            <div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-mono block mb-2">Google SERP Index Snippet Preview</span>
              <div className="bg-black/45 p-4 rounded-lg border border-white/5 font-sans leading-relaxed text-left select-text max-w-full overflow-hidden">
                <div className="text-[12px] text-gray-400 font-mono tracking-wide truncate mb-0.5">
                  https://eurosia.com <span className="text-gray-500">&gt; #{selectedPagePath === "home" ? "" : selectedPagePath}</span>
                </div>
                <div className="text-[16px] text-[#8ab4f8] font-medium leading-snug hover:underline cursor-pointer truncate font-sans">
                  {pageForm.title || `Eurosia Defender X — Cyber Platform`}
                </div>
                <div className="text-[13px] text-gray-400 mt-1 line-clamp-2 max-h-[42px] leading-relaxed text-ellipsis overflow-hidden break-words font-sans selection:bg-indigo-600">
                  {pageForm.description || `Specialized cloud firewall shields, real-time threat intelligence and virtual security operations on modern infrastructure.`}
                </div>
              </div>
            </div>

            {/* Social Share Preview thumbnail */}
            <div className="border-t pt-3.5 mt-2 border-white/5">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-mono block mb-2">LinkedIn & Facebook Card Preview</span>
              <div className="bg-black/35 rounded-lg border border-white/5 overflow-hidden text-left flex flex-col">
                {pageForm.ogImage ? (
                  <img 
                    src={pageForm.ogImage} 
                    alt="Social Thumb" 
                    referrerPolicy="no-referrer"
                    className="w-full h-36 object-cover bg-black/60 focus:bg-indigo-950" 
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-24 bg-gradient-to-br from-indigo-950 to-blue-primary/30 flex items-center justify-center border-b border-white/5">
                    <Layout size={24} className="text-indigo-400 opacity-60" />
                  </div>
                )}
                <div className="p-3.5 flex flex-col gap-1 select-text">
                  <span className="text-[10px] text-gray-500 uppercase font-mono tracking-widest font-bold">EUROSIA.COM</span>
                  <span className="text-[13px] text-white font-bold tracking-tight line-clamp-1">{pageForm.ogTitle || pageForm.title || `Operational Defense State — live`}</span>
                  <span className="text-[11px] text-gray-400 leading-normal line-clamp-2">{pageForm.ogDescription || pageForm.description || `Specialized cloud defensive guards active.`}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Global Configuration settings module */}
          <form 
            onSubmit={handleSaveGlobal}
            className="border rounded-xl p-5 backdrop-blur-md flex flex-col gap-4 text-xs"
            style={{
              borderColor: isDark ? "rgba(77, 141, 255, 0.18)" : "rgba(10, 16, 37, 0.12)",
              backgroundColor: isDark ? "rgba(10, 16, 37, 0.85)" : "rgba(255, 255, 255, 0.8)"
            }}
          >
            <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)" }}>
              <div className="flex items-center gap-2">
                <Globe className="text-[#00C853]" size={16} />
                <span className="font-display font-black text-xs tracking-wider uppercase text-white">Global SEO Configuration</span>
              </div>
            </div>

            {/* Site Name and Tracking IDs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block mb-1 text-gray-500 font-bold uppercase text-[10px]">Global Site Name</label>
                <input 
                  type="text"
                  value={globalConfig?.siteName || ""}
                  onChange={(e) => setGlobalConfig(globalConfig ? { ...globalConfig, siteName: e.target.value } : null)}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-2.5 py-2 font-display text-white text-[11.5px]"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-gray-500 font-bold uppercase text-[10px]">Google Analytics ID (GA4)</label>
                <input 
                  type="text"
                  value={globalConfig?.googleAnalyticsId || ""}
                  onChange={(e) => setGlobalConfig(globalConfig ? { ...globalConfig, googleAnalyticsId: e.target.value } : null)}
                  placeholder="E.g., G-XXXXXXXXXX"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-2.5 py-2 font-mono text-white text-[11.5px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div>
                <label className="block mb-1 text-gray-500 font-bold uppercase text-[10px]">Google Console Verification Code</label>
                <input 
                  type="text"
                  value={globalConfig?.googleSearchConsoleVerification || ""}
                  onChange={(e) => setGlobalConfig(globalConfig ? { ...globalConfig, googleSearchConsoleVerification: e.target.value } : null)}
                  placeholder="google52378f8b668..."
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-2.5 py-2 font-mono text-white text-[11.5px]"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-500 font-bold uppercase text-[10px]">Bing Webmaster Verification</label>
                <input 
                  type="text"
                  value={globalConfig?.bingWebmasterVerification || ""}
                  onChange={(e) => setGlobalConfig(globalConfig ? { ...globalConfig, bingWebmasterVerification: e.target.value } : null)}
                  placeholder="BD7FAFF44BF799A..."
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-2.5 py-2 font-mono text-white text-[11.5px]"
                />
              </div>
            </div>

            {/* Social Media URL Management */}
            <div className="border-t pt-3.5 border-white/5 space-y-2.5">
              <span className="text-[10px ] text-indigo-400 font-bold uppercase tracking-wider block font-mono">SOCIAL PROFILES SETTINGS</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 animate-fade-in">
                <div>
                  <label className="block mb-1 text-gray-500 font-bold uppercase text-[9px]">Facebook Page</label>
                  <input 
                    type="text"
                    value={globalConfig?.facebookUrl || ""}
                    onChange={(e) => setGlobalConfig(globalConfig ? { ...globalConfig, facebookUrl: e.target.value } : null)}
                    placeholder="https://facebook.com/..."
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-2.5 py-2 font-mono text-white text-[11px]"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-500 font-bold uppercase text-[9px]">X / Twitter Profile</label>
                  <input 
                    type="text"
                    value={globalConfig?.twitterUrl || ""}
                    onChange={(e) => setGlobalConfig(globalConfig ? { ...globalConfig, twitterUrl: e.target.value } : null)}
                    placeholder="https://x.com/..."
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-2.5 py-2 font-mono text-white text-[11px]"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-500 font-bold uppercase text-[9px]">LinkedIn Company</label>
                  <input 
                    type="text"
                    value={globalConfig?.linkedinUrl || ""}
                    onChange={(e) => setGlobalConfig(globalConfig ? { ...globalConfig, linkedinUrl: e.target.value } : null)}
                    placeholder="https://linkedin.com/..."
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-2.5 py-2 font-mono text-white text-[11px]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-1 text-gray-500 font-bold uppercase text-[10px]">Configure robots.txt laws</label>
              <textarea 
                rows={3}
                value={globalConfig?.robotsTxt || ""}
                onChange={(e) => setGlobalConfig(globalConfig ? { ...globalConfig, robotsTxt: e.target.value } : null)}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-2.5 py-2 font-mono text-white leading-relaxed text-[11px]"
              />
            </div>

            <button 
              type="submit"
              disabled={isSavingGlobal}
              className="w-full font-display font-black tracking-wider text-dark rounded-lg py-2.5 bg-[#00C853] hover:bg-[#009624] transition-colors flex items-center justify-center gap-1 text-[11px] uppercase cursor-pointer"
            >
              {isSavingGlobal ? (
                <RefreshCw className="animate-spin" size={12} />
              ) : (
                <Save size={12} />
              )}
              Save Global Configurations
            </button>
          </form>

        </div>
      </div>

      {/* 4. REDIRECTS AND BROKEN LINK INDEXING MODULES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left component - Redirect Rules CRUD manager */}
        <div 
          className="lg:col-span-6 border rounded-xl p-5 backdrop-blur-md flex flex-col justify-between"
          style={{
            borderColor: isDark ? "rgba(77, 141, 255, 0.18)" : "rgba(10, 16, 37, 0.12)",
            backgroundColor: isDark ? "rgba(10, 16, 37, 0.85)" : "rgba(255, 255, 255, 0.8)"
          }}
        >
          <div>
            <h4 className="font-display font-black text-xs tracking-wider uppercase text-white border-b pb-3.5 mb-4" style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)" }}>Dynamic Redirect Manager (301/302)</h4>
            
            <form onSubmit={handleAddRedirect} className="flex gap-2 mb-4">
              <input 
                type="text"
                placeholder="Source, e.g. /old-services"
                value={newRedirect.sourcePath}
                onChange={(e) => setNewRedirect({ ...newRedirect, sourcePath: e.target.value })}
                className="flex-1 bg-black/30 border border-white/10 rounded px-2 py-1.5 font-mono text-[11px] focus:outline-none focus:border-accent-blue text-white"
              />
              <ArrowRight size={14} className="text-gray-500 self-center" />
              <input 
                type="text"
                placeholder="Target, e.g. /#services"
                value={newRedirect.targetPath}
                onChange={(e) => setNewRedirect({ ...newRedirect, targetPath: e.target.value })}
                className="flex-1 bg-black/30 border border-white/10 rounded px-2 py-1.5 font-mono text-[11px] focus:outline-none focus:border-accent-blue text-white"
              />
              <select 
                value={newRedirect.statusCode}
                onChange={(e) => setNewRedirect({ ...newRedirect, statusCode: Number(e.target.value) })}
                className="bg-black/30 text-white font-mono text-[11px] border border-white/10 rounded px-1 px-2.5 py-1.5"
              >
                <option value={301}>301 Permanent</option>
                <option value={302}>302 Temporary</option>
              </select>
              <button 
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3 rounded flex items-center justify-center cursor-pointer font-mono"
              >
                <PlusCircle size={14} />
              </button>
            </form>

            <div className="overflow-y-auto max-h-[160px] pr-1">
              {redirects.length === 0 ? (
                <div className="text-center py-8 text-gray-500 font-mono text-[11px]">Zero active redirect layers configured. Secure and direct default routes active.</div>
              ) : (
                <table className="w-full text-left font-mono text-[10.5px]">
                  <thead>
                    <tr className="border-b" style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                      <th className="py-2 text-gray-500 font-bold uppercase pb-1.5">SOURCE PATH</th>
                      <th className="py-2 text-gray-500 font-bold uppercase pb-1.5">TARGET</th>
                      <th className="py-2 text-gray-500 font-bold uppercase pb-1.5">CODE</th>
                      <th className="py-2 text-gray-500 font-bold uppercase pb-1.5 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}>
                    {redirects.map((rule) => (
                      <tr key={rule.id} className="hover:bg-white/5">
                        <td className="py-2 text-white truncate max-w-[120px] select-text">{rule.sourcePath}</td>
                        <td className="py-2 text-[#8ab4f8] truncate max-w-[120px] select-text">{rule.targetPath}</td>
                        <td className="py-2">
                          <span className={`px-1 rounded text-[9px] font-bold font-mono ${rule.statusCode === 301 ? "bg-green-alert/10 text-green-alert" : "bg-blue-primary/10 text-accent-blue"}`}>
                            {rule.statusCode}
                          </span>
                        </td>
                        <td className="py-2 text-right">
                          <button 
                            onClick={() => handleDeleteRedirect(rule.id)}
                            className="text-red-alert/50 hover:text-red-alert px-2.5 py-1 select-none transition-colors border border-transparent rounded bg-transparent cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right component - Crawler Broken links reporter */}
        <div 
          className="lg:col-span-6 border rounded-xl p-5 backdrop-blur-md flex flex-col justify-between"
          style={{
            borderColor: isDark ? "rgba(77, 141, 255, 0.18)" : "rgba(10, 16, 37, 0.12)",
            backgroundColor: isDark ? "rgba(10, 16, 37, 0.85)" : "rgba(255, 255, 255, 0.8)"
          }}
        >
          <div>
            <div className="flex justify-between items-center border-b pb-3.5 mb-4" style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)" }}>
              <h4 className="font-display font-black text-xs tracking-wider uppercase text-white">Active broken Link logs Tracker</h4>
              {brokenLinks.length > 0 && (
                <button 
                  onClick={handleClearBrokenLinks}
                  className="text-red-alert hover:text-white transition-colors text-[10px] uppercase font-mono tracking-wider font-extrabold"
                >
                  Clear Diagnostics Logs
                </button>
              )}
            </div>

            <div className="overflow-y-auto max-h-[210px] pr-1">
              {brokenLinks.length === 0 ? (
                <div className="text-center py-12 text-gray-500 font-mono text-[11px] flex flex-col items-center justify-center gap-2">
                  <CheckCircle size={20} className="text-[#00C853]" />
                  <span>Perfect. Zero outbound link routing alerts. Crawlers tracking index states are fully green.</span>
                </div>
              ) : (
                <table className="w-full text-left font-mono text-[10px]">
                  <thead>
                    <tr className="border-b" style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                      <th className="py-2 text-gray-500 font-bold uppercase pb-1.5">BROKEN URL TARGET</th>
                      <th className="py-2 text-gray-500 font-bold uppercase pb-1.5">REFERRER ADDRESS</th>
                      <th className="py-2 text-gray-500 font-bold uppercase pb-1.5">TIMESTAMP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y animate-pulse" style={{ borderColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", animationDuration: "6s" }}>
                    {brokenLinks.map((link) => (
                      <tr key={link.id} className="hover:bg-white/5">
                        <td className="py-2 text-red-alert truncate max-w-[150px] font-bold select-text">{link.url}</td>
                        <td className="py-2 text-gray-400 truncate max-w-[140px] select-text">{link.referrer}</td>
                        <td className="py-2 text-gray-500">{new Date(link.detectedAt).toISOString().replace("T", " ").substring(0, 19)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
