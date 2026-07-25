// app/api/v1/skills/route.ts
// GET /api/v1/skills — Returns skills grouped by category

import { NextResponse } from "next/server";
import { person } from "@/lib/data/person";
import type { ApiResponse, SkillCategory } from "@/lib/types/entities";

export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  const response: ApiResponse<SkillCategory[]> = {
    version: "1.0",
    generated: new Date().toISOString(),
    entity: "Skills",
    canonicalUrl: "https://pasindusampath.com",
    data: person.skills,
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
