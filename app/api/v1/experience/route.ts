// app/api/v1/experience/route.ts
// GET /api/v1/experience — Returns work experience history

import { NextResponse } from "next/server";
import { person } from "@/lib/data/person";
import type { ApiResponse, WorkExperience } from "@/lib/types/entities";

export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  const response: ApiResponse<WorkExperience[]> = {
    version: "1.0",
    generated: new Date().toISOString(),
    entity: "WorkExperience",
    canonicalUrl: "https://pasindusampath.com/about",
    data: person.workExperiences,
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
