"use client";

import { useEffect, useState, use } from "react";
import { 
  ArrowLeft, Loader2, Globe, Monitor, LayoutGrid, ExternalLink, 
  Download, MousePointerClick, CalendarDays, Webhook, TrendingUp 
} from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type AnalyticsData = {
  url: {
    originalUrl: string;
    clicks: number;
    createdAt: string;
    webhookUrl?: string;
    gaMeasurementId?: string;
    gaApiSecret?: string;
  };
  analytics: {
    totalClicks: number;
    referrers: { name: string; count: number }[];
    devices: { name: string; count: number }[];
    browsers: { name: string; count: number }[];
    timeline: { date: string; count: number }[];
  };
};

export default function AnalyticsPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`/api/analytics/${code}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Link not found");
          throw new Error("Failed to load analytics");
        }
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center text-center p-6 text-zinc-900 dark:text-zinc-100">
        <h1 className="text-3xl font-bold mb-4 tracking-tight">Oops!</h1>
        <p className="text-zinc-500 mb-8">{error}</p>
        <Link href="/" className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-medium shadow-sm hover:opacity-90 transition-opacity">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const { analytics, url } = data;
  const totalClicks = analytics.totalClicks || 1;

  const saveSettings = async (updates: any) => {
    try {
      const res = await fetch(`/api/analytics/${code}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      const updatedUrl = await res.json();
      setData(prev => prev ? { ...prev, url: updatedUrl } : null);
      alert("Settings saved successfully!");
    } catch (err) {
      alert("Error saving settings");
    }
  };

  const handleSetWebhook = () => {
    const current = url.webhookUrl || "";
    const input = prompt("Enter Webhook URL (leave blank to disable):", current);
    if (input === null) return;
    saveSettings({ webhookUrl: input });
  };

  const handleSetGA = () => {
    const currentId = url.gaMeasurementId || "";
    const inputId = prompt("Enter GA4 Measurement ID (e.g. G-XXXXXXX, leave blank to disable):", currentId);
    if (inputId === null) return;
    
    let inputSecret = "";
    if (inputId.trim() !== "") {
      const currentSecret = url.gaApiSecret || "";
      const secretResult = prompt("Enter GA4 API Secret:", currentSecret);
      if (secretResult === null) return;
      inputSecret = secretResult;
    }

    saveSettings({ gaMeasurementId: inputId, gaApiSecret: inputSecret });
  };

  // KPI Calculations
  const todayDateStr = new Date().toISOString().split('T')[0];
  const clicksToday = analytics.timeline.find(t => t.date === todayDateStr)?.count || 0;
  const topDevice = analytics.devices[0]?.name || "N/A";
  const topReferrer = analytics.referrers[0]?.name || "N/A";

  const ProgressBar = ({ label, count, icon: Icon }: { label: string, count: number, icon?: any }) => {
    const percentage = Math.round((count / totalClicks) * 100);
    return (
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center text-sm font-medium">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-zinc-500" />}
            <span>{label}</span>
          </div>
          <span className="text-zinc-500">{count} ({percentage}%)</span>
        </div>
        <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-zinc-900 dark:bg-zinc-200 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl shadow-lg">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-1">{label}</p>
          <p className="font-bold text-zinc-900 dark:text-zinc-100">
            {payload[0].value} Clicks
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800 font-sans pb-20 transition-colors duration-300">
      <header className="border-b border-zinc-200 dark:border-zinc-800/50 sticky top-0 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-semibold text-lg tracking-tight">Analytics Dashboard</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10 flex flex-col gap-8">
        
        {/* URL Overview */}
        <div className="flex flex-col gap-2">
          <p className="text-zinc-500 dark:text-zinc-400 text-sm uppercase tracking-wider font-semibold">Short Link Target</p>
          <a 
            href={url.originalUrl} 
            target="_blank" 
            rel="noreferrer"
            className="text-xl sm:text-2xl font-medium hover:underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-4 flex items-center gap-3 w-fit"
            title={url.originalUrl}
          >
            <span className="truncate max-w-[280px] sm:max-w-2xl">{url.originalUrl}</span>
            <ExternalLink className="w-5 h-5 text-zinc-400 shrink-0" />
          </a>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3 text-zinc-500">
              <MousePointerClick className="w-5 h-5" />
              <h3 className="font-medium text-sm">Total Clicks</h3>
            </div>
            <p className="text-3xl font-bold">{analytics.totalClicks.toLocaleString()}</p>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3 text-zinc-500">
              <CalendarDays className="w-5 h-5" />
              <h3 className="font-medium text-sm">Clicks Today</h3>
            </div>
            <p className="text-3xl font-bold">{clicksToday.toLocaleString()}</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3 text-zinc-500">
              <Monitor className="w-5 h-5" />
              <h3 className="font-medium text-sm">Top Device</h3>
            </div>
            <p className="text-3xl font-bold truncate">{topDevice}</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3 text-zinc-500">
              <Globe className="w-5 h-5" />
              <h3 className="font-medium text-sm">Top Source</h3>
            </div>
            <p className="text-3xl font-bold truncate">{topReferrer}</p>
          </div>
        </div>

        {/* Main Chart Section */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight">Clicks Over Time</h2>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            {analytics.timeline.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-zinc-500">
                Not enough data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.timeline} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#71717a" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#71717a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 12 }} 
                    dy={10} 
                    tickFormatter={(val) => {
                      const date = new Date(val);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#71717a', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#18181b" 
                    className="dark:stroke-zinc-300"
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        {/* Breakdown Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <Globe className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight">Referrers</h2>
            </div>
            {analytics.referrers.length === 0 ? (
              <p className="text-zinc-500">No data available.</p>
            ) : (
              <div className="flex flex-col gap-6">
                {analytics.referrers.map((ref) => (
                  <ProgressBar key={ref.name} label={ref.name} count={ref.count} />
                ))}
              </div>
            )}
          </section>

          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <Monitor className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight">Devices</h2>
            </div>
            {analytics.devices.length === 0 ? (
              <p className="text-zinc-500">No data available.</p>
            ) : (
              <div className="flex flex-col gap-6">
                {analytics.devices.map((dev) => (
                  <ProgressBar key={dev.name} label={dev.name} count={dev.count} />
                ))}
              </div>
            )}
          </section>

          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight">Browsers</h2>
            </div>
            {analytics.browsers.length === 0 ? (
              <p className="text-zinc-500">No data available.</p>
            ) : (
              <div className="flex flex-col gap-6">
                {analytics.browsers.map((browser) => (
                  <ProgressBar key={browser.name} label={browser.name} count={browser.count} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* External Connectors */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm mt-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <Webhook className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight">External Connectors</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a 
              href={`/api/analytics/${code}/export`}
              download
              className="flex flex-col gap-2 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg">Export to CSV</span>
                <Download className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
              </div>
              <p className="text-sm text-zinc-500">Download raw click data as a CSV file for manual analysis.</p>
            </a>
            
            <button onClick={handleSetWebhook} className="flex flex-col gap-2 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors text-left group">
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-lg">Webhooks</span>
                {url.webhookUrl ? (
                  <span className="text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500 px-2 py-1 rounded">Active</span>
                ) : (
                  <span className="text-xs font-medium bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">Setup</span>
                )}
              </div>
              <p className="text-sm text-zinc-500">Trigger external events in real-time on every click.</p>
            </button>
            
            <button onClick={handleSetGA} className="flex flex-col gap-2 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors text-left group">
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-lg">Google Analytics</span>
                {url.gaMeasurementId ? (
                  <span className="text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500 px-2 py-1 rounded">Active</span>
                ) : (
                  <span className="text-xs font-medium bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">Setup</span>
                )}
              </div>
              <p className="text-sm text-zinc-500">Sync URL clicks directly to your GA4 property.</p>
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}
