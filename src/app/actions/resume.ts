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

  export async function updateResume(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const summary = formData.get("summary") as string;
  const content = formData.get("content") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const youtubeUrl = formData.get("youtubeUrl") as string;
  const isHighlighted = formData.get("isHighlighted") === "on";

  // Verify that this user actually owns the resume
  const existingResume = await prisma.resume.findUnique({ where: { id } });
  if (!existingResume || existingResume.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.resume.update({
    where: { id },
    data: {
      title,
      summary,
      content,
      imageUrl: imageUrl || null,
      youtubeUrl: youtubeUrl || null,
      isHighlighted,
    }
  });

  redirect("/dashboard");
}