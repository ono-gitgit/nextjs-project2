import { createTask } from "@/app/lib/api";
import { formatDateToString } from "@/app/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      studyGoalId,
      task,
      field,
      priority,
      startDateYear,
      startDateMonth,
      startDateDay,
      deadlineYear,
      deadlineMonth,
      deadlineDay,
      memo,
      userId,
    } = await body;
    let startDate = null;
    let deadline = null;
    if (startDateYear != 0) {
      startDate = formatDateToString(
        new Date(startDateYear, startDateMonth, startDateDay)
      );
    }
    if (deadlineYear != 0) {
      deadline = formatDateToString(
        new Date(deadlineYear, deadlineMonth, deadlineDay)
      );
    }
    await createTask(
      studyGoalId,
      task,
      field,
      priority,
      startDate,
      deadline,
      userId,
      memo
    );
    return NextResponse.json(
      { message: "Task created successfully" },
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
