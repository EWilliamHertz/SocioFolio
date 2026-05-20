"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const language = formData.get("language") as string;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { 
      name, 
      image: imageUrl || null, 
      language 
    },
  });

  redirect("/dashboard");
}