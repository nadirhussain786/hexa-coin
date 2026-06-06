"use client";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tv2, Loader2 } from "lucide-react";

interface AdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adLoading: boolean;
}

export function AdDialog({ open, onOpenChange, adLoading }: AdDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-2xl max-w-sm mx-auto bg-gradient-to-br from-[#1A1438] to-[#0F0A1F] border border-white/10">
        <div className="flex flex-col items-center justify-center py-8 gap-5">
          {adLoading ? (
            <>
              <div className="w-16 h-16 rounded-2xl bg-cosmic-accent/20 flex items-center justify-center">
                <Loader2 className="h-7 w-7 text-cosmic-accent animate-spin" />
              </div>
              <div className="text-center">
                <DialogTitle className="text-base font-semibold text-cosmic-text">Loading Ad...</DialogTitle>
                <DialogDescription className="text-xs text-cosmic-muted mt-1">Just a moment</DialogDescription>
              </div>
            </>
          ) : (
            <>
              <div className="w-full h-44 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                {/* Simulated ad content */}
                <div className="absolute inset-0 bg-gradient-to-br from-cosmic-accent/20 to-cosmic-secondary/20" />
                <div className="relative text-center px-4">
                  <Tv2 className="h-10 w-10 text-cosmic-accent mx-auto mb-2 opacity-60" />
                  <p className="text-xs text-cosmic-muted">Advertisement</p>
                  <p className="text-[10px] text-cosmic-muted/60 mt-1">Ad closes automatically</p>
                </div>
              </div>
              <div className="text-center">
                <DialogTitle className="text-sm font-semibold text-cosmic-text">Watching Ad...</DialogTitle>
                <DialogDescription className="text-xs text-cosmic-muted mt-1">
                  Watch to earn progress toward a free hex open
                </DialogDescription>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
