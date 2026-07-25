// app/api/v1/services/route.ts
// GET /api/v1/services — Returns all services offered

import { NextResponse } from "next/server";
import { services } from "@/lib/data/services";
import type { ApiResponse, ServiceEntity } from "@/lib/types/entities";

export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  const response: ApiResponse<ServiceEntity[]> = {
    version: "1.0",
    generated: new Date().toISOString(),
    entity: "Services",
    canonicalUrl: "https://pasindusampath.com/contact",
    data: services,
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
