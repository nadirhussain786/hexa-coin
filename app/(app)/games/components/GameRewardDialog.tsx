"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Diamond, Trophy, Frown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

  const tier =
    pct >= 90 ? { label: "Perfect!", color: "from-cosmic-gold to-[#FBBF24]", shadow: "0 0 30px rgba(245,158,11,0.6)" } :
    pct >= 70 ? { label: "Great job!", color: "from-cosmic-accent to-cosmic-highlight", shadow: "0 0 30px rgba(124,58,237,0.6)" } :
    pct >= 40 ? { label: "Good try!", color: "from-cosmic-tertiary to-[#38BDF8]", shadow: "0 0 30px rgba(6,182,212,0.5)" } :
    { label: "Better luck next time!", color: "from-cosmic-muted to-cosmic-surface2", shadow: "none" };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto bg-gradient-to-br from-cosmic-card to-cosmic-bg border border-cosmic-border/50">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-cosmic-text">
            {tier.label}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex flex-col items-center py-6 gap-4"
            >
              {/* Trophy orb */}
              <motion.div
                animate={won ? { scale: [1, 1.06, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className={`w-20 h-20 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center`}
                style={{ boxShadow: tier.shadow }}
              >
                {won
                  ? <Trophy className="h-9 w-9 text-white" />
                  : <Frown className="h-9 w-9 text-cosmic-muted" />}
              </motion.div>

              {/* Score */}
              <div className="text-center">
                <p className="text-sm text-cosmic-muted">{gameName}</p>
                <p className="text-3xl font-extrabold text-cosmic-text mt-1">{score}<span className="text-base text-cosmic-muted font-normal">/{maxScore}</span></p>
              </div>

              {/* Reward */}
              {won ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 bg-cosmic-gold/10 border border-cosmic-gold/25 rounded-xl px-5 py-3"
                >
                  <Diamond className="h-4 w-4 text-cosmic-gold" />
                  <span className="text-lg font-bold text-gradient-gold">+{rewardHxco} HXCO</span>
                </motion.div>
              ) : (
                <p className="text-sm text-cosmic-muted">No reward this time — try again!</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2">
          {onPlayAgain && (
            <Button
              variant="outline"
              onClick={onPlayAgain}
              className="flex-1 border-cosmic-accent/30 text-cosmic-accent hover:bg-cosmic-accent/10"
            >
              Play Again
            </Button>
          )}
          <Button
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-cosmic-accent to-cosmic-highlight text-white"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
