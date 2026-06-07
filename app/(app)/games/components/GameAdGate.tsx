"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tv2, Loader2, Play, Lock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMiniGamePlaysToday } from "@/app/actions/playMiniGame";
import type { MiniGameType } from "@/app/actions/playMiniGame";
import { useUser } from "@/contexts/user-context";

const DAILY_LIMIT = 3;
const AD_DURATION_MS = 7000;

interface GameAdGateProps {
  gameType: MiniGameType;
  gameTitle: string;
  onAdComplete: () => void;
  children: React.ReactNode;
}

type Phase = "idle" | "loading-ad" | "watching-ad" | "playing";

export function GameAdGate({ gameType, gameTitle, onAdComplete, children }: GameAdGateProps) {
  const { user } = useUser();
  const [phase, setPhase] = useState<Phase>("idle");
  const [playsToday, setPlaysToday] = useState<number>(0);
  const [adProgress, setAdProgress] = useState(0);
  const [checkingPlays, setCheckingPlays] = useState(true);

  const loadPlays = useCallback(async () => {
    if (!user?.id) return;
    setCheckingPlays(true);
    const count = await getMiniGamePlaysToday(user.id, gameType);
    setPlaysToday(count);
    setCheckingPlays(false);
  }, [user?.id, gameType]);

  useEffect(() => { loadPlays(); }, [loadPlays]);

  const startAd = () => {
    setPhase("loading-ad");
    setAdProgress(0);
    setTimeout(() => {
      setPhase("watching-ad");
      const start = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - start;
        const pct = Math.min((elapsed / AD_DURATION_MS) * 100, 100);
        setAdProgress(pct);
        if (pct >= 100) {
          clearInterval(interval);
          setPhase("playing");
          onAdComplete();
        }
      }, 100);
    }, 1500);
  };

  const limitReached = playsToday >= DAILY_LIMIT;
  const playsLeft = DAILY_LIMIT - playsToday;

  if (phase === "playing") return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm"
          >
            <div className="bg-gradient-to-br from-cosmic-surface to-cosmic-card border border-cosmic-border/50 rounded-2xl p-6 text-center">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cosmic-accent to-cosmic-highlight flex items-center justify-center mx-auto mb-4 cosmic-glow"
              >
                <Play className="h-7 w-7 text-white ml-1" />
              </motion.div>

              <h2 className="text-xl font-bold text-cosmic-text mb-1">{gameTitle}</h2>
              <p className="text-sm text-cosmic-muted mb-5">
                Watch a short ad to unlock your game play
              </p>

              {/* Plays remaining */}
              <div className="flex justify-center gap-2 mb-5">
                {Array.from({ length: DAILY_LIMIT }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-2 rounded-full transition-all ${
                      i < playsToday ? "bg-cosmic-muted/30" : "bg-gradient-to-r from-cosmic-accent to-cosmic-highlight"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-cosmic-muted mb-5">
                {checkingPlays ? "Checking plays…" : limitReached
                  ? "Daily limit reached — come back tomorrow"
                  : `${playsLeft} play${playsLeft !== 1 ? "s" : ""} remaining today`}
              </p>

              {limitReached ? (
                <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-cosmic-secondary/10 border border-cosmic-secondary/20">
                  <Lock className="h-4 w-4 text-cosmic-secondary" />
                  <span className="text-sm text-cosmic-secondary font-medium">Locked until tomorrow</span>
                </div>
              ) : (
                <Button
                  onClick={startAd}
                  disabled={checkingPlays}
                  className="w-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight text-white font-semibold py-5 rounded-xl cosmic-glow"
                >
                  <Tv2 className="h-4 w-4 mr-2" />
                  Watch Ad & Play
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {(phase === "loading-ad" || phase === "watching-ad") && (
          <motion.div
            key="ad"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm"
          >
            <div className="bg-gradient-to-br from-cosmic-surface to-cosmic-card border border-cosmic-border/50 rounded-2xl overflow-hidden">
              {/* Ad area */}
              <div className="h-44 bg-gradient-to-br from-cosmic-accent/20 to-cosmic-secondary/10 flex items-center justify-center relative">
                {phase === "loading-ad" ? (
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 text-cosmic-accent animate-spin mx-auto mb-2" />
                    <p className="text-xs text-cosmic-muted">Loading ad…</p>
                  </div>
                ) : (
                  <div className="text-center px-4">
                    <Tv2 className="h-10 w-10 text-cosmic-accent mx-auto mb-2 opacity-60" />
                    <p className="text-xs text-cosmic-muted">Advertisement</p>
                    <p className="text-[10px] text-cosmic-muted/60 mt-1">Closes automatically</p>
                  </div>
                )}
                {/* Progress overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight transition-all duration-100"
                    style={{ width: `${adProgress}%` }}
                  />
                </div>
              </div>
              <div className="p-4 text-center">
                <p className="text-sm font-semibold text-cosmic-text mb-1">
                  {phase === "loading-ad" ? "Preparing ad…" : "Watch to unlock"}
                </p>
                <p className="text-xs text-cosmic-muted">
                  {Math.ceil(((100 - adProgress) / 100) * (AD_DURATION_MS / 1000))}s remaining
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
