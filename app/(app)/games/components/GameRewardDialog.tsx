"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Diamond, Trophy, Frown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

/* ── Confetti helpers ─────────────────────────────── */
const CONFETTI_COLORS = [
  "#7C3AED", "#A855F7", "#F59E0B", "#FBBF24",
  "#06B6D4", "#F43F5E", "#10B981", "#38BDF8",
];
function generateConfetti(count = 30) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    x: `${5 + Math.random() * 90}%`,
    tx: `${(Math.random() - 0.5) * 130}px`,
    rot: `${(Math.random() - 0.5) * 400}deg`,
    dur: (0.75 + Math.random() * 0.65).toFixed(2),
    delay: (Math.random() * 0.45).toFixed(2),
    size: Math.floor(5 + Math.random() * 6),
    round: Math.random() > 0.55,
  }));
}
const CONFETTI_PIECES = generateConfetti(32);

/* ── Tier config ──────────────────────────────────── */
interface Tier {
  label: string;
  gradient: string;
  cardBg: string;
  border: string;
  glow: string;
  ring: string;
  btnBg: string;
  btnGlow: string;
}

function getTier(pct: number): Tier {
  if (pct >= 90) return {
    label: "Perfect! 🌟",
    gradient: "linear-gradient(135deg,#F59E0B,#FBBF24,#FDE68A)",
    cardBg:  "linear-gradient(160deg,rgba(80,50,0,0.55),rgba(17,13,42,0.95))",
    border:  "rgba(245,158,11,0.45)",
    glow:    "0 0 50px rgba(245,158,11,0.5), 0 0 100px rgba(245,158,11,0.2)",
    ring:    "rgba(245,158,11,0.55)",
    btnBg:   "linear-gradient(135deg,#F59E0B,#FBBF24)",
    btnGlow: "0 0 20px rgba(245,158,11,0.5)",
  };
  if (pct >= 70) return {
    label: "Great job! 🔥",
    gradient: "linear-gradient(135deg,#7C3AED,#A855F7,#C084FC)",
    cardBg:  "linear-gradient(160deg,rgba(50,20,100,0.55),rgba(17,13,42,0.95))",
    border:  "rgba(124,58,237,0.45)",
    glow:    "0 0 50px rgba(124,58,237,0.5), 0 0 100px rgba(124,58,237,0.2)",
    ring:    "rgba(124,58,237,0.55)",
    btnBg:   "linear-gradient(135deg,#7C3AED,#A855F7)",
    btnGlow: "0 0 20px rgba(124,58,237,0.5)",
  };
  if (pct >= 40) return {
    label: "Good try! 💪",
    gradient: "linear-gradient(135deg,#06B6D4,#38BDF8)",
    cardBg:  "linear-gradient(160deg,rgba(0,40,55,0.55),rgba(17,13,42,0.95))",
    border:  "rgba(6,182,212,0.4)",
    glow:    "0 0 50px rgba(6,182,212,0.4), 0 0 80px rgba(6,182,212,0.15)",
    ring:    "rgba(6,182,212,0.5)",
    btnBg:   "linear-gradient(135deg,#06B6D4,#38BDF8)",
    btnGlow: "0 0 20px rgba(6,182,212,0.4)",
  };
  return {
    label: "Better luck! 🎯",
    gradient: "linear-gradient(135deg,#374151,#6B7280)",
    cardBg:  "linear-gradient(160deg,rgba(20,20,30,0.6),rgba(17,13,42,0.95))",
    border:  "rgba(124,58,237,0.2)",
    glow:    "none",
    ring:    "rgba(107,114,128,0.4)",
    btnBg:   "linear-gradient(135deg,#374151,#4B5563)",
    btnGlow: "none",
  };
}

/* ── Component ────────────────────────────────────── */
interface GameRewardDialogProps {
  open: boolean;
  rewardHxco: number;
  score: number;
  maxScore: number;
  gameName: string;
  onClose: () => void;
  onPlayAgain?: () => void;
}

export function GameRewardDialog({
  open, rewardHxco, score, maxScore, gameName, onClose, onPlayAgain,
}: GameRewardDialogProps) {
  const won = rewardHxco > 0;
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const tier = getTier(pct);

  const [displayCount, setDisplayCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  /* Animated HXCO counter */
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (!open || !won) { setDisplayCount(0); return; }
    setDisplayCount(0);
    const target = rewardHxco;
    const startTime = performance.now();
    const duration = 1000;
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayCount(Math.round(eased * target));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [open, rewardHxco, won]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="p-0 border-0 overflow-hidden rounded-3xl max-w-[360px] w-[calc(100vw-32px)]"
        style={{
          background: tier.cardBg,
          border: `1px solid ${tier.border}`,
          boxShadow: `${tier.glow}, 0 30px 80px rgba(0,0,0,0.7)`,
        }}
      >
        <DialogTitle className="sr-only">{tier.label} — {gameName}</DialogTitle>

        {/* Confetti */}
        {won && open && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
            {CONFETTI_PIECES.map((c) => (
              <div
                key={c.id}
                style={{
                  position: "absolute",
                  left: c.x,
                  top: "30%",
                  width: c.size,
                  height: c.size,
                  backgroundColor: c.color,
                  borderRadius: c.round ? "50%" : "3px",
                  animation: `confetti-fall ${c.dur}s ${c.delay}s ease-out forwards`,
                  ["--tx" as string]: c.tx,
                  ["--rot" as string]: c.rot,
                }}
              />
            ))}
          </div>
        )}

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.78, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="relative flex flex-col items-center px-7 pt-9 pb-7"
            >
              {/* Trophy orb */}
              <div className="relative mb-5">
                {won && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: tier.ring }}
                      animate={{ scale: [1, 2.2, 2.2], opacity: [0.45, 0, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: tier.ring }}
                      animate={{ scale: [1, 2.7, 2.7], opacity: [0.3, 0, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, delay: 0.35 }}
                    />
                  </>
                )}
                <motion.div
                  initial={{ scale: 0, rotate: -25 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.1 }}
                  className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ background: tier.gradient, boxShadow: tier.glow }}
                >
                  {won
                    ? <Trophy className="h-11 w-11 text-white drop-shadow" />
                    : <Frown className="h-11 w-11 text-cosmic-muted/80" />}
                </motion.div>
              </div>

              {/* Tier label */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="text-2xl font-extrabold text-cosmic-text text-center leading-tight"
              >
                {tier.label}
              </motion.h2>
              <p className="text-sm text-cosmic-muted mt-1 mb-5">{gameName}</p>

              {/* Score */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.24, type: "spring", stiffness: 280, damping: 20 }}
                className="flex items-end gap-1.5 mb-5"
              >
                <span className="text-4xl font-extrabold text-cosmic-text leading-none">{score}</span>
                <span className="text-xl text-cosmic-muted mb-0.5 font-medium">/{maxScore}</span>
              </motion.div>

              {/* HXCO reward */}
              {won ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.32, type: "spring", stiffness: 250, damping: 18 }}
                  className="flex items-center gap-3 px-7 py-3.5 rounded-2xl mb-6"
                  style={{
                    background: "linear-gradient(135deg,rgba(245,158,11,0.15),rgba(245,158,11,0.08))",
                    border: "1px solid rgba(245,158,11,0.35)",
                    boxShadow: "0 0 22px rgba(245,158,11,0.22)",
                  }}
                >
                  <Diamond className="h-5 w-5 text-cosmic-gold flex-shrink-0" />
                  <span className="text-2xl font-extrabold text-gradient-gold">
                    +{displayCount} HXCO
                  </span>
                  {displayCount === rewardHxco && (
                    <Star
                      className="h-4 w-4 text-cosmic-gold"
                      style={{ animation: "spin 2.5s linear infinite" }}
                    />
                  )}
                </motion.div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.28 }}
                  className="text-sm text-cosmic-muted mb-6 text-center"
                >
                  No reward this time — try again!
                </motion.p>
              )}

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-3 w-full"
              >
                {onPlayAgain && (
                  <Button
                    variant="outline"
                    onClick={onPlayAgain}
                    className="flex-1 h-12 rounded-xl font-bold text-cosmic-accent border-cosmic-accent/30 hover:bg-cosmic-accent/12"
                  >
                    Play Again
                  </Button>
                )}
                <Button
                  onClick={onClose}
                  className="flex-1 h-12 rounded-xl font-bold text-white border-0"
                  style={{ background: tier.btnBg, boxShadow: tier.btnGlow }}
                >
                  Done ✓
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
