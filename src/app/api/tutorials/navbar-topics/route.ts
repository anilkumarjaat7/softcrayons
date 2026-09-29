import { NextRequest, NextResponse } from "next/server";
import { getPublicTutorialNavbarTopics } from "@/services/tutorial-public.service";

export async function GET(request: NextRequest) {
  try {
    const limitParam = parseInt(request.nextUrl.searchParams.get("limit") || "4", 10);
    const limit = Math.min(Math.max(limitParam, 1), 8);
    const data = await getPublicTutorialNavbarTopics(limit);

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to fetch tutorial navbar topics",
      },
      { status: 500 },
    );
  }
}
