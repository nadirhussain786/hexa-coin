"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Diamond, Wallet, Hexagon, ChevronRight, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/user-context";
import { getRecentSessions } from "@/app/actions/recordHexOpen";
import { fadeUp, staggerContainer } from "@/lib/animations";
import type { GameSession } from "@/types";

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 hex-clip bg-gradient-to-br from-cosmic-accent to-cosmic-highlight animate-pulse" />
          <p className="text-cosmic-muted text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const hxco = balance?.balance_hxco ?? 0;
  const ton = balance?.balance_ton ?? 0;
  const dailyLimit = permission?.daily_limit ?? 2;

  return (
    <motion.div
      className="container px-4 py-6 space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Balance cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
        <Card className="border border-cosmic-gold/20 bg-cosmic-card/60 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cosmic-gold to-[#FBBF24] flex items-center justify-center">
                <Diamond className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-xs text-cosmic-muted">HXCO Balance</span>
            </div>
            <motion.p
              key={hxco}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold text-gradient-gold"
            >
              {Number(hxco).toLocaleString()}
            </motion.p>
            <p className="text-xs text-cosmic-muted mt-0.5">HXCO</p>
          </CardContent>
        </Card>

        <Card className="border border-cosmic-tertiary/20 bg-cosmic-card/60 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cosmic-tertiary to-blue-400 flex items-center justify-center">
                <Wallet className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-xs text-cosmic-muted">TON Balance</span>
            </div>
            <motion.p
              key={ton}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold text-cosmic-tertiary"
            >
              {Number(ton).toFixed(4)}
            </motion.p>
            <p className="text-xs text-cosmic-muted mt-0.5">TON</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Hex Chase game card */}
      <motion.div variants={fadeUp}>
        <Card className="border border-cosmic-accent/30 bg-gradient-to-br from-cosmic-card to-cosmic-bg overflow-hidden relative">
          {/* Glowing orb */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-cosmic-accent/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

          <CardContent className="p-6 relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-cosmic-text mb-1">Hex Chase</h2>
                <p className="text-sm text-cosmic-muted">
                  Open hex tiles to earn HXCO & TON rewards
                </p>
              </div>
              {/* Animated hex icon */}
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-14 h-14 hex-clip bg-gradient-to-br from-cosmic-accent to-cosmic-highlight flex items-center justify-center shadow-lg cosmic-glow"
              >
                <Hexagon className="h-6 w-6 text-white" />
              </motion.div>
            </div>

            {/* Daily opens counter */}
            <div className="mb-5">
              <div className="flex justify-between text-xs text-cosmic-muted mb-1.5">
                <span>Daily Opens Available</span>
                <span className="text-cosmic-accent font-semibold">{dailyLimit} opens/day</span>
              </div>
              <div className="h-1.5 bg-cosmic-bg rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </div>

            <Button
              onClick={() => router.push("/games/hex-chase")}
              className="w-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:opacity-90 text-white font-semibold py-5 rounded-xl transition-all duration-200 cosmic-glow"
            >
              <Zap className="h-4 w-4 mr-2" />
              Play Now
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent rewards */}
      {recentSessions.length > 0 && (
        <motion.div variants={fadeUp}>
          <h3 className="text-sm font-semibold text-cosmic-muted mb-3 px-1">Recent Rewards</h3>
          <div className="space-y-2">
            {recentSessions.map((session, i) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="border border-cosmic-accent/10 bg-cosmic-card/40 backdrop-blur-sm">
                  <CardContent className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 hex-clip flex items-center justify-center text-xs font-bold ${
                          session.reward_type === "HXCO"
                            ? "bg-gradient-to-br from-cosmic-accent to-cosmic-highlight"
                            : session.reward_type === "TON"
                            ? "bg-gradient-to-br from-cosmic-tertiary to-blue-400"
                            : "bg-cosmic-card border border-cosmic-accent/20"
                        }`}
                      >
                        {session.reward_type === "HXCO" && <Diamond className="h-3 w-3 text-white" />}
                        {session.reward_type === "TON" && <span className="text-white">T</span>}
                        {session.reward_type === "Empty" && <span className="text-cosmic-muted">—</span>}
                        {session.reward_type === "Free Hex" && <span className="text-cosmic-tertiary">★</span>}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-cosmic-text">{session.reward_type}</p>
                        <p className="text-xs text-cosmic-muted">
                          {new Date(session.opened_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                    {Number(session.reward_value) > 0 && (
                      <span
                        className={`text-sm font-bold ${
                          session.reward_type === "TON" ? "text-cosmic-tertiary" : "text-cosmic-accent"
                        }`}
                      >
                        +{session.reward_value} {session.reward_type}
                      </span>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
