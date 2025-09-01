"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

import { db } from "@/db";
import { users } from "@/db/schema/auth";
import { signIn } from "@/lib/auth";

type FormState = { error: string } | undefined;

export async function loginUser(
  _: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    await signIn("credentials", formData);
    redirect("/");
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "Something went wrong. Please try again." };
      }
    }
    throw error;
  }
}

export async function registerUser(
  _: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    await db.insert(users).values({
      name,
      email,
      hashedPassword,
    });
  } catch {
    return { error: "User with this email already exists." };
  }

  redirect("/login");
}
