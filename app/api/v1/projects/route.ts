// app/api/v1/projects/route.ts
// GET /api/v1/projects — Returns all projects (static seed + label enrichment)

import { NextResponse } from "next/server";
import { projects } from "@/lib/data/projects";
import type { ApiResponse, ProjectEntity } from "@/lib/types/entities";

export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour

export function GET() {
  const response: ApiResponse<ProjectEntity[]> = {
    version: "1.0",
    generated: new Date().toISOString(),
    entity: "Projects",
    canonicalUrl: "https://pasindusampath.com/projects",
    data: projects,
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
