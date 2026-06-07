"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Hexagon, Brain, Zap, Swords, Calculator, Palette,
  Timer, Hash, Type, Coins, Disc3, Gamepad2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { staggerContainer, fadeUp } from "@/lib/animations";

interface GameMeta {
  slug: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  shadow: string;
  badge: string;
  badgeColor: string;
  maxReward: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

const GAMES: GameMeta[] = [
  {
    slug: "hex-chase",
    title: "Hex Chase",
    description: "Open hexagon tiles and win HXCO & TON rewards",
    icon: <Hexagon className="h-7 w-7 text-white" />,
    gradient: "from-cosmic-accent to-cosmic-highlight",
    shadow: "0 0 25px rgba(124,58,237,0.4)",
    badge: "Flagship",
    badgeColor: "bg-cosmic-highlight/20 text-cosmic-highlight border-cosmic-highlight/30",
    maxReward: 0,
    difficulty: "Easy",
  },
  {
    slug: "memory-match",
    title: "Memory Match",
    description: "Flip cards and find all matching pairs before time runs out",
    icon: <Brain className="h-7 w-7 text-white" />,
    gradient: "from-violet-600 to-purple-500",
    shadow: "0 0 25px rgba(124,58,237,0.35)",
    badge: "Skill",
    badgeColor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    maxReward: 50,
    difficulty: "Medium",
  },
  {
    slug: "tap-hex",
    title: "Tap the Hex",
    description: "Tap glowing hexagons as fast as you can in 15 seconds",
    icon: <Zap className="h-7 w-7 text-white" />,
    gradient: "from-yellow-500 to-orange-500",
    shadow: "0 0 25px rgba(245,158,11,0.4)",
    badge: "Reflex",
    badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    maxReward: 50,
    difficulty: "Easy",
  },
  {
    slug: "rock-paper-scissors",
    title: "Rock Paper Scissors",
    description: "Beat the CPU in best-of-3 with classic hand gestures",
    icon: <Swords className="h-7 w-7 text-white" />,
    gradient: "from-pink-600 to-rose-500",
    shadow: "0 0 25px rgba(244,63,94,0.35)",
    badge: "Luck",
    badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/30",
    maxReward: 50,
    difficulty: "Easy",
  },
  {
    slug: "math-quiz",
    title: "Math Quiz",
    description: "Answer 5 math questions quickly — speed bonus applies",
    icon: <Calculator className="h-7 w-7 text-white" />,
    gradient: "from-cyan-600 to-teal-500",
    shadow: "0 0 25px rgba(6,182,212,0.35)",
    badge: "Skill",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    maxReward: 50,
    difficulty: "Medium",
  },
  {
    slug: "color-sequence",
    title: "Color Sequence",
    description: "Remember and repeat the color pattern — Simon Says style",
    icon: <Palette className="h-7 w-7 text-white" />,
    gradient: "from-emerald-600 to-green-500",
    shadow: "0 0 25px rgba(16,185,129,0.35)",
    badge: "Memory",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    maxReward: 50,
    difficulty: "Hard",
  },
  {
    slug: "reflex-test",
    title: "Reflex Test",
    description: "Tap the target the instant it turns green — reaction time matters",
    icon: <Timer className="h-7 w-7 text-white" />,
    gradient: "from-red-600 to-orange-500",
    shadow: "0 0 25px rgba(239,68,68,0.35)",
    badge: "Reflex",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
    maxReward: 50,
    difficulty: "Easy",
  },
  {
    slug: "number-guess",
    title: "Number Guess",
    description: "Guess the secret number 1–100 with hot & cold hints in 7 tries",
    icon: <Hash className="h-7 w-7 text-white" />,
    gradient: "from-indigo-600 to-blue-500",
    shadow: "0 0 25px rgba(99,102,241,0.35)",
    badge: "Logic",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    maxReward: 50,
    difficulty: "Medium",
  },
  {
    slug: "word-scramble",
    title: "Word Scramble",
    description: "Unscramble 5 crypto & Web3 words against the clock",
    icon: <Type className="h-7 w-7 text-white" />,
    gradient: "from-amber-500 to-yellow-400",
    shadow: "0 0 25px rgba(245,158,11,0.35)",
    badge: "Vocab",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    maxReward: 50,
    difficulty: "Medium",
  },
  {
    slug: "coin-flip",
    title: "Coin Flip",
    description: "Heads or tails? Predict 3 flips correctly to earn HXCO",
    icon: <Coins className="h-7 w-7 text-white" />,
    gradient: "from-cosmic-gold to-[#FBBF24]",
    shadow: "0 0 25px rgba(245,158,11,0.5)",
    badge: "Luck",
    badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    maxReward: 50,
    difficulty: "Easy",
  },
  {
    slug: "spin-wheel",
    title: "Spin the Wheel",
    description: "Spin the cosmic reward wheel and land on an HXCO prize",
    icon: <Disc3 className="h-7 w-7 text-white" />,
    gradient: "from-fuchsia-600 to-pink-500",
    shadow: "0 0 25px rgba(192,38,211,0.4)",
    badge: "Lucky",
    badgeColor: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
    maxReward: 50,
    difficulty: "Easy",
  },
];

export default function GamesPage() {
  const router = useRouter();

  const hexGame = GAMES[0];
  const miniGames = GAMES.slice(1);

  return (
    <motion.div
      className="container px-4 py-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cosmic-accent to-cosmic-highlight flex items-center justify-center">
          <Gamepad2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-cosmic-text">Games</h1>
          <p className="text-xs text-cosmic-muted">{GAMES.length} games • Watch ad to play each</p>
        </div>
      </motion.div>

      {/* Flagship: Hex Chase */}
      <motion.div variants={fadeUp} className="mb-6">
        <button
          onClick={() => router.push("/games/hex-chase")}
          className="w-full text-left"
        >
          <div
            className="relative rounded-2xl overflow-hidden p-5 border border-cosmic-accent/30"
            style={{
              background: "linear-gradient(135deg, #1A1438 0%, #110D2A 100%)",
              boxShadow: hexGame.shadow,
            }}
          >
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cosmic-accent/15 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

            <div className="relative flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${hexGame.gradient} flex items-center justify-center flex-shrink-0`}
                style={{ boxShadow: hexGame.shadow }}
              >
                {hexGame.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-cosmic-text">{hexGame.title}</h2>
                  <Badge className={`text-[10px] px-1.5 py-0 border ${hexGame.badgeColor}`}>
                    {hexGame.badge}
                  </Badge>
                </div>
                <p className="text-sm text-cosmic-muted">{hexGame.description}</p>
              </div>
              <div className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0">
                Play →
              </div>
            </div>
          </div>
        </button>
      </motion.div>

      {/* Section heading */}
      <motion.div variants={fadeUp} className="mb-4">
        <h2 className="text-xs font-semibold text-cosmic-muted uppercase tracking-wider">
          Mini Games — 5–50 HXCO each • 3 plays/day
        </h2>
      </motion.div>

      {/* Mini games grid */}
      <motion.div
        className="grid grid-cols-2 gap-3"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {miniGames.map((game) => (
          <motion.div key={game.slug} variants={fadeUp}>
            <button
              onClick={() => router.push(`/games/${game.slug}`)}
              className="w-full text-left"
            >
              <div
                className="rounded-2xl border border-cosmic-border/40 overflow-hidden transition-all duration-200 hover:border-cosmic-accent/40 active:scale-95"
                style={{ background: "linear-gradient(135deg, #1A1438 0%, #110D2A 100%)" }}
              >
                {/* Icon area */}
                <div
                  className={`h-20 flex items-center justify-center bg-gradient-to-br ${game.gradient} relative overflow-hidden`}
                  style={{ boxShadow: `inset 0 -20px 30px rgba(0,0,0,0.3)` }}
                >
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,white,transparent_60%)]" />
                  <motion.div
                    animate={{ rotate: [0, 3, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  >
                    {game.icon}
                  </motion.div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h3 className="text-sm font-bold text-cosmic-text leading-tight">{game.title}</h3>
                    <Badge className={`text-[9px] px-1 py-0 border flex-shrink-0 ${game.badgeColor}`}>
                      {game.badge}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-cosmic-muted leading-snug line-clamp-2">
                    {game.description}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-cosmic-gold font-semibold">Up to 50 HXCO</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                      game.difficulty === "Hard" ? "bg-red-500/15 text-red-400" :
                      game.difficulty === "Medium" ? "bg-yellow-500/15 text-yellow-400" :
                      "bg-green-500/15 text-green-400"
                    }`}>
                      {game.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
