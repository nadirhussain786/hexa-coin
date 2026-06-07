"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Timer } from "lucide-react";
import { GameAdGate } from "../../components/GameAdGate";
import { GameRewardDialog } from "../../components/GameRewardDialog";
import { useMiniGame } from "@/hooks/use-mini-game";

const ROUNDS = 5;
const MIN_WAIT_MS = 1500;
const MAX_WAIT_MS = 4000;

type DotState = "waiting" | "ready" | "tapped" | "too-early";

function msToScore(ms: number): number {
  if (ms < 200) return 10;
  if (ms < 300) return 9;
  if (ms < 400) return 8;
  if (ms < 500) return 7;
  if (ms < 700) return 5;
  if (ms < 900) return 3;
  return 1;
}

export default function ReflexTestGame() {
  const game = useMiniGame("reflex-test", ROUNDS * 10);
  const [round, setRound] = useState(0);
  const [dotState, setDotState] = useState<DotState>("waiting");
  const [times, setTimes] = useState<number[]>([]);
  const [currentMs, setCurrentMs] = useState<number | null>(null);
  const readyRef = useRef(false);
  const startRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const scheduleReady = () => {
    const delay = MIN_WAIT_MS + Math.random() * (MAX_WAIT_MS - MIN_WAIT_MS);
    readyRef.current = false;
    setDotState("waiting");
    timerRef.current = setTimeout(() => {
      readyRef.current = true;
      startRef.current = Date.now();
      setDotState("ready");
    }, delay);
  };

  const handleStart = () => {
    setRound(1);
    setTimes([]);
    setCurrentMs(null);
    game.startGame();
    scheduleReady();
  };

  const handleTap = () => {
    if (dotState === "waiting") {
      clearTimeout(timerRef.current);
      setDotState("too-early");
      setCurrentMs(null);
      setTimeout(() => {
        if (round >= ROUNDS) {
          const total = times.reduce((s, ms) => s + msToScore(ms), 0);
          game.finishGame(total);
        } else {
          setRound((r) => r + 1);
          scheduleReady();
        }
      }, 1200);
      return;
    }
    if (dotState !== "ready") return;
    const elapsed = Date.now() - startRef.current;
    const newTimes = [...times, elapsed];
    setTimes(newTimes);
    setCurrentMs(elapsed);
    setDotState("tapped");

    setTimeout(() => {
      if (round >= ROUNDS) {
        const total = newTimes.reduce((s, ms) => s + msToScore(ms), 0);
        game.finishGame(total);
      } else {
        setRound((r) => r + 1);
        setCurrentMs(null);
        scheduleReady();
      }
    }, 900);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const avgMs = times.length ? Math.round(times.reduce((s, t) => s + t, 0) / times.length) : null;

  return (
    <GameAdGate gameType="reflex-test" gameTitle="Reflex Test" onAdComplete={handleStart}>
      <div className="flex flex-col items-center px-4 py-4 max-w-sm mx-auto">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-red-400" />
            <span className="font-bold text-cosmic-text">Reflex Test</span>
          </div>
          <span className="text-sm text-cosmic-muted">Round {round}/{ROUNDS}</span>
        </div>

        {/* Rounds indicator */}
        <div className="flex gap-2 mb-6">
          {Array.from({ length: ROUNDS }).map((_, i) => (
            <div key={i} className={`h-2 flex-1 rounded-full ${
              i < times.length ? "bg-gradient-to-r from-red-500 to-orange-400" :
              i === round - 1 ? "bg-cosmic-accent animate-pulse" : "bg-white/15"
            }`} />
          ))}
        </div>

        {/* Tap area */}
        <motion.button
          onPointerDown={handleTap}
          className="w-full rounded-2xl flex flex-col items-center justify-center select-none"
          style={{ height: 300 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className={`w-full h-full rounded-2xl flex flex-col items-center justify-center transition-all duration-200 border ${
            dotState === "waiting"
              ? "bg-gradient-to-br from-cosmic-surface to-cosmic-card border-cosmic-border/40"
              : dotState === "ready"
              ? "bg-gradient-to-br from-green-600/30 to-emerald-500/20 border-green-500/50"
              : dotState === "tapped"
              ? "bg-gradient-to-br from-cosmic-accent/20 to-cosmic-highlight/10 border-cosmic-accent/40"
              : "bg-gradient-to-br from-red-600/20 to-rose-500/10 border-red-500/40"
          }`}>
            <motion.div
              animate={dotState === "ready" ? { scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] } : { scale: 1 }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className={`w-24 h-24 rounded-full flex items-center justify-center ${
                dotState === "waiting" ? "bg-cosmic-muted/30" :
                dotState === "ready" ? "bg-green-500" :
                dotState === "tapped" ? "bg-cosmic-accent" : "bg-red-500"
              }`}
              style={dotState === "ready" ? { boxShadow: "0 0 40px rgba(34,197,94,0.7)" } : {}}
            />
            <p className={`mt-5 text-lg font-bold ${
              dotState === "waiting" ? "text-cosmic-muted" :
              dotState === "ready" ? "text-green-400" :
              dotState === "too-early" ? "text-red-400" : "text-cosmic-accent"
            }`}>
              {dotState === "waiting" ? "Wait for green…" :
               dotState === "ready" ? "TAP NOW!" :
               dotState === "too-early" ? "Too early!" :
               currentMs !== null ? `${currentMs}ms ⚡` : ""}
            </p>
          </div>
        </motion.button>

        {avgMs !== null && (
          <p className="text-xs text-cosmic-muted mt-3">Avg reaction: {avgMs}ms</p>
        )}
      </div>

      <GameRewardDialog
        open={game.showReward}
        rewardHxco={game.rewardHxco}
        score={game.score}
        maxScore={ROUNDS * 10}
        gameName="Reflex Test"
        onClose={() => { game.setShowReward(false); game.resetGame(); }}
        onPlayAgain={() => { game.setShowReward(false); handleStart(); }}
      />
    </GameAdGate>
  );
}
