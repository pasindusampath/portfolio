// app/api/v1/faq/route.ts
// GET /api/v1/faq — Returns all FAQs, optionally filtered by page
// Query: ?page=/about

import { NextResponse, type NextRequest } from "next/server";
import { faqEntity, faqItems } from "@/lib/data/faqs";
import type { ApiResponse, FAQEntity, FAQItem } from "@/lib/types/entities";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

export function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageFilter = searchParams.get("page");

  const filteredItems: FAQItem[] = pageFilter
    ? faqItems.filter((faq) => faq.appliesTo.includes(pageFilter))
    : faqItems;

  const response: ApiResponse<FAQEntity> = {
    version: "1.0",
    generated: new Date().toISOString(),
    entity: "FAQ",
    canonicalUrl: "https://pasindusampath.com",
    data: {
      ...faqEntity,
      items: filteredItems,
    },
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
