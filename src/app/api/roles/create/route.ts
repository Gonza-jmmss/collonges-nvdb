import { NextRequest, NextResponse } from "next/server";
import { createRoleCommand } from "@/repositories/roles/commands/createRoleCommand";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const command = new createRoleCommand();
    const createdRole = await command.execute(body);
    return NextResponse.json(createdRole, { status: 200 });
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      { message: "Error creating role", error },
      { status: 500 },
    );
  }
}
