"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Timer } from "lucide-react";
import { GameAdGate } from "../../components/GameAdGate";
import { GameRewardDialog } from "../../components/GameRewardDialog";
import { useMiniGame } from "@/hooks/use-mini-game";

const GAME_DURATION = 15;
const MAX_ACTIVE = 3;
const SPAWN_INTERVAL_MS = 600;
const HEX_LIFETIME_MS = 1800;

interface ActiveHex { id: number; x: number; y: number; spawnedAt: number }

export default function TapHexGame() {
  const game = useMiniGame("tap-hex", 20);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [taps, setTaps] = useState(0);
  const [hexes, setHexes] = useState<ActiveHex[]>([]);
  const [missFlash, setMissFlash] = useState(false);
  const idRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const spawnHex = useCallback(() => {
    setHexes((prev) => {
      if (prev.length >= MAX_ACTIVE) return prev;
      const id = ++idRef.current;
      const margin = 12;
      const x = margin + Math.random() * (100 - margin * 2);
      const y = margin + Math.random() * (100 - margin * 2);
      return [...prev, { id, x, y, spawnedAt: Date.now() }];
    });
  }, []);

  useEffect(() => {
    if (game.gameState !== "playing") return;
    const spawnTimer = setInterval(spawnHex, SPAWN_INTERVAL_MS);
    const gameTimer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(spawnTimer); clearInterval(gameTimer); return 0; }
        return t - 1;
      });
    }, 1000);
    // Expire old hexes
    const expireTimer = setInterval(() => {
      const now = Date.now();
      setHexes((prev) => prev.filter((h) => now - h.spawnedAt < HEX_LIFETIME_MS));
    }, 200);
    return () => { clearInterval(spawnTimer); clearInterval(gameTimer); clearInterval(expireTimer); };
  }, [game.gameState, spawnHex]);

  useEffect(() => {
    if (timeLeft === 0 && game.gameState === "playing") {
      game.finishGame(taps);
    }
  }, [timeLeft, taps, game]);

  const handleTap = (id: number) => {
    setHexes((prev) => prev.filter((h) => h.id !== id));
    setTaps((t) => t + 1);
  };

  const handleStart = () => {
    setTaps(0);
    setTimeLeft(GAME_DURATION);
    setHexes([]);
    game.startGame();
  };

  return (
    <GameAdGate gameType="tap-hex" gameTitle="Tap the Hex" onAdComplete={handleStart}>
      <div className="flex flex-col items-center px-4 py-4 max-w-sm mx-auto select-none">
        {/* Header */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            <span className="font-bold text-cosmic-text">Tap the Hex</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-yellow-400">{taps} taps</span>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-bold ${timeLeft <= 5 ? "bg-red-500/20 text-red-400 animate-pulse" : "bg-cosmic-surface text-cosmic-text"}`}>
              <Timer className="h-3.5 w-3.5" />
              {timeLeft}s
            </div>
          </div>
        </div>

        {/* Game arena */}
        <div
          ref={containerRef}
          className="relative w-full rounded-2xl overflow-hidden border border-yellow-500/20"
          style={{ height: 380, background: "linear-gradient(135deg, #1A1438 0%, #0F0A1F 100%)" }}
        >
          {/* Stars bg */}
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white/30 rounded-full"
              style={{ left: `${(i * 7) % 100}%`, top: `${(i * 11 + 5) % 100}%` }}
            />
          ))}

          <AnimatePresence>
            {hexes.map((h) => (
              <motion.button
                key={h.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                onPointerDown={() => handleTap(h.id)}
                className="absolute w-14 h-14 hex-clip bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center cursor-pointer"
                style={{
                  left: `calc(${h.x}% - 28px)`,
                  top: `calc(${h.y}% - 28px)`,
                  boxShadow: "0 0 20px rgba(245,158,11,0.6)",
                }}
              >
                <Zap className="h-5 w-5 text-white" />
              </motion.button>
            ))}
          </AnimatePresence>

          {/* Pulse hint when no hexes */}
          {hexes.length === 0 && game.gameState === "playing" && (
            <motion.div
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <p className="text-cosmic-muted text-sm">Get ready…</p>
            </motion.div>
          )}
        </div>

        <p className="text-xs text-cosmic-muted mt-3">Tap the glowing hexagons as fast as you can!</p>
      </div>

      <GameRewardDialog
        open={game.showReward}
        rewardHxco={game.rewardHxco}
        score={game.score}
        maxScore={20}
        gameName="Tap the Hex"
        onClose={() => { game.setShowReward(false); game.resetGame(); }}
        onPlayAgain={() => { game.setShowReward(false); handleStart(); }}
      />
    </GameAdGate>
  );
}
