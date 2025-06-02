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

type ApproveWithdrawalDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  selectedWithdrawal: Withdrawal | null
  txHash: string
  setTxHash: (txHash: string) => void
  isLoading: boolean
  onConfirm: () => void
}

export function ApproveWithdrawalDialog({
  isOpen,
  setIsOpen,
  selectedWithdrawal,
  txHash,
  setTxHash,
  isLoading,
  onConfirm,
}: ApproveWithdrawalDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-cosmic-card border-cosmic-accent/30">
        <DialogHeader>
          <DialogTitle className="text-cosmic-text">Approve Withdrawal</DialogTitle>
          <DialogDescription className="text-cosmic-muted">
            Enter the transaction hash to complete this withdrawal.
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
            <div className="text-right text-cosmic-muted text-sm">Address:</div>
            <div className="col-span-3 text-cosmic-text text-sm break-all">{selectedWithdrawal?.address}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="text-right text-cosmic-muted text-sm">TX Hash:</div>
            <div className="col-span-3">
              <Input
                placeholder="Enter transaction hash"
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
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
            className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight text-cosmic-text"
            disabled={!txHash.trim() || isLoading}
          >
            {isLoading ? "Processing..." : "Approve Withdrawal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
