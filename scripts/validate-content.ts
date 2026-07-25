#!/usr/bin/env tsx
// scripts/validate-content.ts
// Content governance validation — checks key SEO and AI metadata requirements
// Run: npm run validate
// Output: docs/audit/audit-report.md

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const DOCS_DIR = path.join(ROOT, "docs", "audit");

interface ValidationIssue {
  severity: "critical" | "warning" | "info";
  file: string;
  message: string;
}

const issues: ValidationIssue[] = [];

function report(severity: ValidationIssue["severity"], file: string, message: string) {
  issues.push({ severity, file, message });
  const icon = severity === "critical" ? "❌" : severity === "warning" ? "⚠️" : "ℹ️";
  console.log(`${icon} [${severity.toUpperCase()}] ${file}: ${message}`);
}

// ─── Validate robots.ts allows AI crawlers ───────────────

function validateRobots() {
  const robotsPath = path.join(ROOT, "app", "robots.ts");
  if (!fs.existsSync(robotsPath)) {
    report("critical", "app/robots.ts", "robots.ts does not exist");
    return;
  }
  const content = fs.readFileSync(robotsPath, "utf-8");
  const requiredBots = ["GPTBot", "ClaudeBot", "PerplexityBot", "GoogleOther", "anthropic-ai"];
  for (const bot of requiredBots) {
    if (!content.includes(bot)) {
      report("warning", "app/robots.ts", `AI crawler '${bot}' not explicitly allowed`);
    }
  }
  console.log("✅ robots.ts validated");
}

// ─── Validate llms.txt has API links ─────────────────────

function validateLlmsTxt() {
  const llmsPath = path.join(ROOT, "public", "llms.txt");
  if (!fs.existsSync(llmsPath)) {
    report("critical", "public/llms.txt", "llms.txt does not exist");
    return;
  }
  const content = fs.readFileSync(llmsPath, "utf-8");
  const required = ["/api/v1/person", "/api/v1/skills", "/api/v1/faq", "/api/v1/graph"];
  for (const endpoint of required) {
    if (!content.includes(endpoint)) {
      report("warning", "public/llms.txt", `Missing API reference: ${endpoint}`);
    }
  }
  console.log("✅ llms.txt validated");
}

// ─── Validate llms-full.txt has Key Facts ────────────────

function validateLlmsFullTxt() {
  const llmsFullPath = path.join(ROOT, "public", "llms-full.txt");
  if (!fs.existsSync(llmsFullPath)) {
    report("critical", "public/llms-full.txt", "llms-full.txt does not exist");
    return;
  }
  const content = fs.readFileSync(llmsFullPath, "utf-8");
  const required = ["Key Facts", "Frequently Asked Questions", "Machine-Readable", "/api/v1/person"];
  for (const section of required) {
    if (!content.includes(section)) {
      report("warning", "public/llms-full.txt", `Missing section: '${section}'`);
    }
  }
  console.log("✅ llms-full.txt validated");
}

// ─── Validate API v1 routes exist ────────────────────────

function validateApiRoutes() {
  const routes = ["person", "skills", "services", "projects", "faq", "graph"];
  for (const route of routes) {
    const routePath = path.join(ROOT, "app", "api", "v1", route, "route.ts");
    if (!fs.existsSync(routePath)) {
      report("critical", `app/api/v1/${route}/route.ts`, "API route file does not exist");
    } else {
      const content = fs.readFileSync(routePath, "utf-8");
      if (!content.includes("Cache-Control")) {
        report("warning", `app/api/v1/${route}/route.ts`, "Missing Cache-Control header");
      }
      if (!content.includes("Access-Control-Allow-Origin")) {
        report("warning", `app/api/v1/${route}/route.ts`, "Missing CORS header (Access-Control-Allow-Origin)");
      }
    }
  }
  console.log("✅ API v1 routes validated");
}

// ─── Validate data files exist ───────────────────────────

function validateDataFiles() {
  const dataFiles = [
    "lib/data/person.ts",
    "lib/data/technologies.ts",
    "lib/data/services.ts",
    "lib/data/faqs.ts",
    "lib/data/projects.ts",
    "lib/data/graph.ts",
    "lib/types/entities.ts",
    "lib/schema/generate-schema.ts",
  ];
  for (const file of dataFiles) {
    const filePath = path.join(ROOT, file);
    if (!fs.existsSync(filePath)) {
      report("critical", file, "Required file does not exist");
    }
  }
  console.log("✅ Data files validated");
}

// ─── Validate layout.tsx has all JSON-LD ─────────────────

function validateLayout() {
  const layoutPath = path.join(ROOT, "app", "layout.tsx");
  if (!fs.existsSync(layoutPath)) {
    report("critical", "app/layout.tsx", "Root layout does not exist");
    return;
  }
  const content = fs.readFileSync(layoutPath, "utf-8");
  const required = ["PersonJsonLd", "WebSiteJsonLd", "OrganizationJsonLd", "FAQJsonLd"];
  for (const component of required) {
    if (!content.includes(component)) {
      report("warning", "app/layout.tsx", `Missing JSON-LD component: <${component} />`);
    }
  }
  console.log("✅ Root layout validated");
}

// ─── Validate sitemap includes API routes ────────────────

function validateSitemap() {
  const sitemapPath = path.join(ROOT, "app", "sitemap.ts");
  if (!fs.existsSync(sitemapPath)) {
    report("critical", "app/sitemap.ts", "sitemap.ts does not exist");
    return;
  }
  const content = fs.readFileSync(sitemapPath, "utf-8");
  const required = ["/api/v1/person", "/api/v1/faq", "/api/v1/graph"];
  for (const endpoint of required) {
    if (!content.includes(endpoint)) {
      report("warning", "app/sitemap.ts", `API endpoint missing from sitemap: ${endpoint}`);
    }
  }
  console.log("✅ sitemap.ts validated");
}

// ─── Generate audit report ────────────────────────────────

function generateReport() {
  const critical = issues.filter((i) => i.severity === "critical");
  const warnings = issues.filter((i) => i.severity === "warning");
  const infos = issues.filter((i) => i.severity === "info");

  const reportContent = `# Content Governance Audit Report

**Generated:** ${new Date().toISOString()}  
**Total Issues:** ${issues.length} (${critical.length} critical, ${warnings.length} warnings, ${infos.length} info)

---

## Summary

| Severity | Count |
|---|---|
| ❌ Critical | ${critical.length} |
| ⚠️ Warning | ${warnings.length} |
| ℹ️ Info | ${infos.length} |

${critical.length === 0 ? "✅ **No critical issues found.**" : "❌ **Critical issues require immediate attention.**"}

---

## Issues

${issues.length === 0 ? "_No issues found. All checks passed._" : issues.map(
  (issue) => `### ${issue.severity === "critical" ? "❌" : issue.severity === "warning" ? "⚠️" : "ℹ️"} ${issue.file}\n**${issue.severity.toUpperCase()}**: ${issue.message}`
).join("\n\n")}

---

## Checks Performed

- ✅ robots.ts allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot, GoogleOther, anthropic-ai)
- ✅ llms.txt has machine-readable API links
- ✅ llms-full.txt has Key Facts and FAQ sections
- ✅ All /api/v1/* route files exist
- ✅ All required data files exist
- ✅ Root layout has all JSON-LD components
- ✅ sitemap.ts includes API discovery endpoints

---

*Run again with \`npm run validate\`*
`;

  fs.mkdirSync(DOCS_DIR, { recursive: true });
  const reportPath = path.join(DOCS_DIR, "audit-report.md");
  fs.writeFileSync(reportPath, reportContent);
  console.log(`\n📄 Report saved to: docs/audit/audit-report.md`);
}

// ─── Run all checks ───────────────────────────────────────

console.log("\n🔍 Running content governance validation...\n");

validateRobots();
validateLlmsTxt();
validateLlmsFullTxt();
validateApiRoutes();
validateDataFiles();
validateLayout();
validateSitemap();

generateReport();

const criticalCount = issues.filter((i) => i.severity === "critical").length;
console.log(`\n${criticalCount === 0 ? "✅ All checks passed!" : `❌ ${criticalCount} critical issue(s) found.`}`);

if (criticalCount > 0) {
  process.exit(1);
}
