"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle2, XCircle, Loader2, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { staggerContainer, listItem } from "@/lib/animations";
import type { WithdrawalHistory } from "@/types";

const statusConfig = {
  Completed: { icon: CheckCircle2, color: "text-green-400", badge: "bg-green-500/10 text-green-400 border-green-500/30" },
  Pending: { icon: Clock, color: "text-yellow-400", badge: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" },
  Processing: { icon: Loader2, color: "text-cosmic-tertiary", badge: "bg-cosmic-tertiary/10 text-cosmic-tertiary border-cosmic-tertiary/30" },
  Failed: { icon: XCircle, color: "text-cosmic-secondary", badge: "bg-cosmic-secondary/10 text-cosmic-secondary border-cosmic-secondary/30" },
  Rejected: { icon: XCircle, color: "text-cosmic-secondary", badge: "bg-cosmic-secondary/10 text-cosmic-secondary border-cosmic-secondary/30" },
};

interface Props {
  history: WithdrawalHistory[];
  isLoading: boolean;
}

export default function WithdrawalHistoryList({ history, isLoading }: Props) {
  if (isLoading) {
    return (
      <Card className="border border-cosmic-accent/20 bg-cosmic-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-cosmic-text text-base">Withdrawal History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-cosmic-bg/60 animate-pulse" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-cosmic-accent/20 bg-cosmic-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-cosmic-text text-base">Withdrawal History</CardTitle>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8">
            <ArrowUpRight className="h-10 w-10 text-cosmic-accent/30 mx-auto mb-3" />
            <p className="text-cosmic-muted text-sm">No withdrawals yet</p>
          </div>
        ) : (
          <motion.div
            className="space-y-2"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {history.map((item) => {
              const cfg = statusConfig[item.status as keyof typeof statusConfig] ?? statusConfig.Pending;
              const StatusIcon = cfg.icon;
              const isProcessing = (item.status as string) === "Processing";

              return (
                <motion.div key={item.id} variants={listItem}>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-cosmic-bg/40 border border-cosmic-accent/10">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-cosmic-card flex items-center justify-center ${cfg.color}`}>
                      <StatusIcon className={`h-4 w-4 ${isProcessing ? "animate-spin" : ""}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-cosmic-text">
                          {item.amount.toFixed(item.currency === "HXCO" ? 0 : 4)} {item.currency}
                        </span>
                        <Badge className={`text-[10px] px-1.5 py-0 ${cfg.badge} border`}>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-cosmic-muted truncate">
                        {item.address.slice(0, 10)}...{item.address.slice(-8)}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-cosmic-muted">
                        {new Date(item.date).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </p>
                      {item.txHash && (
                        <a
                          href={`https://tonscan.org/tx/${item.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-cosmic-tertiary flex items-center gap-0.5 justify-end hover:underline"
                        >
                          TX <ArrowUpRight className="h-2.5 w-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
