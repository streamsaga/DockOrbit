export default function TopLeaderboardWidget() {
  const topCreators = [
    { rank: 1, name: "Science Explored", score: 98, trend: "up", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" },
    { rank: 2, name: "Cinephile Docs", score: 97, trend: "up", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" },
    { rank: 3, name: "Design Rules", score: 95, trend: "flat", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" },
    { rank: 4, name: "TechSavvy Reviews", score: 94, trend: "up", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80" },
    { rank: 5, name: "Code & Concept", score: 88, trend: "up", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&q=80" }
  ];

  return (
    <aside className="leaderboard-widget bg-surface border border-surface-variant neumorphic-card rounded-2xl p-5 self-start sticky top-20">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🏅</span>
        <h3 className="font-bold text-on-background text-base">Top 10 This Week</h3>
      </div>

      <div className="divide-y divide-outline-variant/40">
        {topCreators.map((item) => (
          <div key={item.rank} className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-bold text-on-surface-variant text-sm w-4 text-center">{item.rank}</span>
              <img src={item.avatar} alt={item.name} className="w-8 h-8 rounded-full object-cover border border-outline-variant" />
              <div>
                <h4 className="font-bold text-on-background text-xs">{item.name}</h4>
                <p className="text-[11px] text-on-surface-variant">{item.score} Q-Score</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600">
              {item.trend === "up" ? "↗" : "→"}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-outline-variant text-center">
        <a href="#leaderboard" className="text-xs font-bold text-primary hover:underline">
          View Full Leaderboard &rarr;
        </a>
      </div>
    </aside>
  );
}
