"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Trophy, Diamond, TrendingUp, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMiniGameStats } from "@/app/actions/playMiniGame";
import { staggerContainer, fadeUp } from "@/lib/animations";

const GAME_LABELS: Record<string, string> = {
  "memory-match": "Memory Match",
  "tap-hex": "Tap the Hex",
  "rock-paper-scissors": "Rock Paper Scissors",
  "math-quiz": "Math Quiz",
  "color-sequence": "Color Sequence",
  "reflex-test": "Reflex Test",
  "number-guess": "Number Guess",
  "word-scramble": "Word Scramble",
  "coin-flip": "Coin Flip",
  "spin-wheel": "Spin Wheel",
};

const GAME_EMOJIS: Record<string, string> = {
  "memory-match": "🧠", "tap-hex": "⚡", "rock-paper-scissors": "✊",
  "math-quiz": "🧮", "color-sequence": "🎨", "reflex-test": "⏱",
  "number-guess": "#️⃣", "word-scramble": "🔤", "coin-flip": "🪙", "spin-wheel": "🎰",
};

interface Stats {
  totalPlays: number;
  totalHxco: number;
  playsToday: number;
  topGames: Array<{ game_type: string; count: number }>;
}

export default function MiniGameStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const data = await getMiniGameStats();
    setStats(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cosmic-accent to-cosmic-highlight flex items-center justify-center">
            <Gamepad2 className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-cosmic-text">Mini Game Stats</h2>
            <p className="text-xs text-cosmic-muted">All 10 mini games activity</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={load}
          disabled={loading}
          className="border-cosmic-accent/30 text-cosmic-muted"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Summary cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Plays", value: stats?.totalPlays.toLocaleString() ?? "—", icon: <Trophy className="h-4 w-4 text-cosmic-accent" />, color: "border-cosmic-accent/20" },
          { label: "Plays Today", value: stats?.playsToday.toLocaleString() ?? "—", icon: <TrendingUp className="h-4 w-4 text-cosmic-tertiary" />, color: "border-cosmic-tertiary/20" },
          { label: "HXCO Paid Out", value: stats?.totalHxco.toLocaleString() ?? "—", icon: <Diamond className="h-4 w-4 text-cosmic-gold" />, color: "border-cosmic-gold/20" },
        ].map((s) => (
          <Card key={s.label} className={`border ${s.color} bg-cosmic-card/60`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">{s.icon}<span className="text-xs text-cosmic-muted">{s.label}</span></div>
              <p className={`text-xl font-bold ${loading ? "text-cosmic-muted animate-pulse" : "text-cosmic-text"}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Top games */}
      <motion.div variants={fadeUp}>
        <Card className="border border-cosmic-accent/20 bg-cosmic-card/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-cosmic-text">Most Played Games</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 rounded-lg bg-cosmic-surface/50 animate-pulse" />
              ))
            ) : stats?.topGames.length === 0 ? (
              <p className="text-sm text-cosmic-muted text-center py-6">No games played yet</p>
            ) : (
              stats?.topGames.map((g, i) => {
                const maxCount = stats.topGames[0]?.count ?? 1;
                const pct = (g.count / maxCount) * 100;
                return (
                  <div key={g.game_type} className="flex items-center gap-3">
                    <span className="text-sm text-cosmic-muted w-5 text-right">{i + 1}</span>
                    <span className="text-lg">{GAME_EMOJIS[g.game_type] ?? "🎮"}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-cosmic-text font-medium">{GAME_LABELS[g.game_type] ?? g.game_type}</span>
                        <span className="text-cosmic-muted">{g.count.toLocaleString()} plays</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
