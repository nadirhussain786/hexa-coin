"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface AdLimitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdLimitDialog({ open, onOpenChange }: AdLimitDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl max-w-sm mx-auto bg-cosmic-card border-cosmic-accent/20">
        <DialogHeader>
          <DialogTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
            Daily Ad Limit Reached
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-cosmic-muted">
            You've reached your daily limit of 2 ads. Please come back tomorrow to watch more ads or use TON to open
            hexagons.
          </p>
        </div>
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text"
          >
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
