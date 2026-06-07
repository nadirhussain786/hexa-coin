"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Share2, Copy, CheckCircle2, Users, TrendingUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/user-context";
import { createClient } from "@/utils/supabase/client";
import { fadeUp, staggerContainer } from "@/lib/animations";

const MAX_REFERRALS = 10;
const TON_PER_REFERRAL = 0.01;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://t.me/hexacoin_bot";

const HOW_IT_WORKS = [
  { step: "1", title: "Share Your Link", desc: "Copy and share your unique referral link with friends", icon: "📤" },
  { step: "2", title: "Friend Joins",    desc: "Your friend opens the app via your link",             icon: "👋" },
  { step: "3", title: "Earn TON",        desc: `Get ${TON_PER_REFERRAL} TON per friend, up to ${MAX_REFERRALS * TON_PER_REFERRAL} TON`, icon: "💰" },
  { step: "4", title: "Withdraw",        desc: "Withdraw your earned TON with 10+ referrals",        icon: "🏦" },
];

export default function InvitePage() {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const referralCode = user?.referral_code ?? "";
  const referralLink = referralCode ? `${APP_URL}?start=${referralCode}` : "";

  useEffect(() => {
    async function fetchReferrals() {
      if (!user?.id) return;
      const supabase = createClient();
      const { count } = await supabase
        .from("user_referrals")
        .select("*", { count: "exact", head: true })
        .eq("referrer_id", user.id);
      setReferralCount(count ?? 0);
      setIsLoading(false);
    }
    fetchReferrals();
  }, [user?.id]);

  const copyToClipboard = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnTelegram = () => {
    const text = encodeURIComponent(`🎮 Join me on Hexa Coin and earn crypto rewards!\n\n${referralLink}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${text}`, "_blank");
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Join me on Hexa Coin and earn crypto rewards! ${referralLink}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const progress = Math.min((referralCount / MAX_REFERRALS) * 100, 100);
  const tonEarned = Math.min(referralCount * TON_PER_REFERRAL, MAX_REFERRALS * TON_PER_REFERRAL);
  const RING_R = 32;
  const RING_C = 2 * Math.PI * RING_R;
  const ringOffset = RING_C * (1 - progress / 100);

  return (
    <motion.div
      className="px-4 py-6 max-w-lg mx-auto space-y-5"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Hero */}
      <motion.div variants={fadeUp} className="relative rounded-3xl overflow-hidden text-center py-8 px-5">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg,#1A1438,#0D0A22)",
            border: "1px solid rgba(124,58,237,0.3)",
          }}
        />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-52 h-28 bg-cosmic-accent/18 rounded-full blur-3xl -mt-8" />
        </div>

        <div className="relative">
          {/* Icon with rings */}
          <div className="relative w-20 h-20 mx-auto mb-5">
            <motion.div
              className="absolute inset-0 rounded-2xl bg-cosmic-accent/20 pulse-ring"
            />
            <motion.div
              className="absolute inset-0 rounded-2xl bg-cosmic-accent/12 pulse-ring-delay"
            />
            <div
              className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg,#7C3AED,#A855F7)",
                boxShadow: "0 0 28px rgba(124,58,237,0.6)",
              }}
            >
              <Share2 className="h-8 w-8 text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-gradient mb-2">Invite Friends</h1>
          <p className="text-sm text-cosmic-muted max-w-xs mx-auto leading-relaxed">
            Earn {TON_PER_REFERRAL} TON for every friend who joins — up to {MAX_REFERRALS} referrals
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp}>
        <div
          className="relative rounded-2xl p-5 overflow-hidden"
          style={{
            background: "linear-gradient(135deg,rgba(26,20,56,0.9),rgba(17,13,42,0.8))",
            border: "1px solid rgba(124,58,237,0.22)",
            boxShadow: "0 0 30px rgba(124,58,237,0.08)",
          }}
        >
          <div className="flex items-center gap-5">
            {/* SVG Progress ring */}
            <div className="relative flex-shrink-0 w-[80px] h-[80px]">
              <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
                <circle cx="40" cy="40" r={RING_R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
                <circle
                  cx="40" cy="40" r={RING_R}
                  fill="none"
                  stroke="url(#inviteRingGrad)"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={RING_C}
                  strokeDashoffset={ringOffset}
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
                <defs>
                  <linearGradient id="inviteRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  key={referralCount}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-xl font-extrabold text-cosmic-text leading-none"
                >
                  {isLoading ? "—" : referralCount}
                </motion.span>
                <span className="text-[9px] text-cosmic-muted">/{MAX_REFERRALS}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(124,58,237,0.2)" }}
                >
                  <Users className="h-4 w-4 text-cosmic-accent" />
                </div>
                <div>
                  <p className="text-[10px] text-cosmic-muted">Total Referrals</p>
                  <p className="text-base font-extrabold text-cosmic-text leading-none">
                    {isLoading ? "…" : `${referralCount} friend${referralCount !== 1 ? "s" : ""}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(6,182,212,0.2)" }}
                >
                  <TrendingUp className="h-4 w-4 text-cosmic-tertiary" />
                </div>
                <div>
                  <p className="text-[10px] text-cosmic-muted">TON Earned</p>
                  <p className="text-base font-extrabold text-gradient-cyan leading-none">
                    {tonEarned.toFixed(2)} TON
                  </p>
                </div>
              </div>
            </div>
          </div>

          {referralCount >= MAX_REFERRALS && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl"
              style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}
            >
              <span className="text-sm font-bold text-emerald-400">🎉 Maximum bonus reached!</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Referral link */}
      <motion.div variants={fadeUp}>
        <div
          className="rounded-2xl p-5"
          style={{
            background: "linear-gradient(135deg,rgba(26,20,56,0.9),rgba(17,13,42,0.8))",
            border: "1px solid rgba(124,58,237,0.22)",
          }}
        >
          <h2 className="text-sm font-extrabold text-cosmic-text mb-1">Your Referral Link</h2>
          <p className="text-xs text-cosmic-muted mb-4">Share this link to earn TON rewards</p>

          <div className="flex gap-2 mb-3">
            <Input
              value={referralLink || "Loading your link…"}
              readOnly
              className="bg-cosmic-bg/80 border-cosmic-accent/20 text-cosmic-muted text-xs h-10"
            />
            <Button
              onClick={copyToClipboard}
              size="sm"
              className="h-10 px-3 flex-shrink-0 border-0"
              style={{
                background: copied
                  ? "linear-gradient(135deg,#10B981,#34D399)"
                  : "linear-gradient(135deg,rgba(124,58,237,0.3),rgba(124,58,237,0.2))",
                border: "1px solid rgba(124,58,237,0.35)",
                boxShadow: "0 0 10px rgba(124,58,237,0.2)",
              }}
            >
              {copied
                ? <CheckCircle2 className="h-4 w-4 text-white" />
                : <Copy className="h-4 w-4 text-cosmic-accent" />}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={shareOnTelegram}
              className="h-10 text-xs font-bold border-cosmic-accent/20 text-cosmic-muted hover:text-white hover:bg-cosmic-accent/12"
            >
              <Send className="h-3.5 w-3.5 mr-1.5 text-cosmic-tertiary" />
              Telegram
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareOnTwitter}
              className="h-10 text-xs font-bold border-cosmic-accent/20 text-cosmic-muted hover:text-white hover:bg-cosmic-accent/12"
            >
              <Share2 className="h-3.5 w-3.5 mr-1.5 text-cosmic-highlight" />
              Twitter / X
            </Button>
          </div>
        </div>
      </motion.div>

      {/* How it works */}
      <motion.div variants={fadeUp}>
        <div
          className="rounded-2xl p-5"
          style={{
            background: "linear-gradient(135deg,rgba(26,20,56,0.9),rgba(17,13,42,0.8))",
            border: "1px solid rgba(124,58,237,0.18)",
          }}
        >
          <h2 className="text-sm font-extrabold text-cosmic-text mb-4">How It Works</h2>
          <div className="space-y-3.5">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-start gap-3"
              >
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-base"
                  style={{
                    background: "linear-gradient(135deg,rgba(124,58,237,0.22),rgba(124,58,237,0.1))",
                    border: "1px solid rgba(124,58,237,0.25)",
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-cosmic-text leading-tight">{item.title}</p>
                  <p className="text-xs text-cosmic-muted mt-0.5 leading-snug">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
