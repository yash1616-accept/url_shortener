"use client";

import { useState, useEffect } from "react";
import { Link2, Copy, Check, Loader2, ArrowRight, BarChart3, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";

type UrlData = {
  _id: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
};

export default function Dashboard() {
  const [urlInput, setUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState<UrlData[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentUrls();
  }, []);

  const fetchRecentUrls = async () => {
    try {
      const res = await fetch("/api/urls");
      if (res.ok) {
        const data = await res.json();
        setUrls(data);
      }
    } catch (err) {
      console.error("Failed to fetch URLs", err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: urlInput }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to shorten URL");
      }

      // Add to start of list if not already present
      setUrls((prev) => {
        const exists = prev.find((u) => u.shortCode === data.shortCode);
        if (exists) return prev;
        return [data, ...prev].slice(0, 10); // Keep max 10
      });
      
      setUrlInput("");
      
      // Auto-copy or show success state
      handleCopy(data.shortCode);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (shortCode: string) => {
    const shortUrl = `${window.location.origin}/${shortCode}`;
    navigator.clipboard.writeText(shortUrl);
    setCopiedCode(shortCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800 flex flex-col font-sans transition-colors duration-300">
      <header className="border-b border-zinc-200 dark:border-zinc-800/50 sticky top-0 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center">
              <Link2 className="w-5 h-5 text-white dark:text-zinc-900" />
            </div>
            <span className="font-semibold text-lg tracking-tight">MiniLink</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href="/settings" 
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Settings & Profile"
            >
              <SettingsIcon className="w-5 h-5" />
            </Link>
            <OrganizationSwitcher 
              hidePersonal={false} 
              appearance={{
                elements: {
                  organizationSwitcherTrigger: "text-green-700 bg-green-100 hover:bg-green-200 dark:text-green-400 dark:bg-green-900/30 dark:hover:bg-green-900/50 px-3 py-1.5 rounded-lg transition-colors font-medium",
                }
              }}
            />
            <UserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-9 h-9 shadow-sm border border-zinc-200 dark:border-zinc-700 hover:opacity-80 transition-opacity",
                }
              }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col gap-16">
        {/* Shortener Section */}
        <section className="flex flex-col items-center text-center space-y-6 pt-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Shorten your links. <br className="hidden sm:block" />
            <span className="text-zinc-500 dark:text-zinc-400">Expand your reach.</span>
          </h1>
          <p className="max-w-md text-zinc-500 dark:text-zinc-400 text-lg">
            A minimalist URL shortener built for speed and aesthetics. Create branded links in seconds.
          </p>

          <div className="w-full max-w-2xl mt-8">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="url"
                  placeholder="https://example.com/very/long/path"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full pl-5 pr-4 py-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-500 transition-all text-base placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="group flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-4 rounded-xl font-medium shadow-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Shorten <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
            {error && (
              <p className="text-red-500 text-sm mt-3 text-left pl-2">{error}</p>
            )}
          </div>
        </section>

        {/* Recent Links Section */}
        <section className="w-full pb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold tracking-tight">Recent Links</h2>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm">
            {fetching ? (
              <div className="p-10 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
              </div>
            ) : urls.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 dark:text-zinc-400 flex flex-col items-center">
                <Link2 className="w-8 h-8 mb-3 opacity-20" />
                <p>No links shortened yet. Try making one above!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50">
                      <th className="font-medium text-zinc-500 dark:text-zinc-400 py-4 px-6 text-sm">Destination</th>
                      <th className="font-medium text-zinc-500 dark:text-zinc-400 py-4 px-6 text-sm w-48">Short Link</th>
                      <th className="font-medium text-zinc-500 dark:text-zinc-400 py-4 px-6 text-sm w-24">Clicks</th>
                      <th className="font-medium text-zinc-500 dark:text-zinc-400 py-4 px-6 text-sm w-32">Analytics</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                    {urls.map((url) => {
                      const shortUrl = typeof window !== 'undefined' ? `${window.location.host}/${url.shortCode}` : `/${url.shortCode}`;
                      const isCopied = copiedCode === url.shortCode;

                      return (
                        <tr key={url._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                          <td className="py-4 px-6">
                            <a 
                              href={url.originalUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-zinc-900 dark:text-zinc-200 hover:underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-4 max-w-[200px] sm:max-w-sm truncate inline-block align-bottom"
                              title={url.originalUrl}
                            >
                              {url.originalUrl}
                            </a>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-blue-600 dark:text-blue-400">
                                {shortUrl}
                              </span>
                              <button
                                onClick={() => handleCopy(url.shortCode)}
                                className="p-1.5 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                aria-label="Copy link"
                              >
                                {isCopied ? (
                                  <Check className="w-4 h-4 text-green-600 dark:text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400">
                            {url.clicks?.toLocaleString() || 0}
                          </td>
                          <td className="py-4 px-6">
                            <Link 
                              href={`/analytics/${url.shortCode}`}
                              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                            >
                              <BarChart3 className="w-4 h-4" />
                              Stats
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
