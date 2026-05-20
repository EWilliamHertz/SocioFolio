import Link from "next/link";
import { loginUser } from "@/app/actions/auth";

export default function Login() {
  return (
    <main className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="text-center block text-2xl font-bold tracking-tight text-neutral-800 mb-6">
          Sociofolio
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-neutral-900">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Or <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">register for a new account</Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 border border-neutral-200">
          <form className="space-y-6" action={loginUser}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700">Email address</label>
              <div className="mt-1">
                <input id="email" name="email" type="email" required className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">Password</label>
              <div className="mt-1">
                <input id="password" name="password" type="password" required className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">Forgot your password?</a>
              </div>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 transition-colors">
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}