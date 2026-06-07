"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Hexagon, Brain, Zap, Swords, Calculator, Palette,
  Timer, Hash, Type, Coins, Disc3, Gamepad2, ChevronRight,
} from "lucide-react";
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
  difficulty: "Easy" | "Medium" | "Hard";
  diffColor: string;
  maxReward: number;
}

const GAMES: GameMeta[] = [
  {
    slug: "hex-chase",
    title: "Hex Chase",
    description: "Open hexagon tiles and win HXCO & TON rewards",
    icon: <Hexagon className="h-7 w-7 text-white" />,
    gradient: "linear-gradient(135deg,#7C3AED,#A855F7)",
    shadow: "0 0 28px rgba(124,58,237,0.55)",
    badge: "Flagship",
    badgeColor: "rgba(124,58,237,0.25)",
    difficulty: "Easy",
    diffColor: "#22c55e",
    maxReward: 0,
  },
  {
    slug: "memory-match",
    title: "Memory Match",
    description: "Flip cards and find all matching pairs in time",
    icon: <Brain className="h-7 w-7 text-white" />,
    gradient: "linear-gradient(135deg,#5B21B6,#7C3AED)",
    shadow: "0 0 24px rgba(91,33,182,0.5)",
    badge: "Skill",
    badgeColor: "rgba(124,58,237,0.25)",
    difficulty: "Medium",
    diffColor: "#eab308",
    maxReward: 50,
  },
  {
    slug: "tap-hex",
    title: "Tap the Hex",
    description: "Tap glowing hexagons as fast as you can",
    icon: <Zap className="h-7 w-7 text-white" />,
    gradient: "linear-gradient(135deg,#D97706,#F59E0B)",
    shadow: "0 0 24px rgba(217,119,6,0.5)",
    badge: "Reflex",
    badgeColor: "rgba(245,158,11,0.22)",
    difficulty: "Easy",
    diffColor: "#22c55e",
    maxReward: 50,
  },
  {
    slug: "rock-paper-scissors",
    title: "Rock Paper Scissors",
    description: "Beat the CPU in best-of-3 rounds",
    icon: <Swords className="h-7 w-7 text-white" />,
    gradient: "linear-gradient(135deg,#BE185D,#F43F5E)",
    shadow: "0 0 24px rgba(190,24,93,0.5)",
    badge: "Luck",
    badgeColor: "rgba(244,63,94,0.22)",
    difficulty: "Easy",
    diffColor: "#22c55e",
    maxReward: 50,
  },
  {
    slug: "math-quiz",
    title: "Math Quiz",
    description: "Answer 5 math questions fast",
    icon: <Calculator className="h-7 w-7 text-white" />,
    gradient: "linear-gradient(135deg,#0E7490,#06B6D4)",
    shadow: "0 0 24px rgba(6,182,212,0.45)",
    badge: "Skill",
    badgeColor: "rgba(6,182,212,0.22)",
    difficulty: "Medium",
    diffColor: "#eab308",
    maxReward: 50,
  },
  {
    slug: "color-sequence",
    title: "Color Sequence",
    description: "Repeat the color pattern — Simon Says style",
    icon: <Palette className="h-7 w-7 text-white" />,
    gradient: "linear-gradient(135deg,#047857,#10B981)",
    shadow: "0 0 24px rgba(4,120,87,0.5)",
    badge: "Memory",
    badgeColor: "rgba(16,185,129,0.22)",
    difficulty: "Hard",
    diffColor: "#ef4444",
    maxReward: 50,
  },
  {
    slug: "reflex-test",
    title: "Reflex Test",
    description: "Tap the target when it turns green",
    icon: <Timer className="h-7 w-7 text-white" />,
    gradient: "linear-gradient(135deg,#B91C1C,#EF4444)",
    shadow: "0 0 24px rgba(185,28,28,0.5)",
    badge: "Reflex",
    badgeColor: "rgba(239,68,68,0.22)",
    difficulty: "Easy",
    diffColor: "#22c55e",
    maxReward: 50,
  },
  {
    slug: "number-guess",
    title: "Number Guess",
    description: "Guess the secret number with hot & cold hints",
    icon: <Hash className="h-7 w-7 text-white" />,
    gradient: "linear-gradient(135deg,#3730A3,#6366F1)",
    shadow: "0 0 24px rgba(55,48,163,0.5)",
    badge: "Logic",
    badgeColor: "rgba(99,102,241,0.22)",
    difficulty: "Medium",
    diffColor: "#eab308",
    maxReward: 50,
  },
  {
    slug: "word-scramble",
    title: "Word Scramble",
    description: "Unscramble 5 crypto words against the clock",
    icon: <Type className="h-7 w-7 text-white" />,
    gradient: "linear-gradient(135deg,#B45309,#F59E0B)",
    shadow: "0 0 24px rgba(180,83,9,0.5)",
    badge: "Vocab",
    badgeColor: "rgba(245,158,11,0.22)",
    difficulty: "Medium",
    diffColor: "#eab308",
    maxReward: 50,
  },
  {
    slug: "coin-flip",
    title: "Coin Flip",
    description: "Predict 3 flips correctly to earn HXCO",
    icon: <Coins className="h-7 w-7 text-white" />,
    gradient: "linear-gradient(135deg,#D97706,#FBBF24)",
    shadow: "0 0 24px rgba(217,119,6,0.55)",
    badge: "Luck",
    badgeColor: "rgba(245,158,11,0.22)",
    difficulty: "Easy",
    diffColor: "#22c55e",
    maxReward: 50,
  },
  {
    slug: "spin-wheel",
    title: "Spin the Wheel",
    description: "Spin the cosmic reward wheel for HXCO",
    icon: <Disc3 className="h-7 w-7 text-white" />,
    gradient: "linear-gradient(135deg,#86198F,#D946EF)",
    shadow: "0 0 24px rgba(134,25,143,0.55)",
    badge: "Lucky",
    badgeColor: "rgba(217,70,239,0.22)",
    difficulty: "Easy",
    diffColor: "#22c55e",
    maxReward: 50,
  },
];

export default function GamesPage() {
  const router = useRouter();
  const [hexGame, ...miniGames] = GAMES;

  return (
    <motion.div
      className="px-4 py-6 max-w-lg mx-auto"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Page header */}
      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg,#7C3AED,#A855F7)",
            boxShadow: "0 0 18px rgba(124,58,237,0.5)",
          }}
        >
          <Gamepad2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-cosmic-text">Games Hub</h1>
          <p className="text-xs text-cosmic-muted">
            {GAMES.length} games · Watch ad to play · Up to 50 HXCO
          </p>
        </div>
      </motion.div>

      {/* Flagship: Hex Chase */}
      <motion.div variants={fadeUp} className="mb-6">
        <motion.button
          whileTap={{ scale: 0.985 }}
          onClick={() => router.push("/games/hex-chase")}
          className="w-full text-left"
        >
          <div
            className="relative rounded-2xl overflow-hidden shimmer-card"
            style={{
              background: "linear-gradient(140deg, #1A1438 0%, #0D0A22 100%)",
              border: "1px solid rgba(124,58,237,0.38)",
              boxShadow: "0 0 40px rgba(124,58,237,0.16), 0 10px 40px rgba(0,0,0,0.5)",
            }}
          >
            {/* Glow orb */}
            <div className="absolute top-0 right-0 w-52 h-52 bg-cosmic-accent/14 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full bg-cosmic-accent/25"
                  style={{ width: 3, height: 3, left: `${12 + i * 14}%`, top: `${20 + (i % 3) * 26}%` }}
                  animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.8, 1.5, 0.8] }}
                  transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>

            <div className="relative flex items-center gap-4 p-5">
              <motion.div
                animate={{ rotate: [0, 6, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                className="flex-shrink-0"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: hexGame.gradient, boxShadow: hexGame.shadow }}
                >
                  {hexGame.icon}
                </div>
              </motion.div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="text-lg font-extrabold text-cosmic-text">{hexGame.title}</h2>
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                    style={{ background: hexGame.badgeColor, color: "#A855F7", border: "1px solid rgba(168,85,247,0.3)" }}
                  >
                    {hexGame.badge}
                  </span>
                </div>
                <p className="text-sm text-cosmic-muted leading-snug">{hexGame.description}</p>
              </div>

              <div
                className="flex items-center gap-1 text-white text-xs font-bold px-3 py-2 rounded-xl flex-shrink-0"
                style={{ background: hexGame.gradient, boxShadow: "0 0 12px rgba(124,58,237,0.35)" }}
              >
                Play <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </motion.button>
      </motion.div>

      {/* Section label */}
      <motion.div variants={fadeUp} className="mb-4">
        <p className="text-[10px] font-bold text-cosmic-muted uppercase tracking-widest">
          Mini Games — 5–50 HXCO · 3 plays/day per game
        </p>
      </motion.div>

      {/* Mini games grid */}
      <motion.div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {miniGames.map((game, idx) => (
          <motion.div
            key={game.slug}
            variants={fadeUp}
            custom={idx}
          >
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => router.push(`/games/${game.slug}`)}
              className="w-full text-left"
            >
              <div
                className="rounded-2xl overflow-hidden shimmer-card"
                style={{
                  background: "linear-gradient(135deg, #1A1438 0%, #100C27 100%)",
                  border: "1px solid rgba(124,58,237,0.18)",
                }}
              >
                {/* Icon area */}
                <div
                  className="relative h-[86px] flex items-center justify-center overflow-hidden"
                  style={{ background: game.gradient, boxShadow: `inset 0 -24px 30px rgba(0,0,0,0.4)` }}
                >
                  {/* Shine overlay */}
                  <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.5),transparent_55%)]" />
                  {/* Sparkle dots */}
                  <div className="absolute top-2 right-3 w-1 h-1 rounded-full bg-white/60 animate-ping" style={{ animationDuration: "1.5s" }} />
                  <div className="absolute bottom-3 left-3 w-1 h-1 rounded-full bg-white/40 animate-ping" style={{ animationDuration: "2.2s" }} />

                  <motion.div
                    animate={{ rotate: [0, 4, -4, 0], scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 4 + idx * 0.3, ease: "easeInOut" }}
                    className="drop-shadow-lg"
                  >
                    {game.icon}
                  </motion.div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h3 className="text-[13px] font-extrabold text-cosmic-text leading-tight">{game.title}</h3>
                    <span
                      className="text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0 mt-0.5"
                      style={{ background: game.badgeColor, color: "#CBD5E1", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      {game.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-cosmic-muted leading-snug line-clamp-2">{game.description}</p>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[10px] font-bold text-gradient-gold">Up to 50 HXCO</span>
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                      style={{ background: `${game.diffColor}22`, color: game.diffColor }}
                    >
                      {game.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
