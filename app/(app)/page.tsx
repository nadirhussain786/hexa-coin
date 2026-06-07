"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Diamond, Wallet, Zap, ChevronRight, TrendingUp, Hexagon } from "lucide-react";
import { useUser } from "@/contexts/user-context";
import { getRecentSessions } from "@/app/actions/recordHexOpen";
import { fadeUp, staggerContainer } from "@/lib/animations";
import type { GameSession } from "@/types";

const HEX_PARTICLES = [
  { x: "88%",  y: "6%",  size: 72,  opacity: 0.055, dur: 5.5, delay: 0 },
  { x: "3%",   y: "28%", size: 44,  opacity: 0.04,  dur: 7,   delay: 1.2 },
  { x: "92%",  y: "52%", size: 36,  opacity: 0.05,  dur: 6,   delay: 2 },
  { x: "12%",  y: "68%", size: 58,  opacity: 0.038, dur: 8,   delay: 0.6 },
  { x: "78%",  y: "82%", size: 32,  opacity: 0.055, dur: 5,   delay: 1.8 },
  { x: "48%",  y: "15%", size: 26,  opacity: 0.03,  dur: 9,   delay: 3 },
];

export default function HomePage() {
  const router = useRouter();
  const { user, balance, permission, isLoading } = useUser();
  const [recentSessions, setRecentSessions] = useState<GameSession[]>([]);

  useEffect(() => {
    if (user?.id) {
      getRecentSessions(user.id, 3).then((data) =>
        setRecentSessions(data as GameSession[])
      );
    }
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
            className="w-14 h-14 hex-clip bg-gradient-to-br from-cosmic-accent to-cosmic-highlight"
            style={{ boxShadow: "0 0 30px rgba(124,58,237,0.6)" }}
          />
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-cosmic-accent"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.22 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  const hxco = balance?.balance_hxco ?? 0;
  const ton = balance?.balance_ton ?? 0;
  const dailyLimit = permission?.daily_limit ?? 2;
  const greeting = user?.first_name ? `Hey, ${user.first_name} 👋` : "Welcome back 👋";

  return (
    <div className="relative">
      {/* Ambient hex particles */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {HEX_PARTICLES.map((h, i) => (
          <motion.div
            key={i}
            className="absolute hex-clip bg-cosmic-accent"
            style={{ left: h.x, top: h.y, width: h.size, height: h.size, opacity: h.opacity }}
            animate={{ y: [0, -14, 0], rotate: [0, 15, 0] }}
            transition={{ duration: h.dur, repeat: Infinity, ease: "easeInOut", delay: h.delay }}
          />
        ))}
      </div>

      <motion.div
        className="px-4 py-6 space-y-5 max-w-lg mx-auto"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Greeting */}
        <motion.div variants={fadeUp}>
          <p className="text-sm text-cosmic-muted font-medium">{greeting}</p>
          <h1 className="text-2xl font-extrabold text-gradient mt-0.5">Hexa Coin</h1>
        </motion.div>

        {/* Balance cards */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
          {/* HXCO */}
          <motion.div
            whileTap={{ scale: 0.96 }}
            className="relative rounded-2xl overflow-hidden shimmer-card"
            style={{
              background: "linear-gradient(135deg, #1E0A40 0%, #110D2A 100%)",
              border: "1px solid rgba(245,158,11,0.28)",
              boxShadow: "0 0 24px rgba(245,158,11,0.08), inset 0 1px 0 rgba(245,158,11,0.08)",
            }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-cosmic-gold/20 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
            <div className="relative p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #F59E0B, #FBBF24)",
                    boxShadow: "0 0 10px rgba(245,158,11,0.55)",
                  }}
                >
                  <Diamond className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-[11px] text-cosmic-muted font-medium">HXCO Balance</span>
              </div>
              <motion.p
                key={Number(hxco)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-extrabold text-gradient-gold leading-none"
              >
                {Number(hxco).toLocaleString()}
              </motion.p>
              <p className="text-[10px] text-cosmic-muted mt-1.5 font-semibold tracking-wide">HXCO</p>
            </div>
          </motion.div>

          {/* TON */}
          <motion.div
            whileTap={{ scale: 0.96 }}
            className="relative rounded-2xl overflow-hidden shimmer-card"
            style={{
              background: "linear-gradient(135deg, #051628 0%, #060E1E 100%)",
              border: "1px solid rgba(6,182,212,0.28)",
              boxShadow: "0 0 24px rgba(6,182,212,0.08), inset 0 1px 0 rgba(6,182,212,0.08)",
            }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-cosmic-tertiary/20 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
            <div className="relative p-4">
              <div className="flex items-center gap-2 mb-2.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #06B6D4, #38BDF8)",
                    boxShadow: "0 0 10px rgba(6,182,212,0.55)",
                  }}
                >
                  <Wallet className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-[11px] text-cosmic-muted font-medium">TON Balance</span>
              </div>
              <motion.p
                key={Number(ton)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-extrabold text-gradient-cyan leading-none"
              >
                {Number(ton).toFixed(4)}
              </motion.p>
              <p className="text-[10px] text-cosmic-muted mt-1.5 font-semibold tracking-wide">TON</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick stats strip */}
        <motion.div variants={fadeUp} className="grid grid-cols-3 gap-2">
          {[
            { label: "Games",    value: "11",  icon: "🎮", accent: "rgba(124,58,237,0.25)"  },
            { label: "Max/Play", value: "50",  icon: "💎", accent: "rgba(245,158,11,0.25)"  },
            { label: "Daily",    value: "3×",  icon: "⚡", accent: "rgba(6,182,212,0.25)"   },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-2.5 text-center"
              style={{ background: s.accent, border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="text-base">{s.icon}</span>
              <p className="text-sm font-extrabold text-cosmic-text mt-0.5 leading-none">{s.value}</p>
              <p className="text-[9px] text-cosmic-muted uppercase tracking-wider mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Hex Chase flagship card */}
        <motion.div variants={fadeUp}>
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
                boxShadow: "0 0 40px rgba(124,58,237,0.14), 0 10px 40px rgba(0,0,0,0.5)",
              }}
            >
              {/* Glow orbs */}
              <div className="absolute top-0 right-0 w-56 h-56 bg-cosmic-accent/14 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-cosmic-highlight/10 rounded-full blur-2xl -ml-12 -mb-12 pointer-events-none" />
              {/* Animated particle dots */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-cosmic-accent/30"
                    style={{ width: 3, height: 3, left: `${10 + i * 11}%`, top: `${25 + (i % 3) * 22}%` }}
                    animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.8, 1.4, 0.8] }}
                    transition={{ duration: 1.8 + i * 0.35, repeat: Infinity, delay: i * 0.28 }}
                  />
                ))}
              </div>

              <div className="relative p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-3">
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-cosmic-accent/20 text-cosmic-highlight border border-cosmic-accent/30 uppercase tracking-wider mb-2">
                      Flagship Game
                    </span>
                    <h2 className="text-[22px] font-extrabold text-cosmic-text leading-tight">
                      Hex Chase
                    </h2>
                    <p className="text-sm text-cosmic-muted mt-0.5 leading-snug">
                      Open hex tiles to earn HXCO &amp; TON rewards
                    </p>
                  </div>

                  {/* Animated hex icon */}
                  <div className="relative flex-shrink-0 w-16 h-16">
                    <motion.div
                      animate={{ rotate: [0, 8, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                      className="w-16 h-16 hex-clip bg-gradient-to-br from-cosmic-accent to-cosmic-highlight flex items-center justify-center"
                      style={{ boxShadow: "0 0 28px rgba(124,58,237,0.65), 0 0 55px rgba(124,58,237,0.22)" }}
                    >
                      <Hexagon className="h-7 w-7 text-white" />
                    </motion.div>
                    {/* Orbiting gold dot */}
                    <motion.div
                      className="absolute w-3 h-3 rounded-full bg-cosmic-gold"
                      style={{
                        top: 0,
                        left: "50%",
                        marginLeft: -6,
                        transformOrigin: "6px 38px",
                        boxShadow: "0 0 7px rgba(245,158,11,0.9)",
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                </div>

                {/* Daily limit */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-cosmic-muted">Daily Opens Available</span>
                    <span className="text-cosmic-accent font-bold">{dailyLimit} opens/day</span>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.3, delay: 0.4, ease: "easeOut" }}
                      style={{ boxShadow: "0 0 8px rgba(124,58,237,0.7)" }}
                    />
                  </div>
                </div>

                <div
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-white text-sm"
                  style={{
                    background: "linear-gradient(135deg, #7C3AED, #A855F7)",
                    boxShadow: "0 0 22px rgba(124,58,237,0.45), 0 4px 14px rgba(0,0,0,0.35)",
                  }}
                >
                  <Zap className="h-4 w-4" />
                  Play Now
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* Recent rewards */}
        {recentSessions.length > 0 && (
          <motion.div variants={fadeUp}>
            <div className="flex items-center gap-2 mb-3 px-1">
              <TrendingUp className="h-3.5 w-3.5 text-cosmic-accent" />
              <h3 className="text-xs font-bold text-cosmic-muted uppercase tracking-wider">
                Recent Rewards
              </h3>
            </div>
            <div className="space-y-2">
              {recentSessions.map((session, i) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 25 }}
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(26,20,56,0.75), rgba(17,13,42,0.55))",
                    border: "1px solid rgba(124,58,237,0.12)",
                  }}
                >
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 hex-clip flex items-center justify-center ${
                          session.reward_type === "HXCO"
                            ? "bg-gradient-to-br from-cosmic-accent to-cosmic-highlight"
                            : session.reward_type === "TON"
                            ? "bg-gradient-to-br from-cosmic-tertiary to-blue-400"
                            : "bg-cosmic-surface"
                        }`}
                      >
                        {session.reward_type === "HXCO" && <Diamond className="h-3.5 w-3.5 text-white" />}
                        {session.reward_type === "TON" && <span className="text-white font-extrabold text-xs">T</span>}
                        {session.reward_type === "Empty" && <span className="text-cosmic-muted text-lg leading-none">—</span>}
                        {session.reward_type === "Free Hex" && <span className="text-cosmic-tertiary text-sm">★</span>}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-cosmic-text">{session.reward_type}</p>
                        <p className="text-xs text-cosmic-muted">
                          {new Date(session.opened_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    {Number(session.reward_value) > 0 && (
                      <span
                        className={`text-sm font-bold ${
                          session.reward_type === "TON"
                            ? "text-gradient-cyan"
                            : "text-gradient-gold"
                        }`}
                      >
                        +{session.reward_value} {session.reward_type}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
