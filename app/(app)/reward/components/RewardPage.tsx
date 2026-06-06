"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Diamond, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/contexts/user-context";
import { getWithdrawals } from "@/app/actions/getWithdrawals";
import { createClient } from "@/utils/supabase/client";
import { fadeUp, staggerContainer } from "@/lib/animations";
import WithdrawalForm from "./WithdrawalForm";
import WithdrawalHistoryList from "./WithdrawalHistory";
import type { WithdrawalHistory } from "@/types";

export default function RewardPage() {
  const { user, balance, refreshBalance } = useUser();
  const [history, setHistory] = useState<WithdrawalHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [referralCount, setReferralCount] = useState(0);
  const [lastWithdrawal, setLastWithdrawal] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    if (!user?.id) return;
    setIsLoadingHistory(true);
    const result = await getWithdrawals(user.id);
    if (result.success && result.data) {
      setHistory(result.data as WithdrawalHistory[]);
      const confirmed = (result.data as WithdrawalHistory[]).find((w) => (w.status as string) === "Completed");
      setLastWithdrawal(confirmed?.date ?? null);
    }
    setIsLoadingHistory(false);
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    loadHistory();
    // fetch referral count
    const supabase = createClient();
    supabase
      .from("user_referrals")
      .select("*", { count: "exact", head: true })
      .eq("referrer_id", user.id)
      .then(({ count }) => setReferralCount(count ?? 0));
  }, [user?.id, loadHistory]);

  const handleWithdrawalSuccess = async () => {
    await Promise.all([loadHistory(), refreshBalance()]);
  };

  const hxco = Number(balance?.balance_hxco ?? 0);
  const ton = Number(balance?.balance_ton ?? 0);

  return (
    <motion.div
      className="container px-4 py-6 space-y-5"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cosmic-accent to-cosmic-highlight flex items-center justify-center">
          <Wallet className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-cosmic-text">Rewards</h1>
          <p className="text-xs text-cosmic-muted">Withdraw your earned crypto</p>
        </div>
      </motion.div>

      {/* Balance summary */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
        <Card className="border border-cosmic-accent/20 bg-cosmic-card/60 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Diamond className="h-4 w-4 text-cosmic-accent" />
              <span className="text-xs text-cosmic-muted">HXCO</span>
            </div>
            <motion.p
              key={hxco}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xl font-bold text-gradient-gold"
            >
              {hxco.toLocaleString()}
            </motion.p>
          </CardContent>
        </Card>

        <Card className="border border-cosmic-tertiary/20 bg-cosmic-card/60 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Wallet className="h-4 w-4 text-cosmic-tertiary" />
              <span className="text-xs text-cosmic-muted">TON</span>
            </div>
            <motion.p
              key={ton}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xl font-bold text-cosmic-tertiary"
            >
              {ton.toFixed(4)}
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Withdrawal form */}
      <motion.div variants={fadeUp}>
        {user && balance ? (
          <WithdrawalForm
            userId={user.id}
            balance={balance}
            referralCount={referralCount}
            lastWithdrawalDate={lastWithdrawal}
            onSuccess={handleWithdrawalSuccess}
          />
        ) : (
          <div className="h-64 rounded-xl bg-cosmic-card/40 animate-pulse" />
        )}
      </motion.div>

      {/* Withdrawal history */}
      <motion.div variants={fadeUp}>
        <WithdrawalHistoryList history={history} isLoading={isLoadingHistory} />
      </motion.div>
    </motion.div>
  );
}
