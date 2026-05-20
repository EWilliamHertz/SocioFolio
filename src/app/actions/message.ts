// src/app/actions/message.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function sendMessage(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const receiverId = formData.get("receiverId") as string;
  const content = formData.get("content") as string;
  const resumeId = formData.get("resumeId") as string;

  if (!receiverId || !content) return;

  await prisma.message.create({
    data: {
      content,
      senderId: session.user.id,
      receiverId,
    }
  });

  redirect(`/resume/${resumeId}?sent=true`);
}