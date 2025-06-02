"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SimpleDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function SimpleDialog({ isOpen, setIsOpen }: SimpleDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Simple Dialog</DialogTitle>
          <DialogDescription>This is a basic dialog box created with shadcn/ui components.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Your dialog content goes here. You can add any components or text you need.
          </p>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => setIsOpen(false)}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
