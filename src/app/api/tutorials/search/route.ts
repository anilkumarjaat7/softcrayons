import { NextRequest, NextResponse } from "next/server";
import { getPublicTutorialSearch } from "@/services/tutorial-public.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = (searchParams.get("q") || "").trim();
    const limitParam = parseInt(searchParams.get("limit") || "8", 10);
    const limit = Math.min(Math.max(limitParam, 1), 25);

    if (query.length < 2) {
      return NextResponse.json({
        success: true,
        data: { topics: [], lessons: [] },
        message: "Search query must be at least 2 characters",
      });
    }

    const data = await getPublicTutorialSearch(query, limit);

    return NextResponse.json({
      success: true,
      data,
      query,
      total: data.topics.length + data.lessons.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to search tutorials",
      },
      { status: 500 },
    );
  }
}
