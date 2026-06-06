"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { HexReward } from "@/types"

interface RewardDialogProps {
  open: boolean
  onClose: () => void
  reward: HexReward | null
}

const REWARD_CONFIG = {
  HXCO: {
    gradient: "from-cosmic-accent to-cosmic-highlight",
    shadow: "0 0 30px rgba(124,58,237,0.6), 0 0 60px rgba(168,85,247,0.25)",
    label: (val: number) => `+${val} HXCO`,
    textClass: "text-gradient",
    display: (val: number) => `${val}`,
    title: "Congratulations!",
  },
  TON: {
    gradient: "from-cosmic-tertiary to-[#38BDF8]",
    shadow: "0 0 30px rgba(6,182,212,0.6), 0 0 60px rgba(6,182,212,0.2)",
    label: (val: number) => `+${val} TON`,
    textClass: "text-cosmic-tertiary",
    display: (val: number) => `${val}`,
    title: "TON Earned!",
  },
  Discount: {
    gradient: "from-cosmic-gold to-[#FBBF24]",
    shadow: "0 0 30px rgba(245,158,11,0.6), 0 0 60px rgba(245,158,11,0.2)",
    label: (val: number) => `${val} TON OFF`,
    textClass: "text-gradient-gold",
    display: (val: number) => `-${val}`,
    title: "Discount Won!",
  },
  "Free Hex": {
    gradient: "from-[#10B981] to-[#34D399]",
    shadow: "0 0 30px rgba(16,185,129,0.6), 0 0 60px rgba(16,185,129,0.2)",
    label: () => "Free Hexagon",
    textClass: "text-emerald-400",
    display: () => "★",
    title: "Free Hex!",
  },
  Empty: {
    gradient: "from-cosmic-surface to-cosmic-surface2",
    shadow: "none",
    label: () => "No Reward",
    textClass: "text-cosmic-muted",
    display: () => "·",
    title: "Better luck next time!",
  },
}

export function RewardDialog({ open, onClose, reward }: RewardDialogProps) {
  const type = reward?.type ?? "Empty"
  const config = REWARD_CONFIG[type as keyof typeof REWARD_CONFIG] ?? REWARD_CONFIG.Empty
  const val = reward?.value ?? 0

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border border-cosmic-border/50 shadow-2xl max-w-sm mx-auto bg-gradient-to-br from-cosmic-card to-cosmic-bg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-cosmic-text">
            {config.title}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={type}
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex flex-col items-center justify-center py-8 gap-4"
          >
            {/* Reward orb */}
            <motion.div
              animate={type !== "Empty" ? { scale: [1, 1.05, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className={`w-24 h-24 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center`}
              style={{ boxShadow: config.shadow }}
            >
              <span className="text-2xl font-extrabold text-white">
                {config.display(val)}
              </span>
            </motion.div>

            {/* Reward label */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className={`text-2xl font-bold ${config.textClass}`}
            >
              {config.label(val)}
            </motion.p>

            {type !== "Empty" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="text-xs text-cosmic-muted text-center"
              >
                {type === "HXCO" && "Added to your HXCO balance"}
                {type === "TON" && "Added to your TON balance"}
                {type === "Discount" && "Applied to your next TON payment"}
                {type === "Free Hex" && "Use it on any hex tile"}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>

        <Button
          className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight text-white shadow-lg w-full font-semibold tracking-wide"
          onClick={onClose}
        >
          Continue Playing
        </Button>
      </DialogContent>
    </Dialog>
  )
}
