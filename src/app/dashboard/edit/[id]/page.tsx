import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import EditResumeForm from "./EditResumeForm";

export default async function EditResume({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  
  const { id } = await params;

  const resume = await prisma.resume.findUnique({
    where: { id }
  });

  if (!resume || resume.userId !== session.user.id) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="text-blue-600 hover:underline mb-8 inline-block text-sm">&larr; Back to Dashboard</Link>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
          <h1 className="text-3xl font-extrabold mb-8 tracking-tight">Edit Portfolio</h1>
          <EditResumeForm resume={resume} />
        </div>
      </div>
    </main>
  );
}