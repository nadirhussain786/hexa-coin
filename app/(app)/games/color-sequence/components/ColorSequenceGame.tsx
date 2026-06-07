"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Eye, Hand } from "lucide-react";
import { GameAdGate } from "../../components/GameAdGate";
import { GameRewardDialog } from "../../components/GameRewardDialog";
import { useMiniGame } from "@/hooks/use-mini-game";

const COLORS = [
  { id: "red",    label: "Red",    bg: "from-red-500 to-rose-600",      active: "shadow-[0_0_30px_rgba(239,68,68,0.8)]" },
  { id: "blue",   label: "Blue",   bg: "from-blue-500 to-indigo-600",   active: "shadow-[0_0_30px_rgba(99,102,241,0.8)]" },
  { id: "green",  label: "Green",  bg: "from-emerald-500 to-green-600", active: "shadow-[0_0_30px_rgba(16,185,129,0.8)]" },
  { id: "yellow", label: "Yellow", bg: "from-yellow-400 to-amber-500",  active: "shadow-[0_0_30px_rgba(245,158,11,0.8)]" },
];

type Phase = "watching" | "input" | "correct" | "wrong";

export default function ColorSequenceGame() {
  const game = useMiniGame("color-sequence", 10);
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSeq, setPlayerSeq] = useState<string[]>([]);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("watching");
  const [level, setLevel] = useState(1);

  const playSequence = useCallback((seq: string[]) => {
    setPhase("watching");
    setPlayerSeq([]);
    let i = 0;
    const tick = () => {
      if (i >= seq.length) { setTimeout(() => setPhase("input"), 400); return; }
      setActiveColor(seq[i]);
      setTimeout(() => { setActiveColor(null); i++; setTimeout(tick, 300); }, 600);
    };
    setTimeout(tick, 500);
  }, []);

  const startLevel = useCallback((lvl: number) => {
    const newSeq = Array.from({ length: lvl + 1 }, () => COLORS[Math.floor(Math.random() * COLORS.length)].id);
    setSequence(newSeq);
    setLevel(lvl);
    playSequence(newSeq);
  }, [playSequence]);

  const handleStart = () => {
    setLevel(1);
    setSequence([]);
    setPlayerSeq([]);
    game.startGame();
    startLevel(1);
  };

  const handleColorPress = (colorId: string) => {
    if (phase !== "input") return;
    const newPlayer = [...playerSeq, colorId];
    setPlayerSeq(newPlayer);
    setActiveColor(colorId);
    setTimeout(() => setActiveColor(null), 250);

    const idx = newPlayer.length - 1;
    if (newPlayer[idx] !== sequence[idx]) {
      setPhase("wrong");
      setTimeout(() => game.finishGame(level - 1), 800);
      return;
    }
    if (newPlayer.length === sequence.length) {
      setPhase("correct");
      if (level >= 10) {
        setTimeout(() => game.finishGame(level), 800);
      } else {
        setTimeout(() => startLevel(level + 1), 1000);
      }
    }
  };

  return (
    <GameAdGate gameType="color-sequence" gameTitle="Color Sequence" onAdComplete={handleStart}>
      <div className="flex flex-col items-center px-4 py-4 max-w-sm mx-auto">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-emerald-400" />
            <span className="font-bold text-cosmic-text">Color Sequence</span>
          </div>
          <div className="flex items-center gap-2">
            {phase === "watching" && <Eye className="h-4 w-4 text-emerald-400 animate-pulse" />}
            {phase === "input" && <Hand className="h-4 w-4 text-yellow-400 animate-pulse" />}
            <span className={`text-sm font-semibold ${phase === "correct" ? "text-green-400" : phase === "wrong" ? "text-red-400" : "text-cosmic-muted"}`}>
              {phase === "watching" ? "Watch…" : phase === "input" ? "Your turn!" : phase === "correct" ? "Correct!" : "Wrong!"}
            </span>
            <span className="text-sm text-cosmic-muted">Level {level}</span>
          </div>
        </div>

        {/* Level dots */}
        <div className="flex gap-1.5 mb-6 flex-wrap justify-center">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < level - 1 ? "bg-emerald-400" : i === level - 1 ? "bg-cosmic-accent" : "bg-white/15"}`} />
          ))}
        </div>

        {/* Progress bar during input */}
        {phase === "input" && (
          <div className="w-full h-1.5 bg-white/10 rounded-full mb-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              animate={{ width: `${(playerSeq.length / sequence.length) * 100}%` }}
            />
          </div>
        )}

        {/* Color grid */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-[260px] mx-auto">
          {COLORS.map((c) => {
            const isActive = activeColor === c.id;
            return (
              <motion.button
                key={c.id}
                onPointerDown={() => handleColorPress(c.id)}
                disabled={phase !== "input"}
                whileTap={phase === "input" ? { scale: 0.92 } : {}}
                className={`aspect-square rounded-2xl bg-gradient-to-br ${c.bg} transition-all duration-150 ${
                  isActive ? `scale-105 ${c.active}` : "opacity-75"
                } disabled:cursor-not-allowed`}
              />
            );
          })}
        </div>

        <p className="text-xs text-cosmic-muted mt-5 text-center">
          {phase === "watching" ? "Watch the sequence carefully" : phase === "input" ? "Tap the colors in the same order" : ""}
        </p>
      </div>

      <GameRewardDialog
        open={game.showReward}
        rewardHxco={game.rewardHxco}
        score={game.score}
        maxScore={10}
        gameName="Color Sequence"
        onClose={() => { game.setShowReward(false); game.resetGame(); }}
        onPlayAgain={() => { game.setShowReward(false); handleStart(); }}
      />
    </GameAdGate>
  );
}
