"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Withdrawal } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type RejectWithdrawalDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  selectedWithdrawal: Withdrawal | null
  rejectReason: string
  setRejectReason: (reason: string) => void
  isLoading: boolean
  onConfirm: () => void
}

export function RejectWithdrawalDialog({
  isOpen,
  setIsOpen,
  selectedWithdrawal,
  rejectReason,
  setRejectReason,
  isLoading,
  onConfirm,
}: RejectWithdrawalDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-cosmic-card border-cosmic-accent/30">
        <DialogHeader>
          <DialogTitle className="text-cosmic-text">Reject Withdrawal</DialogTitle>
          <DialogDescription className="text-cosmic-muted">
            Are you sure you want to reject this withdrawal request?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-right text-cosmic-muted text-sm">User:</div>
            <div className="col-span-3 text-cosmic-text">{`${selectedWithdrawal?.users.first_name} ${selectedWithdrawal?.users.last_name}`}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-right text-cosmic-muted text-sm">Amount:</div>
            <div className="col-span-3 text-cosmic-tertiary font-medium">
              {selectedWithdrawal?.amount} {selectedWithdrawal?.currency}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-right text-cosmic-muted text-sm">Reason:</div>
            <div className="col-span-3">
              <Input
                placeholder="Enter reason for rejection (optional)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="border-cosmic-accent/20 text-cosmic-muted"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-cosmic-secondary/80 hover:bg-cosmic-secondary text-cosmic-text"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Reject Withdrawal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
