import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createUser } from "@/app/lib/api";

export async function POST(req: NextRequest) {
  try {
    const { userName, email, password } = await req.json();
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    await createUser(userName, email, passwordHash);
    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
