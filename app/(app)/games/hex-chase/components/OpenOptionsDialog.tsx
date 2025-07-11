"use client"

import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { formatCooldownTime } from "@/utils/game-utils"
import type { UserBalance } from "@/types/game-types"

interface OpenOptionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onWatchAd: () => void
  onPayWithTON: () => void
  onCancel: () => void
  userBalance: UserBalance
  adViewCount: number
  adViewsToday: number
  adCooldown: number
}

export function OpenOptionsDialog({
  open,
  onOpenChange,
  onWatchAd,
  onPayWithTON,
  onCancel,
  userBalance,
  adViewCount,
  adViewsToday,
  adCooldown,
}: OpenOptionsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl max-w-sm mx-auto bg-cosmic-card border-cosmic-accent/20">
        <DialogHeader>
          <DialogTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
            Open Hexagon
          </DialogTitle>
          <DialogDescription className="text-cosmic-muted">Choose how you want to open this hexagon</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <Button
                onClick={onWatchAd}
                disabled={adCooldown > 0 || adViewsToday >= 2}
                className={
                  adCooldown > 0 || adViewsToday >= 2
                    ? "bg-cosmic-card border border-cosmic-accent/20 text-cosmic-muted w-full cursor-not-allowed"
                    : "bg-cosmic-card border border-cosmic-accent/20 text-cosmic-text hover:bg-cosmic-accent/10 w-full"
                }
              >
                <div className="flex flex-col items-center w-full">
                  <div className="flex items-center justify-center w-full">
                    <span className="text-cosmic-text">Watch Ad</span>
                    {adCooldown > 0 && (
                      <div className="ml-2 flex items-center text-cosmic-muted">
                        <Clock className="h-3 w-3 mr-1" />
                        <span className="text-xs">{formatCooldownTime(adCooldown)}</span>
                      </div>
                    )}
                  </div>
                  <div className="w-full bg-cosmic-bg h-2 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight h-full"
                      style={{ width: `${(adViewCount / 10) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between w-full text-xs mt-1">
                    <span className="text-cosmic-muted">{adViewCount}/10 ads watched</span>
                    <span className="text-cosmic-muted">{adViewsToday}/2 today</span>
                  </div>
                </div>
              </Button>
              {adViewsToday >= 2 && (
                <span className="text-xs text-cosmic-secondary absolute -bottom-5 left-0 right-0 text-center">
                  Daily ad limit reached
                </span>
              )}
            </div>

            <div className="relative">
              <Button
                onClick={onPayWithTON}
                disabled={userBalance.ton < 0.2}
                className={
                  userBalance.ton >= 0.2
                    ? "bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text w-full"
                    : "bg-cosmic-card border border-cosmic-accent/20 text-cosmic-muted w-full cursor-not-allowed"
                }
              >
                Pay 0.2 TON
              </Button>
              {userBalance.ton < 0.2 && (
                <span className="text-xs text-cosmic-secondary absolute -bottom-5 left-0 right-0 text-center">
                  Insufficient TON balance
                </span>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-cosmic-accent/20 text-cosmic-muted hover:bg-cosmic-accent/10 hover:text-cosmic-text"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
