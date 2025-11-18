import { fetchStudyGoals } from "@/app/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = await body;
    const data = await fetchStudyGoals(userId);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch strudy goal" },
      { status: 500 }
    );
  }
}
