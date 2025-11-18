import { NextRequest, NextResponse } from "next/server";
import { fetchUser } from "@/app/lib/api";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const user = await fetchUser(email, password);
    if (!user) {
      return NextResponse.json([]);
    }
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
