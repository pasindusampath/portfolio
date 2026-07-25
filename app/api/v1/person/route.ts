// app/api/v1/person/route.ts
// GET /api/v1/person — Returns the canonical Person entity

import { NextResponse } from "next/server";
import { person } from "@/lib/data/person";
import type { ApiResponse, PersonEntity } from "@/lib/types/entities";

export const dynamic = "force-static";
export const revalidate = 86400; // 24 hours

export function GET() {
  const response: ApiResponse<PersonEntity> = {
    version: "1.0",
    generated: new Date().toISOString(),
    entity: "Person",
    canonicalUrl: "https://pasindusampath.com",
    data: {
      ...person,
      // Expose full biography tiers for AI retrieval
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
