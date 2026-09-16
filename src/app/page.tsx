"use client";

import { motion, Variants } from "framer-motion";
import { Link2, ArrowRight, Zap, BarChart3, Shield, Webhook, Download, LineChart, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-50 overflow-hidden selection:bg-zinc-200 dark:selection:bg-zinc-800 font-sans">
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 bg-grid-black dark:bg-grid-white [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] -z-10 pointer-events-none" />
      <div className="glow-orb top-[-100px] left-[50%] translate-x-[-50%] dark:block hidden" />

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-[#09090b]/60 backdrop-blur-xl"
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-black/10 dark:shadow-white/10">
              <Link2 className="w-5 h-5 text-white dark:text-[#09090b]" />
            </div>
            <span className="font-bold text-xl tracking-tight">Brua</span>
          </div>
          
          <div className="flex items-center gap-4">
            {isLoaded && !isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                    Log in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-[#09090b] px-4 py-2 rounded-lg shadow-sm hover:scale-105 transition-transform">
                    Sign up
                  </button>
                </SignUpButton>
              </>
            ) : isLoaded && isSignedIn ? (
              <Link 
                href="/dashboard"
                className="text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-[#09090b] px-4 py-2 rounded-lg shadow-sm hover:scale-105 transition-transform"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="w-20 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center z-10"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-sm font-medium mb-8 backdrop-blur-sm shadow-sm">
            <span className="flex w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-zinc-600 dark:text-zinc-300">Introducing Workspaces 2.0</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl sm:text-7xl font-extrabold tracking-tight max-w-4xl mb-8 leading-[1.1]">
            Shorten your links. <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-900 dark:from-zinc-300 dark:to-zinc-600">
              Expand your reach.
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-12">
            The minimalist URL shortener built for speed, aesthetics, and serious teams. Create branded links in seconds and track powerful click analytics globally.
          </motion.p>

          <motion.div variants={itemVariants}>
            {isLoaded && !isSignedIn ? (
              <SignUpButton mode="modal">
                <button className="group relative flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-[#09090b] px-8 py-4 rounded-2xl font-semibold shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-105 transition-all text-lg overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    Start Building Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-black/10 -translate-x-[150%] group-hover:animate-[shimmer_1.5s_infinite]" />
                </button>
              </SignUpButton>
            ) : isLoaded && isSignedIn ? (
              <Link href="/dashboard" className="group relative flex items-center justify-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-[#09090b] px-8 py-4 rounded-2xl font-semibold shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:scale-105 transition-all text-lg overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Enter Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ) : (
              <div className="w-48 h-14 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            )}
          </motion.div>
        </motion.div>

        {/* Dashboard Mockup Section */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 w-full max-w-5xl mx-auto relative z-20"
        >
          <div className="relative rounded-2xl md:rounded-[2rem] border border-zinc-200/50 dark:border-white/10 bg-white/40 dark:bg-[#09090b]/40 backdrop-blur-2xl shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
            
            {/* macOS Window Header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-200/50 dark:border-white/10 bg-zinc-50/50 dark:bg-black/20">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400 dark:bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500/80" />
              </div>
            </div>
            
            {/* Mockup Body */}
            <div className="p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="md:col-span-2 space-y-4">
                <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-zinc-800 dark:text-zinc-200">brua.link/campaign</div>
                    <div className="text-sm text-zinc-400">https://your-very-long-url.com/marketing/summer...</div>
                  </div>
                  <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">Active</div>
                </div>
                <div className="h-32 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 flex items-end p-4 gap-2">
                  {[40, 70, 45, 90, 65, 100, 80].map((height, i) => (
                    <div key={i} className="flex-1 bg-blue-500/20 dark:bg-blue-500/40 rounded-t-sm" style={{ height: `${height}%` }}>
                      <div className="w-full bg-blue-500 rounded-t-sm" style={{ height: '4px' }} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5">
                  <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Total Clicks</div>
                  <div className="text-3xl font-bold dark:text-white">12,492</div>
                  <div className="text-xs text-green-500 mt-2 flex items-center gap-1">
                    <LineChart className="w-3 h-3" /> +14.5% this week
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5">
                  <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">Top Locations</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="dark:text-zinc-300">🇺🇸 United States</span><span className="dark:text-zinc-400">45%</span></div>
                    <div className="flex justify-between text-sm"><span className="dark:text-zinc-300">🇬🇧 United Kingdom</span><span className="dark:text-zinc-400">22%</span></div>
                    <div className="flex justify-between text-sm"><span className="dark:text-zinc-300">🇩🇪 Germany</span><span className="dark:text-zinc-400">18%</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mt-40 w-full"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">How it works</h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">Three simple steps to transform your links into powerful marketing assets.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent -z-10" />
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-zinc-300 dark:text-zinc-700">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-zinc-100">Shorten</h3>
              <p className="text-zinc-500 dark:text-zinc-400">Paste your long, messy URL into the dashboard to generate a clean, branded short link.</p>
            </div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-zinc-300 dark:text-zinc-700">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-zinc-100">Share</h3>
              <p className="text-zinc-500 dark:text-zinc-400">Distribute your short link across social media, email campaigns, or SMS messages.</p>
            </div>
            
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-[#121214] border border-zinc-200 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-zinc-300 dark:text-zinc-700">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-zinc-100">Track</h3>
              <p className="text-zinc-500 dark:text-zinc-400">Monitor real-time analytics, geolocation data, and device metrics as users click.</p>
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mt-40 w-full"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Everything you need</h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">A complete toolkit for managing and tracking your links at scale.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-amber-500" />}
              title="Lightning Fast"
              description="Powered by Upstash Redis edge caching. Redirects happen in milliseconds globally."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-6 h-6 text-blue-500" />}
              title="Deep Analytics"
              description="Track referrers, devices, and global geographic data with zero performance penalty."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-green-500" />}
              title="Enterprise Security"
              description="Multi-tenant architecture powered by Clerk. Isolate your data securely."
            />
            <FeatureCard 
              icon={<Webhook className="w-6 h-6 text-purple-500" />}
              title="Real-time Webhooks"
              description="Fire POST requests to your own servers the exact millisecond a link is clicked."
            />
            <FeatureCard 
              icon={<LineChart className="w-6 h-6 text-orange-500" />}
              title="GA4 Integration"
              description="Seamlessly sync your click data directly into Google Analytics 4."
            />
            <FeatureCard 
              icon={<Download className="w-6 h-6 text-cyan-500" />}
              title="Data Export"
              description="Own your data. Export comprehensive CSV reports of all your click analytics."
            />
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/50 py-12 text-center mt-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6 opacity-50 grayscale">
            <Link2 className="w-5 h-5 dark:text-white" />
            <span className="font-bold tracking-tight dark:text-white">Brua</span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-500 text-sm">
            © {new Date().getFullYear()} Brua. All rights reserved.
          </p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(150%); }
        }
      `}</style>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group relative p-8 rounded-3xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-left overflow-hidden hover:border-zinc-300 dark:hover:border-white/20 transition-colors shadow-sm dark:shadow-none">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-black/50 border border-zinc-200 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 dark:text-zinc-100">{title}</h3>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
