import { NextRequest, NextResponse } from "next/server";
import { updateRoleCommand } from "@/repositories/roles/commands/updateRoleCommand";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const command = new updateRoleCommand();
    const updatedRole = await command.execute(body);
    return NextResponse.json(updatedRole, { status: 200 });
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { message: "Error updating role", error },
      { status: 500 },
    );
  }
}
