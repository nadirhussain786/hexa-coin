"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { HexReward } from "@/types/game-types"

interface RewardDialogProps {
  open: boolean
  onClose: () => void
  reward: HexReward | null
}

export function RewardDialog({ open, onClose, reward }: RewardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-cosmic-accent/20 shadow-xl max-w-sm mx-auto bg-cosmic-card">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl bg-gradient-to-r from-cosmic-text to-cosmic-muted bg-clip-text text-transparent">
            {reward?.type === "Empty" ? "Better luck next time!" : "Congratulations!"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-8">
          {reward?.type === "HXCO" && (
            <>
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(123,63,228,0.5)]">
                <span className="text-2xl font-bold text-cosmic-text">+{reward.value}</span>
              </div>
              <p className="text-xl font-bold text-cosmic-secondary">{reward.value} HXCO</p>
            </>
          )}
          {reward?.type === "TON" && (
            <>
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cosmic-tertiary to-cosmic-tertiary flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,216,255,0.5)]">
                <span className="text-2xl font-bold text-cosmic-text">+{reward.value}</span>
              </div>
              <p className="text-xl font-bold text-cosmic-tertiary">{reward.value} TON</p>
            </>
          )}
          {reward?.type === "Discount" && (
            <>
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#FFD166] to-[#FF6B6B] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,209,102,0.5)]">
                <span className="text-2xl font-bold text-cosmic-text">{reward.value}</span>
              </div>
              <p className="text-xl font-bold text-[#FFD166]">{reward.value} TON Discount</p>
            </>
          )}
          {reward?.type === "Free Hex" && (
            <>
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#4ECDC4] to-[#00F5D4] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(78,205,196,0.5)]">
                <span className="text-2xl font-bold text-cosmic-text">Free</span>
              </div>
              <p className="text-xl font-bold text-[#4ECDC4]">Free Hexagon</p>
            </>
          )}
          {reward?.type === "Empty" && (
            <>
              <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-zinc-500">Empty</span>
              </div>
              <p className="text-xl font-bold text-zinc-500">No Reward</p>
            </>
          )}
        </div>
        <Button
          className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text shadow-lg transition-all duration-300"
          onClick={onClose}
        >
          Continue Playing
        </Button>
      </DialogContent>
    </Dialog>
  )
}
