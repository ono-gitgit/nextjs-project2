import { createStudyGoal } from "@/app/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { goal, year, month, day, userId } = await body;
    const data = await createStudyGoal(goal, year, month, day, userId);
    return NextResponse.json(
      { message: "Goal created successfully", data },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    );
  }
}
