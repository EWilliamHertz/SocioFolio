import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="flex items-center justify-between p-6 bg-white shadow-sm">
        <Link href="/" className="text-2xl font-bold tracking-tight text-neutral-800">Sociofolio</Link>
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">My Resumes</Link>
          <Link href="/dashboard/messages" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">Inbox</Link>
          <Link href="/dashboard/settings" className="text-sm font-medium text-neutral-900 border-b-2 border-black pb-1">Settings</Link>
          <span className="text-neutral-300">|</span>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-800">Sign Out</button>
          </form>
        </div>
      </header>

      <div className="max-w-3xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-extrabold mb-8 tracking-tight">Account Settings</h2>
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200">
          <SettingsForm user={user} />
        </div>
      </div>
    </main>
  );
}