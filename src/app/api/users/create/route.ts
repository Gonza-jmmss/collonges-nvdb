import { NextRequest, NextResponse } from "next/server";
import { createUserCommand } from "@/repositories/users/commands/createUserCommand";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const suerCommand = new createUserCommand();
    const userCreated = await suerCommand.execute(body);

    return NextResponse.json(userCreated, { status: 200 });
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      { message: "Error creating role", error },
      { status: 500 },
    );
  }
}
