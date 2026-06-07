"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Diamond, Wallet, TrendingUp } from "lucide-react";
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
      const confirmed = (result.data as WithdrawalHistory[]).find(
        (w) => (w.status as string) === "Completed"
      );
      setLastWithdrawal(confirmed?.date ?? null);
    }
    setIsLoadingHistory(false);
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    loadHistory();
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
      className="px-4 py-6 max-w-lg mx-auto space-y-5"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-1">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg,#7C3AED,#A855F7)",
            boxShadow: "0 0 16px rgba(124,58,237,0.5)",
          }}
        >
          <Wallet className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-cosmic-text">Rewards</h1>
          <p className="text-xs text-cosmic-muted">Withdraw your earned crypto</p>
        </div>
      </motion.div>

      {/* Balance cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
        {/* HXCO */}
        <div
          className="relative rounded-2xl overflow-hidden shimmer-card"
          style={{
            background: "linear-gradient(135deg,#1E0A40,#110D2A)",
            border: "1px solid rgba(245,158,11,0.28)",
            boxShadow: "0 0 22px rgba(245,158,11,0.08)",
          }}
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-cosmic-gold/20 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
          <div className="relative p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <Diamond className="h-3.5 w-3.5 text-cosmic-gold" />
              <span className="text-[11px] text-cosmic-muted font-medium">HXCO</span>
            </div>
            <motion.p
              key={hxco}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-2xl font-extrabold text-gradient-gold leading-none"
            >
              {hxco.toLocaleString()}
            </motion.p>
          </div>
        </div>

        {/* TON */}
        <div
          className="relative rounded-2xl overflow-hidden shimmer-card"
          style={{
            background: "linear-gradient(135deg,#051628,#060E1E)",
            border: "1px solid rgba(6,182,212,0.28)",
            boxShadow: "0 0 22px rgba(6,182,212,0.08)",
          }}
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-cosmic-tertiary/20 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
          <div className="relative p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <Wallet className="h-3.5 w-3.5 text-cosmic-tertiary" />
              <span className="text-[11px] text-cosmic-muted font-medium">TON</span>
            </div>
            <motion.p
              key={ton}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-2xl font-extrabold text-gradient-cyan leading-none"
            >
              {ton.toFixed(4)}
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Referral gate info strip */}
      <motion.div variants={fadeUp}>
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            background: "linear-gradient(135deg,rgba(124,58,237,0.12),rgba(124,58,237,0.06))",
            border: "1px solid rgba(124,58,237,0.2)",
          }}
        >
          <TrendingUp className="h-4 w-4 text-cosmic-accent flex-shrink-0" />
          <p className="text-xs text-cosmic-muted">
            Withdrawal requires{" "}
            <span className="text-cosmic-accent font-bold">10 referrals</span>
            {referralCount > 0 && (
              <> — you have <span className="text-cosmic-highlight font-bold">{referralCount}</span></>
            )}
          </p>
        </div>
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
          <div
            className="h-64 rounded-2xl"
            style={{
              background: "linear-gradient(135deg,rgba(26,20,56,0.6),rgba(17,13,42,0.4))",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
        )}
      </motion.div>

      {/* Withdrawal history */}
      <motion.div variants={fadeUp}>
        <WithdrawalHistoryList history={history} isLoading={isLoadingHistory} />
      </motion.div>
    </motion.div>
  );
}
