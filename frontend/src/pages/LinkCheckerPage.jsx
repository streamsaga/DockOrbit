import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import DashboardSidebar from "../components/DashboardSidebar.jsx";
import Footer from "../components/Footer.jsx";
import TrustRing from "../components/TrustRing.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import AuthModal from "../components/AuthModal.jsx";

function formatCount(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n || 0);
}

export default function LinkCheckerPage() {
  const { user, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [url, setUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState({
    type: "channel",
    data: {
      id: "demo123",
      name: "TechOrbit Daily",
      handle: "@techorbitdaily",
      category: "Technology",
      subscribers: 1200000,
      totalViews: 45000000,
      avgViewsPerVideo: 150000,
      uploadsLast30Days: 8,
      videoCount: 340,
      trustScore: 87,
      country: "US",
      description: "Our proprietary model indicates this channel is highly authoritative with exceptionally strong audience retention and organic growth signals.",
      scoreBreakdown: {
        engagement: 94,
        consistency: 72,
        longevity: 88,
        activity: 45,
        audience: 91,
      },
    },
  });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/lookup?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setResult(data);
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const scoreData = result?.data?.scoreBreakdown || {
    engagement: 94,
    consistency: 72,
    longevity: 88,
    activity: 45,
    audience: 91,
  };

  return (
    <div className="app-shell flex flex-col md:flex-row min-h-screen bg-background text-on-background antialiased">
      <DashboardSidebar
        user={user}
        onLoginClick={() => setShowAuth(true)}
        onLogout={logout}
        savedCount={0}
      />

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      <main className="flex-1 md:ml-60 p-4 md:p-10 bg-background min-h-screen">
        <Navbar
          onSearch={() => {}}
          onClear={() => {}}
          user={user}
          onLoginClick={() => setShowAuth(true)}
          onLogout={logout}
        />

        {/* Breadcrumb & Header Title (Matching Image 1 & 5) */}
        <div className="analysis-header flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-on-surface-variant mb-1">
              Channels &gt; <span className="text-primary font-semibold">{result?.data?.name || "TechOrbit Daily"}</span>
            </p>
            <h1 className="text-3xl font-bold text-on-background">Analysis Results</h1>
            <p className="text-xs text-outline font-mono mt-0.5">{url}</p>
          </div>

          <button className="save-report-btn bg-surface border border-outline-variant text-primary px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all">
            Save Report
          </button>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative max-w-2xl">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube channel or video link..."
              className="w-full h-12 pl-4 pr-32 bg-surface border border-outline-variant rounded-xl text-sm neumorphic-inset focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-1 top-1 bottom-1 bg-primary text-on-primary px-5 rounded-lg text-xs font-bold shadow-sm"
            >
              {loading ? "Analyzing..." : "Analyze Link"}
            </button>
          </div>
        </form>

        {error && <div className="text-red-500 mb-6 text-sm">{error}</div>}

        {/* Top 2 Cards Row: Overall Quality Score & AI Synthesis (Image 5) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Left Card: Overall Quality Score */}
          <div className="bg-surface border border-outline-variant rounded-2xl p-6 neumorphic-card text-center flex flex-col items-center justify-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">
              Overall Quality Score
            </h3>
            <TrustRing score={result?.data?.trustScore || 87} size={130} />
            <p className="text-xs text-on-surface-variant mt-4 max-w-xs">
              Top 12% of analyzed content in this category.
            </p>
          </div>

          {/* Right Card: AI Synthesis */}
          <div className="md:col-span-2 bg-surface border border-outline-variant rounded-2xl p-6 neumorphic-card flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
                  ⚡
                </span>
                <h3 className="font-bold text-on-background text-base">AI Synthesis</h3>
              </div>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed mb-4">
                This content exhibits strong indicators of sustained audience interest and high algorithmic trust. 
                The engagement ratio deeply outperforms the channel average, suggesting a highly resonant topic or 
                exceptional delivery format. While recent upload frequency has slightly dipped, the catalog longevity 
                provides a robust structural foundation.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-outline-variant/40">
              <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant border border-outline-variant">
                High Retention
              </span>
              <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant border border-outline-variant">
                Evergreen Potential
              </span>
              <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-surface-container-low text-on-surface-variant border border-outline-variant">
                Strong Hook
              </span>
            </div>
          </div>
        </div>

        {/* 5 Sub-Metric Boxes Row (Matching Image 5) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-surface border border-outline-variant rounded-xl p-4 neumorphic-card">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              ENGAGEMENT
            </span>
            <span className="text-2xl font-bold font-mono text-on-background mt-1 block">
              {scoreData.engagement}
            </span>
            <div className="w-full h-1 bg-surface-container-high rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${scoreData.engagement}%` }} />
            </div>
          </div>

          <div className="bg-surface border border-outline-variant rounded-xl p-4 neumorphic-card">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              CONSISTENCY
            </span>
            <span className="text-2xl font-bold font-mono text-on-background mt-1 block">
              {scoreData.consistency}
            </span>
            <div className="w-full h-1 bg-surface-container-high rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-amber-600 rounded-full" style={{ width: `${scoreData.consistency}%` }} />
            </div>
          </div>

          <div className="bg-surface border border-outline-variant rounded-xl p-4 neumorphic-card">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              LONGEVITY
            </span>
            <span className="text-2xl font-bold font-mono text-on-background mt-1 block">
              {scoreData.longevity}
            </span>
            <div className="w-full h-1 bg-surface-container-high rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full" style={{ width: `${scoreData.longevity}%` }} />
            </div>
          </div>

          <div className="bg-surface border border-outline-variant rounded-xl p-4 neumorphic-card">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              ACTIVITY
            </span>
            <span className="text-2xl font-bold font-mono text-on-background mt-1 block">
              {scoreData.activity}
            </span>
            <div className="w-full h-1 bg-surface-container-high rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: `${scoreData.activity}%` }} />
            </div>
          </div>

          <div className="bg-surface border border-outline-variant rounded-xl p-4 neumorphic-card col-span-2 sm:col-span-1">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
              AUDIENCE
            </span>
            <span className="text-2xl font-bold font-mono text-on-background mt-1 block">
              {scoreData.audience}
            </span>
            <div className="w-full h-1 bg-surface-container-high rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${scoreData.audience}%` }} />
            </div>
          </div>
        </div>

        {/* Bottom 2 Columns: Healthy Signals & Red Flags Detected (Image 5) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Healthy Signals */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-on-background text-base">Healthy Signals</h3>
            
            <div className="bg-surface border-l-4 border-l-cyan-500 border-y border-r border-outline-variant rounded-xl p-4 neumorphic-card flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center flex-shrink-0 font-bold">
                👍
              </div>
              <div>
                <h4 className="font-bold text-on-background text-sm">High Comment-to-View Ratio</h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Community engagement is 3.5x higher than the baseline for this niche, indicating strong viewer investment.
                </p>
              </div>
            </div>

            <div className="bg-surface border-l-4 border-l-cyan-500 border-y border-r border-outline-variant rounded-xl p-4 neumorphic-card flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center flex-shrink-0 font-bold">
                👁
              </div>
              <div>
                <h4 className="font-bold text-on-background text-sm">Consistent Daily Views</h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Traffic shows a stable, evergreen pattern over the last 90 days without relying on viral spikes.
                </p>
              </div>
            </div>
          </div>

          {/* Red Flags Detected */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-on-background text-base">Red Flags Detected</h3>

            <div className="bg-surface border-l-4 border-l-rose-500 border-y border-r border-outline-variant rounded-xl p-4 neumorphic-card flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 font-bold">
                ⚠️
              </div>
              <div>
                <h4 className="font-bold text-on-background text-sm">Low Recent Activity</h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Creator upload frequency has decreased by 40% in the last 6 months, potentially impacting future channel authority.
                </p>
              </div>
            </div>

            <div className="bg-surface border-l-4 border-l-amber-500 border-y border-r border-outline-variant rounded-xl p-4 neumorphic-card flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 font-bold">
                ℹ️
              </div>
              <div>
                <h4 className="font-bold text-on-background text-sm">Metadata Optimization Opportunity</h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Tags and description lack secondary LSI keywords commonly found in top-performing competitors.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Performances (Image 1) */}
        <section className="recent-performances mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-on-background text-base flex items-center gap-2">
              <span>▶</span> Recent Performances
            </h3>
            <a href="#all-videos" className="text-xs font-bold text-primary hover:underline">
              View All
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden neumorphic-card">
              <div className="relative h-40 bg-surface-container-high">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[10px] px-1.5 py-0.5 rounded">
                  14:20
                </span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-on-background text-xs line-clamp-2 mb-2">
                  The Future of Spatial Computing: A Deep Data Dive
                </h4>
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                  <span>👁 125K</span>
                  <span>👍 12K</span>
                  <span>2 days ago</span>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden neumorphic-card">
              <div className="relative h-40 bg-surface-container-high">
                <img
                  src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80"
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[10px] px-1.5 py-0.5 rounded">
                  08:45
                </span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-on-background text-xs line-clamp-2 mb-2">
                  Why the M3 Architecture Changes Everything for Devs
                </h4>
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                  <span>👁 340K</span>
                  <span>👍 28K</span>
                  <span>1 week ago</span>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden neumorphic-card">
              <div className="relative h-40 bg-surface-container-high">
                <img
                  src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[10px] px-1.5 py-0.5 rounded">
                  22:15
                </span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-on-background text-xs line-clamp-2 mb-2">
                  Reviewing the Top Mechanical Keyboards of 2024
                </h4>
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                  <span>👁 89K</span>
                  <span>👍 7.5K</span>
                  <span>2 weeks ago</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
