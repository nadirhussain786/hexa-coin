"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tv2, Loader2, Play, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMiniGamePlaysToday } from "@/app/actions/playMiniGame";
import type { MiniGameType } from "@/app/actions/playMiniGame";
import { useUser } from "@/contexts/user-context";

const DAILY_LIMIT = 3;
const AD_DURATION_MS = 7000;
const RING_R = 44;
const RING_C = 2 * Math.PI * RING_R; // ≈ 276.46

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
  const [playsToday, setPlaysToday] = useState(0);
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
      }, 50);
    }, 1500);
  };

  const limitReached = playsToday >= DAILY_LIMIT;
  const playsLeft = DAILY_LIMIT - playsToday;
  const secondsLeft = Math.max(0, Math.ceil(((100 - adProgress) / 100) * (AD_DURATION_MS / 1000)));
  const ringOffset = RING_C * (1 - adProgress / 100);

  if (phase === "playing") return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] px-4">
      <AnimatePresence mode="wait">

        {/* ── IDLE ─────────────────────────────────── */}
        {phase === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="w-full max-w-sm"
          >
            <div
              className="relative rounded-3xl p-7 text-center overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #1A1438, #0D0A22)",
                border: "1px solid rgba(124,58,237,0.3)",
                boxShadow: "0 0 50px rgba(124,58,237,0.12), 0 24px 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* Ambient top glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-cosmic-accent/20 rounded-full blur-2xl -mt-6 pointer-events-none" />

              {/* Game icon with pulse rings */}
              <div className="relative w-24 h-24 mx-auto mb-6">
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-cosmic-accent/20 pulse-ring"
                />
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-cosmic-accent/12 pulse-ring-delay"
                />
                <motion.div
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="relative w-24 h-24 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #7C3AED, #A855F7)",
                    boxShadow: "0 0 30px rgba(124,58,237,0.6), 0 0 60px rgba(124,58,237,0.2)",
                  }}
                >
                  <Play className="h-10 w-10 text-white ml-1.5" />
                </motion.div>
              </div>

              <h2 className="text-2xl font-extrabold text-cosmic-text mb-1">{gameTitle}</h2>
              <p className="text-sm text-cosmic-muted mb-6 leading-relaxed">
                Watch a short ad to unlock your play session
              </p>

              {/* Play dots indicator */}
              <div className="flex justify-center gap-3 mb-3">
                {Array.from({ length: DAILY_LIMIT }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.05 * i, type: "spring", stiffness: 400 }}
                    className="relative flex items-center justify-center w-9 h-9 rounded-full"
                    style={
                      i < playsToday
                        ? { background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.14)" }
                        : {
                            background: "rgba(124,58,237,0.2)",
                            border: "2px solid #7C3AED",
                            boxShadow: "0 0 10px rgba(124,58,237,0.5)",
                          }
                    }
                  >
                    {i < playsToday ? (
                      <span className="text-[11px] text-cosmic-muted font-bold">✓</span>
                    ) : (
                      <span className="text-xs font-extrabold text-cosmic-accent">{i + 1}</span>
                    )}
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-cosmic-muted mb-6">
                {checkingPlays
                  ? "Checking plays…"
                  : limitReached
                  ? "Daily limit reached — come back tomorrow"
                  : `${playsLeft} play${playsLeft !== 1 ? "s" : ""} remaining today`}
              </p>

              {limitReached ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2.5 py-4 rounded-2xl"
                  style={{
                    background: "rgba(244,63,94,0.1)",
                    border: "1px solid rgba(244,63,94,0.25)",
                  }}
                >
                  <Lock className="h-4 w-4 text-cosmic-secondary" />
                  <span className="text-sm text-cosmic-secondary font-semibold">
                    Locked until tomorrow
                  </span>
                </motion.div>
              ) : (
                <Button
                  onClick={startAd}
                  disabled={checkingPlays}
                  className="w-full h-14 rounded-2xl font-extrabold text-white text-sm disabled:opacity-40"
                  style={{
                    background: "linear-gradient(135deg, #7C3AED, #A855F7)",
                    boxShadow: "0 0 24px rgba(124,58,237,0.45), 0 6px 18px rgba(0,0,0,0.35)",
                  }}
                >
                  <Tv2 className="h-4 w-4 mr-2" />
                  Watch Ad &amp; Play
                </Button>
              )}
            </div>
          </motion.div>
        )}

        {/* ── AD LOADING / WATCHING ─────────────────── */}
        {(phase === "loading-ad" || phase === "watching-ad") && (
          <motion.div
            key="ad"
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="w-full max-w-sm"
          >
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #1A1438, #0D0A22)",
                border: "1px solid rgba(124,58,237,0.28)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* Ad viewport */}
              <div
                className="relative h-56 flex items-center justify-center overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(168,85,247,0.1), rgba(6,182,212,0.12))",
                }}
              >
                {/* Ambient animated bg */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: [
                      "radial-gradient(circle at 25% 35%, rgba(124,58,237,0.22), transparent 60%)",
                      "radial-gradient(circle at 75% 65%, rgba(168,85,247,0.22), transparent 60%)",
                      "radial-gradient(circle at 25% 35%, rgba(124,58,237,0.22), transparent 60%)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />

                {phase === "loading-ad" ? (
                  <div className="text-center relative z-10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="h-12 w-12 text-cosmic-accent mx-auto" />
                    </motion.div>
                    <p className="text-sm text-cosmic-muted mt-3 font-medium">Loading ad…</p>
                  </div>
                ) : (
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    {/* SVG circular countdown ring */}
                    <div className="relative w-[112px] h-[112px]">
                      <svg
                        width="112"
                        height="112"
                        viewBox="0 0 112 112"
                        className="-rotate-90"
                      >
                        {/* Track */}
                        <circle
                          cx="56" cy="56" r={RING_R}
                          fill="none"
                          stroke="rgba(255,255,255,0.08)"
                          strokeWidth="5"
                        />
                        {/* Progress arc */}
                        <circle
                          cx="56" cy="56" r={RING_R}
                          fill="none"
                          stroke="url(#adRingGrad)"
                          strokeWidth="5"
                          strokeLinecap="round"
                          strokeDasharray={RING_C}
                          strokeDashoffset={ringOffset}
                          style={{ transition: "stroke-dashoffset 0.05s linear" }}
                        />
                        <defs>
                          <linearGradient id="adRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stopColor="#7C3AED" />
                            <stop offset="100%" stopColor="#06B6D4" />
                          </linearGradient>
                        </defs>
                      </svg>
                      {/* Center countdown */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <motion.span
                          key={secondsLeft}
                          initial={{ scale: 1.3, opacity: 0.7 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-3xl font-extrabold text-cosmic-text leading-none"
                        >
                          {secondsLeft}
                        </motion.span>
                        <span className="text-[10px] text-cosmic-muted font-medium mt-0.5">sec</span>
                      </div>
                    </div>
                    <Tv2 className="h-5 w-5 text-cosmic-accent/60" />
                  </div>
                )}

                {/* Bottom progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <motion.div
                    className="h-full rounded-r-full"
                    style={{
                      width: `${adProgress}%`,
                      background: "linear-gradient(90deg, #7C3AED, #06B6D4)",
                      transition: "width 0.05s linear",
                      boxShadow: "0 0 8px rgba(124,58,237,0.6)",
                    }}
                  />
                </div>
              </div>

              <div className="p-5 text-center">
                <p className="text-base font-bold text-cosmic-text mb-0.5">
                  {phase === "loading-ad" ? "Preparing your ad…" : "Ad playing"}
                </p>
                <p className="text-xs text-cosmic-muted">
                  {phase === "watching-ad"
                    ? secondsLeft > 0
                      ? `Game unlocks in ${secondsLeft}s`
                      : "Almost there…"
                    : "Please wait…"}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
