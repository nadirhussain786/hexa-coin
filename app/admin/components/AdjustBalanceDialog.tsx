"use client"

import type React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Minus, Plus } from "lucide-react"
import type { User } from "@/types"

type AdjustBalanceDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  user: User | null
  formData: {
    currency: "HXCO" | "TON" 
    amount: number
    operation: "add" | "subtract"
    reason: string
  }
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onSave: () => void
  isLoading: boolean
}

export function AdjustBalanceDialog({
  isOpen,
  setIsOpen,
  user,
  formData,
  handleChange,
  onSave,
  isLoading,
}: AdjustBalanceDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DialogContent
        className="bg-cosmic-card border-cosmic-accent/30"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-cosmic-text">Adjust Balance</DialogTitle>
          <DialogDescription className="text-cosmic-muted">Add or subtract from user&apos;s balance</DialogDescription>
        </DialogHeader>

        {user && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-cosmic-muted text-sm">User:</div>
              <div className="col-span-3 text-cosmic-text">{user.name}</div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-cosmic-muted text-sm">Current Balance:</div>
              <div className="col-span-3">
                <div className="space-y-1">
                  <p className="text-xs flex justify-between">
                    <span className="text-cosmic-muted">HXCO:</span>
                    <span className="text-cosmic-accent">{user.hxco}</span>
                  </p>
                  <p className="text-xs flex justify-between">
                    <span className="text-cosmic-muted">TON:</span>
                    <span className="text-cosmic-tertiary">{user.ton.toFixed(2)}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-cosmic-muted text-sm">Currency:</div>
              <div className="col-span-3">
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full rounded-md border border-cosmic-accent/20 bg-cosmic-bg/50 text-cosmic-text p-2 cursor-pointer"
                >
                  <option value="HXCO">HXCO Tokens</option>
                  <option value="TON">TON</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-cosmic-muted text-sm">Operation:</div>
              <div className="col-span-3">
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="add"
                      name="operation"
                      value="add"
                      checked={formData.operation === "add"}
                      onChange={() => {
                        const event = {
                          target: {
                            name: "operation",
                            value: "add",
                          },
                        } as React.ChangeEvent<HTMLInputElement>
                        handleChange(event)
                      }}
                      className="text-cosmic-accent cursor-pointer"
                    />
                    <Label htmlFor="add" className="text-cosmic-text flex items-center cursor-pointer">
                      <Plus className="h-4 w-4 mr-1 text-green-500" />
                      Add
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="subtract"
                      name="operation"
                      value="subtract"
                      checked={formData.operation === "subtract"}
                      onChange={() => {
                        const event = {
                          target: {
                            name: "operation",
                            value: "subtract",
                          },
                        } as React.ChangeEvent<HTMLInputElement>
                        handleChange(event)
                      }}
                      className="text-cosmic-secondary cursor-pointer"
                    />
                    <Label htmlFor="subtract" className="text-cosmic-text flex items-center cursor-pointer">
                      <Minus className="h-4 w-4 mr-1 text-cosmic-secondary" />
                      Subtract
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-cosmic-muted text-sm">Amount:</div>
              <div className="col-span-3">
                <Input
                  name="amount"
                  type="number"
                  min="0"
                  step={formData.currency === "TON" ? "0.01" : "1"}
                  value={formData.amount || ""}
                  onChange={handleChange}
                  className="bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text cursor-text"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-cosmic-muted text-sm">Reason:</div>
              <div className="col-span-3">
                <Input
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Optional reason for adjustment"
                  className="bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text cursor-text"
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="border-cosmic-accent/20 text-cosmic-muted cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight text-cosmic-text cursor-pointer"
            disabled={isLoading || formData.amount <= 0}
          >
            {isLoading ? "Processing..." : "Adjust Balance"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
