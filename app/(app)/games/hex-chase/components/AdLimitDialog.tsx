"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Clock } from "lucide-react";

interface AdLimitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdLimitDialog({ open, onOpenChange }: AdLimitDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-2xl max-w-sm mx-auto bg-gradient-to-br from-[#1A1438] to-[#0F0A1F] border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-lg bg-clip-text text-transparent bg-gradient-to-r from-cosmic-secondary to-cosmic-highlight">
            Cooldown Active
          </DialogTitle>
        </DialogHeader>
        <div className="py-3 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-cosmic-secondary/20 flex items-center justify-center flex-shrink-0">
            <Clock className="h-5 w-5 text-cosmic-secondary" />
          </div>
          <p className="text-sm text-cosmic-muted">
            Wait for the cooldown to finish before watching the next ad.
            You can also pay TON to open a hexagon instantly.
          </p>
        </div>
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight text-white w-full"
          >
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
