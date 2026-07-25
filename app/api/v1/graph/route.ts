// app/api/v1/graph/route.ts
// GET /api/v1/graph — Returns the full knowledge graph

import { NextResponse } from "next/server";
import { knowledgeGraph } from "@/lib/data/graph";
import type { ApiResponse, KnowledgeGraph } from "@/lib/types/entities";

export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  const response: ApiResponse<KnowledgeGraph> = {
    version: "1.0",
    generated: new Date().toISOString(),
    entity: "KnowledgeGraph",
    canonicalUrl: "https://pasindusampath.com",
    data: {
      ...knowledgeGraph,
      generated: new Date().toISOString(),
    },
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=86400",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
