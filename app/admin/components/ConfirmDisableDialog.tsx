"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import type { User } from "@/types"

type ConfirmDisableDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  user: User | null
  onConfirm: () => void
  isLoading: boolean
}

export function ConfirmDisableDialog({ isOpen, setIsOpen, user, onConfirm, isLoading }: ConfirmDisableDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="bg-cosmic-card border-cosmic-accent/30"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* <DialogHeader>
          <DialogTitle className="text-cosmic-text">Disable User Account</DialogTitle>
          <DialogDescription className="text-cosmic-muted">
            Are you sure you want to disable this user account?
          </DialogDescription>
        </DialogHeader>

        {user && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-cosmic-muted text-sm">User:</div>
              <div className="col-span-3 text-cosmic-text">{user.name}</div>
            </div>

            <div className="bg-cosmic-secondary/10 border border-cosmic-secondary/30 rounded-md p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-cosmic-secondary mt-0.5" />
                <div>
                  <p className="text-cosmic-secondary font-medium">Warning</p>
                  <p className="text-cosmic-secondary/80 text-sm">
                    This action will prevent the user from accessing their account. They will not be able to log in or
                    use any features of the platform.
                  </p>
                </div>
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
            onClick={onConfirm}
            className="bg-cosmic-secondary/80 hover:bg-cosmic-secondary text-cosmic-text cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Disabling..." : "Disable Account"}
          </Button>
        </DialogFooter> */}
        hello 
      </DialogContent>
    </Dialog>
  )
}
