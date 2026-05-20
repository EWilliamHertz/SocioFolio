import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-8xl font-extrabold text-neutral-900 mb-4 tracking-tighter">404</h1>
      <h2 className="text-3xl font-bold text-neutral-800 mb-6">Page Not Found</h2>
      <p className="text-lg text-neutral-500 max-w-md mx-auto mb-10">
        We couldn't find the page or portfolio you were looking for. It might have been deleted, or the link might be incorrect.
      </p>
      <Link href="/" className="px-8 py-3 bg-black text-white rounded-md hover:bg-neutral-800 font-bold transition-colors shadow-sm">
        Return to the Feed
      </Link>
    </main>
  );
}