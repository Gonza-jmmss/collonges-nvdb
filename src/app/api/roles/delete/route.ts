import { NextRequest, NextResponse } from "next/server";
import { deleteRoleCommand } from "@/repositories/roles/commands/deleteRoleCommand";

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const command = new deleteRoleCommand();
    const deletedRole = await command.execute(body);
    return NextResponse.json(deletedRole, { status: 200 });
  } catch (error) {
    console.error("Error deleting role:", error);
    return NextResponse.json(
      { message: "Error deleting role", error },
      { status: 500 },
    );
  }
}
