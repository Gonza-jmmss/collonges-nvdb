"use server";

import { signIn, signOut } from "@/utils/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false, // don't redirect server-side
    });
    return undefined; // success, no error
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials";
        default:
          return "Something went wrong";
      }
    }
    throw error;
  }
}

export async function logout() {
  try {
    await signOut({ redirect: false });
    console.log("Logout success");
  } catch (error) {
    console.error("Logout failed:", error);
  }
  redirect("/login");
}
