import { NextRequest, NextResponse } from "next/server";
import { userExists } from "@/lib/userExist";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const exists = await userExists(email);

    return NextResponse.json({ exists });
  } catch (error) {
    console.error("Error checking user existence:", error);
    return NextResponse.json(
      { error: "Failed to check user" },
      { status: 500 }
    );
  }
}
