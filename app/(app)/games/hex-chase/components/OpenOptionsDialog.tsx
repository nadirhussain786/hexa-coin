"use client";

import { motion } from "framer-motion";
import { Clock, Tv2, Wallet, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import type { UserBalance } from "@/types";

interface OpenOptionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWatchAd: () => void;
  onPayWithTON: () => void;
  onCancel: () => void;
  userBalance: UserBalance;
  adViewCount: number;
  adViewsToday: number;
  adCooldown: number;
  tonCost: number;
  adsNeeded: number;
  walletConnected: boolean;
}

export function OpenOptionsDialog({
  open, onOpenChange, onWatchAd, onPayWithTON, onCancel,
  userBalance, adViewCount, adCooldown, tonCost, adsNeeded, walletConnected,
}: OpenOptionsDialogProps) {
  const tonBal = Number(userBalance.balance_ton ?? userBalance.ton ?? 0);
  const canAffordTon = tonBal >= tonCost;
  const adProgress = Math.min((adViewCount / adsNeeded) * 100, 100);
  const adsLeft = adsNeeded - adViewCount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-2xl max-w-sm mx-auto bg-gradient-to-br from-[#1A1438] to-[#0F0A1F] border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
            Open Hexagon
          </DialogTitle>
          <DialogDescription className="text-cosmic-muted text-sm">
            Choose how to reveal this hex tile
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Watch Ad option */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={adCooldown > 0 ? undefined : onWatchAd}
            disabled={adCooldown > 0}
            className={`w-full p-4 rounded-xl border text-left transition-all ${
              adCooldown > 0
                ? "border-white/5 bg-white/5 opacity-60 cursor-not-allowed"
                : "border-cosmic-accent/30 bg-cosmic-accent/10 hover:bg-cosmic-accent/20 cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-cosmic-accent/20 flex items-center justify-center flex-shrink-0">
                <Tv2 className="h-4 w-4 text-cosmic-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-cosmic-text">Watch Ad</p>
                  {adCooldown > 0 ? (
                    <span className="flex items-center gap-1 text-xs text-cosmic-muted">
                      <Clock className="h-3 w-3" /> {adCooldown}s
                    </span>
                  ) : (
                    <span className="text-xs text-cosmic-accent font-medium">
                      {adsLeft} more to go
                    </span>
                  )}
                </div>
                <p className="text-xs text-cosmic-muted">Free • Watch {adsNeeded} ads to open</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-400 rounded-full transition-all duration-500"
                style={{ width: `${adProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-cosmic-muted mt-1">
              <span>{adViewCount}/{adsNeeded} ads watched</span>
              {adProgress > 0 && <span className="text-yellow-400">Keep going!</span>}
            </div>
          </motion.button>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-cosmic-muted">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Pay TON option */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onPayWithTON}
            className={`w-full p-4 rounded-xl border text-left transition-all ${
              walletConnected && !canAffordTon
                ? "border-white/5 bg-white/5 opacity-60 cursor-not-allowed"
                : "border-cosmic-tertiary/30 bg-cosmic-tertiary/10 hover:bg-cosmic-tertiary/20 cursor-pointer"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cosmic-tertiary/20 flex items-center justify-center flex-shrink-0">
                <Wallet className="h-4 w-4 text-cosmic-tertiary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-cosmic-text">
                    Pay {tonCost} TON
                  </p>
                  {walletConnected ? (
                    <span className={`text-xs ${canAffordTon ? "text-cosmic-tertiary" : "text-cosmic-secondary"}`}>
                      {canAffordTon ? `${tonBal.toFixed(3)} available` : "Insufficient"}
                    </span>
                  ) : (
                    <span className="text-xs text-cosmic-accent">Connect wallet →</span>
                  )}
                </div>
                <p className="text-xs text-cosmic-muted">
                  {walletConnected ? "Instant open • Pays from your TON balance" : "Tap to connect your TON wallet"}
                </p>
              </div>
            </div>
          </motion.button>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onCancel}
            className="text-cosmic-muted hover:text-cosmic-text hover:bg-white/5 w-full"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
