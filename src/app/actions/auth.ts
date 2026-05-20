// src/app/actions/auth.ts
"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password and save to NeonDB
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { 
      name, 
      email, 
      password: hashedPassword 
    }
  });

  // Redirect to login page after successful registration
  redirect("/login");
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // Use NextAuth to authenticate and create a session, then redirect to feed
  await signIn("credentials", {
    email,
    password,
    redirectTo: "/"
  });
}