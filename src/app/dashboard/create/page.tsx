import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import CreateResumeForm from "./CreateResumeForm";

export default async function CreateResume() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard" className="text-blue-600 hover:underline mb-8 inline-block text-sm">&larr; Back to Dashboard</Link>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
          <h1 className="text-3xl font-extrabold mb-8 tracking-tight">Create New Portfolio</h1>
          <CreateResumeForm />
        </div>
      </div>
    </main>
  );
}