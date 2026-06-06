"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Share2, Copy, CheckCircle2, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/contexts/user-context";
import { createClient } from "@/utils/supabase/client";
import { fadeUp, staggerContainer } from "@/lib/animations";

const MAX_REFERRALS = 10;
const TON_PER_REFERRAL = 0.01;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://t.me/hexacoin_bot";

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

  return (
    <motion.div
      className="container px-4 py-6 space-y-5"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col items-center text-center mb-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cosmic-accent to-cosmic-highlight flex items-center justify-center mb-4 cosmic-glow">
          <Share2 className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
          Invite Friends
        </h1>
        <p className="text-cosmic-muted text-sm mt-1 max-w-xs">
          Earn {TON_PER_REFERRAL} TON for each friend who joins (up to {MAX_REFERRALS} referrals)
        </p>
      </motion.div>

      {/* Stats card */}
      <motion.div variants={fadeUp}>
        <Card className="border border-cosmic-accent/20 bg-cosmic-card/60 backdrop-blur-sm">
          <CardContent className="p-5">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cosmic-accent/20 flex items-center justify-center">
                  <Users className="h-4 w-4 text-cosmic-accent" />
                </div>
                <div>
                  <p className="text-xs text-cosmic-muted">Referrals</p>
                  <motion.p
                    key={referralCount}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-lg font-bold text-cosmic-text"
                  >
                    {isLoading ? "—" : referralCount}
                  </motion.p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cosmic-tertiary/20 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-cosmic-tertiary" />
                </div>
                <div>
                  <p className="text-xs text-cosmic-muted">TON Earned</p>
                  <p className="text-lg font-bold text-cosmic-tertiary">
                    {tonEarned.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-cosmic-muted">
                <span>Progress to max bonus</span>
                <span className="text-cosmic-accent">{referralCount}/{MAX_REFERRALS}</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-cosmic-muted">
                {referralCount >= MAX_REFERRALS
                  ? "Maximum referral bonus reached!"
                  : `Invite ${MAX_REFERRALS - referralCount} more to reach max bonus`}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Referral link */}
      <motion.div variants={fadeUp}>
        <Card className="border border-cosmic-accent/20 bg-cosmic-card/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-cosmic-text">Your Referral Link</CardTitle>
            <CardDescription className="text-cosmic-muted text-xs">
              Share this link with friends to earn rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={referralLink}
                readOnly
                className="bg-cosmic-bg border-cosmic-accent/20 text-cosmic-muted text-xs"
              />
              <Button
                onClick={copyToClipboard}
                size="sm"
                className="flex-shrink-0 bg-cosmic-accent/20 hover:bg-cosmic-accent/30 text-cosmic-accent border border-cosmic-accent/30 px-3"
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={shareOnTelegram}
                className="border-cosmic-accent/20 text-cosmic-muted hover:bg-cosmic-accent/10 hover:text-cosmic-text text-xs"
              >
                Share on Telegram
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareOnTwitter}
                className="border-cosmic-accent/20 text-cosmic-muted hover:bg-cosmic-accent/10 hover:text-cosmic-text text-xs"
              >
                Share on Twitter
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* How it works */}
      <motion.div variants={fadeUp}>
        <Card className="border border-cosmic-accent/20 bg-cosmic-card/60 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-cosmic-text">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { step: "1", title: "Share Your Link", desc: "Copy and share your unique referral link" },
              { step: "2", title: "Friend Joins", desc: "Your friend opens the app via your link" },
              { step: "3", title: "Earn TON", desc: `Get ${TON_PER_REFERRAL} TON per referral, up to ${MAX_REFERRALS * TON_PER_REFERRAL} TON` },
              { step: "4", title: "Withdraw", desc: "Withdraw your earned TON with 10 referrals" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-cosmic-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-cosmic-accent">{item.step}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-cosmic-text">{item.title}</p>
                  <p className="text-xs text-cosmic-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
