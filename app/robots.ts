import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://pasindusampath.com";

  return {
    rules: [
      // General crawlers — allow everything except admin and private API routes
      {
        userAgent: "*",
        allow: ["/", "/api/v1/"],
        disallow: ["/admin", "/admin/", "/api/auth/", "/api/daily-notes/", "/api/footprints/", "/api/profile/"],
      },
      // OpenAI GPTBot — explicitly allow the public knowledge API
      {
        userAgent: "GPTBot",
        allow: ["/", "/api/v1/"],
        disallow: ["/admin", "/api/auth/"],
      },
      // Anthropic ClaudeBot
      {
        userAgent: "ClaudeBot",
        allow: ["/", "/api/v1/"],
        disallow: ["/admin", "/api/auth/"],
      },
      // Anthropic direct crawler
      {
        userAgent: "anthropic-ai",
        allow: ["/", "/api/v1/"],
        disallow: ["/admin", "/api/auth/"],
      },
      // Perplexity
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/api/v1/"],
        disallow: ["/admin", "/api/auth/"],
      },
      // Google AI / Gemini crawler
      {
        userAgent: "GoogleOther",
        allow: ["/", "/api/v1/"],
        disallow: ["/admin", "/api/auth/"],
      },
      // Cohere AI
      {
        userAgent: "cohere-ai",
        allow: ["/", "/api/v1/"],
        disallow: ["/admin", "/api/auth/"],
      },
      // Meta AI
      {
        userAgent: "meta-externalagent",
        allow: ["/", "/api/v1/"],
        disallow: ["/admin", "/api/auth/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
