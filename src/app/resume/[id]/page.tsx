import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ResumeViewer({ params }: { params: Promise<{ id: string }> }) {
  // Await the dynamic URL params (required in newer Next.js versions)
  const { id } = await params;

  // Fetch the specific resume organically
  const resume = await prisma.resume.findUnique({
    where: { id: id },
    include: { user: true },
  });

  if (!resume) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm border border-neutral-200">
        <Link href="/" className="text-blue-600 hover:underline mb-8 inline-block text-sm">&larr; Back to Feed</Link>
        
        <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-neutral-100">
          {resume.user.image ? (
            <img src={resume.user.image} alt={resume.user.name || "User"} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 font-bold text-xl">
              {resume.user.name?.charAt(0) || "U"}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{resume.title}</h1>
            <p className="text-neutral-500 mt-1">{resume.user.name}</p>
          </div>
          <button className="px-6 py-2 bg-black text-white rounded-md hover:bg-neutral-800 transition-colors shadow-sm font-medium">
            Contact Talent
          </button>
        </div>

        <div className="prose max-w-none">
          <h3 className="text-xl font-semibold mb-4 text-neutral-800">Professional Summary</h3>
          <p className="text-neutral-600 mb-8 leading-relaxed">{resume.summary}</p>
          
          {resume.content && (
            <>
              <h3 className="text-xl font-semibold mb-4 text-neutral-800">Experience & Details</h3>
              <div className="text-neutral-600 leading-relaxed whitespace-pre-wrap">
                {resume.content}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}