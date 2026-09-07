import { Link2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function LandingPage() {
  const { userId } = await auth();
  const isSignedIn = !!userId;
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800/50 sticky top-0 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center">
              <Link2 className="w-5 h-5 text-white dark:text-zinc-900" />
            </div>
            <span className="font-semibold text-lg tracking-tight">MiniLink</span>
          </div>
          <div className="flex items-center gap-4">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                    Log in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-lg shadow-sm hover:opacity-90 transition-opacity">
                    Sign up
                  </button>
                </SignUpButton>
              </>
            ) : (
              <Link 
                href="/dashboard"
                className="text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-2 rounded-lg shadow-sm hover:opacity-90 transition-opacity"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium mb-8">
          <span className="flex w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Now supporting Business Workspaces
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight max-w-3xl mb-6">
          Shorten your links. <br />
          <span className="text-zinc-500 dark:text-zinc-400">Expand your reach.</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mb-10">
          The minimalist URL shortener built for speed, aesthetics, and serious teams. Create branded links in seconds and track powerful click analytics.
        </p>

        {!isSignedIn ? (
            <SignUpButton mode="modal">
              <button className="group flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-4 rounded-xl font-medium shadow-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98] text-lg">
                Get Started for Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </SignUpButton>
        ) : (
          <Link href="/dashboard" className="group flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-4 rounded-xl font-medium shadow-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98] text-lg">
            Enter Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </main>
    </div>
  );
}
