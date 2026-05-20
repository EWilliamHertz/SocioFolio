"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function createResume(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const content = formData.get("content") as string; // Will hold our JSON sections
  const imageUrl = formData.get("imageUrl") as string;
  const youtubeUrl = formData.get("youtubeUrl") as string;
  const isHighlighted = formData.get("isHighlighted") === "on";

  await prisma.resume.create({
    data: {
      title,
      summary,
      content,
      imageUrl,
      youtubeUrl,
      isHighlighted,
      userId: session.user.id,
    }
  });

  redirect("/dashboard");
}