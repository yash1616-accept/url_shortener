"use client";

import { UserProfile, OrganizationProfile, useOrganization } from "@clerk/nextjs";
import { ArrowLeft, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { organization } = useOrganization();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800 font-sans pb-20 transition-colors duration-300">
      <header className="border-b border-zinc-200 dark:border-zinc-800/50 sticky top-0 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-zinc-500" />
              <span className="font-semibold text-lg tracking-tight">Settings</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10 flex flex-col xl:flex-row gap-10 items-start">
        {/* User Profile Component */}
        <div className="flex-1 w-full flex justify-center">
          <UserProfile 
            routing="hash"
            appearance={{
              elements: {
                rootBox: "w-full max-w-none shadow-sm rounded-2xl",
                card: "w-full shadow-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900",
                navbar: "hidden sm:flex",
              }
            }}
          />
        </div>

        {/* Organization Profile Component (Only visible if acting as an organization) */}
        {organization && (
          <div className="flex-1 w-full flex justify-center">
            <OrganizationProfile 
              routing="hash"
              appearance={{
                elements: {
                  rootBox: "w-full max-w-none shadow-sm rounded-2xl",
                  card: "w-full shadow-none border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900",
                  navbar: "hidden sm:flex",
                }
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
