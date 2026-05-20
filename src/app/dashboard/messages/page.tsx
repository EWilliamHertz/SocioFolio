import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Messages() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const messages = await prisma.message.findMany({
    where: { receiverId: session.user.id },
    include: { sender: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="flex items-center justify-between p-6 bg-white shadow-sm">
        <Link href="/" className="text-2xl font-bold tracking-tight text-neutral-800">PortfolioFeed</Link>
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">My Resumes</Link>
          <Link href="/dashboard/messages" className="text-sm font-medium text-neutral-900 border-b-2 border-black pb-1">Inbox</Link>
          <span className="text-neutral-300">|</span>
          <span className="text-sm text-neutral-600 hidden md:inline">Welcome, {session.user.name}</span>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-800">Sign Out</button>
          </form>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold mb-8">Inbox</h2>

        {messages.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-neutral-200 shadow-sm">
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No messages yet</h3>
            <p className="text-neutral-500">When recruiters or other talents reach out, their messages will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                <div className="flex items-center space-x-3 mb-4 border-b border-neutral-100 pb-4">
                  {msg.sender.image ? (
                    <img src={msg.sender.image} alt={msg.sender.name || "User"} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 font-bold text-xs">
                      {msg.sender.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm text-neutral-900">{msg.sender.name}</p>
                    <p className="text-xs text-neutral-500">{msg.sender.email} • {msg.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-neutral-700 whitespace-pre-wrap text-sm">{msg.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}