// src/app/dashboard/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Dashboard() {
  // Check if user is logged in
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch the current user's resumes
  const userResumes = await prisma.resume.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="flex items-center justify-between p-6 bg-white shadow-sm">
        <Link href="/" className="text-2xl font-bold tracking-tight text-neutral-800">Sociofolio</Link>
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="text-sm font-medium text-neutral-900 border-b-2 border-black pb-1">My Resumes</Link>
          <Link href="/dashboard/messages" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">Inbox</Link>
          <Link href="/dashboard/settings" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">Settings</Link>
          <span className="text-neutral-300">|</span>
          <span className="text-sm text-neutral-600 hidden md:inline">Welcome, {session.user.name}</span>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-800">Sign Out</button>
          </form>
        </div>
      </header>

      <div className="max-w-5xl mx-auto py-12 px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">My Resumes</h2>
          <Link href="/dashboard/create" className="px-4 py-2 bg-black text-white rounded-md hover:bg-neutral-800 transition-colors text-sm font-medium">
            + Create New Resume
          </Link>
        </div>

        {userResumes.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-neutral-200 shadow-sm">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">You haven't created any resumes yet</h3>
            <p className="text-neutral-500 mb-6">Build your first portfolio piece to start attracting recruiters.</p>
            <Link href="/dashboard/create" className="px-6 py-2 bg-black text-white rounded-md hover:bg-neutral-800 transition-colors font-medium inline-block">
              Create Resume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userResumes.map((resume) => (
              <div key={resume.id} className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 flex flex-col justify-between h-48">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">{resume.title}</h4>
                    {resume.isHighlighted && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">Highlighted</span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 line-clamp-2">{resume.summary}</p>
                </div>
                <div className="flex space-x-3 mt-4 pt-4 border-t border-neutral-100">
                  <Link href={`/resume/${resume.id}`} className="text-sm text-blue-600 hover:underline font-medium">View</Link>
                  <Link href={`/dashboard/edit/${resume.id}`} className="text-sm text-neutral-600 hover:text-neutral-900 font-medium">Edit</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}