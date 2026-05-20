import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { sendMessage } from "@/app/actions/message";

export default async function ResumeViewer({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ sent?: string }> }) {
  const { id } = await params;
  const { sent } = await searchParams;
  const session = await auth();

  const resume = await prisma.resume.findUnique({
    where: { id: id },
    include: { user: true },
  });

  if (!resume) notFound();

  // Parse the custom sections back out of JSON
  let customSections = [];
  try {
    if (resume.content) customSections = JSON.parse(resume.content);
  } catch (e) {
    console.error("Content is not JSON");
  }

  // Safely extract Youtube video ID
  const getYoutubeId = (url: string) => {
    if (url.includes("watch?v=")) return url.split("watch?v=")[1].split("&")[0];
    if (url.includes("youtu.be/")) return url.split("youtu.be/")[1].split("?")[0];
    return null;
  };
  const videoId = resume.youtubeUrl ? getYoutubeId(resume.youtubeUrl) : null;

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm border border-neutral-200">
        <Link href="/" className="text-blue-600 hover:underline mb-8 inline-block text-sm">&larr; Back to Feed</Link>

        {sent && (
          <div className="mb-8 p-4 bg-green-50 text-green-800 rounded-md border border-green-200 text-sm font-medium">
            Message sent successfully to {resume.user.name}!
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-8 pb-8 border-b border-neutral-100">
          {resume.user.image ? (
            <img src={resume.user.image} alt={resume.user.name || "User"} className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 font-bold text-xl shrink-0">
              {resume.user.name?.charAt(0) || "U"}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">{resume.title}</h1>
            <p className="text-neutral-500 mt-1">{resume.user.name}</p>
          </div>

          {session?.user?.id && session.user.id !== resume.userId ? (
            <form action={sendMessage} className="flex flex-col sm:flex-row gap-2 shrink-0">
              <input type="hidden" name="receiverId" value={resume.userId} />
              <input type="hidden" name="resumeId" value={resume.id} />
              <input type="text" name="content" required placeholder="Type a message..." className="px-4 py-2 border border-neutral-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
              <button type="submit" className="px-6 py-2 bg-black text-white rounded-md hover:bg-neutral-800 transition-colors shadow-sm font-medium text-sm">
                Send
              </button>
            </form>
          ) : !session?.user?.id ? (
            <Link href="/login" className="px-6 py-2 bg-neutral-200 text-neutral-800 rounded-md hover:bg-neutral-300 transition-colors shadow-sm font-medium text-sm text-center">
              Log in to contact
            </Link>
          ) : null}
        </div>

        <div className="prose max-w-none">
          {resume.imageUrl && (
             <img src={resume.imageUrl} alt="Portfolio Cover" className="w-full h-64 md:h-96 rounded-xl shadow-sm mb-12 object-cover" />
          )}

          <h3 className="text-xl font-semibold mb-4 text-neutral-800">Professional Summary</h3>
          <p className="text-neutral-600 mb-12 leading-relaxed text-lg">{resume.summary}</p>
          
          {videoId && (
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4 text-neutral-800">Video Introduction</h3>
              <div className="relative w-full overflow-hidden" style={{ paddingTop: '56.25%' }}>
                <iframe 
                  className="absolute top-0 left-0 bottom-0 right-0 w-full h-full rounded-xl shadow-sm border border-neutral-200"
                  src={`https://www.youtube.com/embed/${videoId}`} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen>
                </iframe>
              </div>
            </div>
          )}

          {customSections.length > 0 && customSections.map((section: any, idx: number) => (
            section.title || section.content ? (
              <div key={idx} className="mb-8">
                <h3 className="text-xl font-semibold mb-3 text-neutral-800">{section.title}</h3>
                <p className="text-neutral-600 leading-relaxed whitespace-pre-wrap">{section.content}</p>
              </div>
            ) : null
          ))}
        </div>
      </div>
    </main>
  );
}