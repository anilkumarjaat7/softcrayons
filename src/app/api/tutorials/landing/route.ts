import { NextResponse } from "next/server";
import { getPublicTutorialLanding } from "@/services/tutorial-public.service";

export async function GET() {
  try {
    const data = await getPublicTutorialLanding();

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
        error: error?.message || "Failed to fetch tutorial landing data",
      },
      { status: 500 },
    );
  }
}
