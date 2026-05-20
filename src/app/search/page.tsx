import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function SearchResults({ searchParams }: { searchParams: Promise<{ q: string }> }) {
  // Read the "q" parameter from the URL
  const { q } = await searchParams;
  const query = q || "";
  
  // Search the database across Title, Summary, and Content (case-insensitive)
  const results = await prisma.resume.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { summary: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } }
      ]
    },
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="flex items-center justify-between p-6 bg-white shadow-sm">
        <Link href="/" className="text-2xl font-bold tracking-tight text-neutral-800">Sociofolio</Link>
        <form action="/search" className="hidden md:block relative">
          <input 
            type="text" 
            name="q" 
            defaultValue={query} 
            placeholder="Search talents, skills..." 
            className="w-64 pl-4 pr-10 py-2 text-sm bg-neutral-100 border-transparent rounded-full focus:bg-white focus:border-neutral-300 focus:ring-2 focus:ring-neutral-200 outline-none transition-all"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </form>
      </header>

      <div className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold mb-2">Search Results</h2>
        <p className="text-neutral-500 mb-8">Found {results.length} resumes for &quot;{query}&quot;</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.length === 0 ? (
            <p className="text-neutral-400 italic">No matches found. Try a different skill or keyword.</p>
          ) : (
            results.map((resume) => (
              <Link href={`/resume/${resume.id}`} key={resume.id} className="block bg-white p-6 rounded-lg shadow-sm border border-neutral-200 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex items-center space-x-4 mb-4">
                  {resume.user.image ? (
                    <img src={resume.user.image} alt={resume.user.name || "User"} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 font-bold">
                      {resume.user.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium group-hover:text-blue-600 transition-colors">{resume.title}</h4>
                    <p className="text-xs text-neutral-500">{resume.user.name}</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 line-clamp-3">{resume.summary}</p>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}