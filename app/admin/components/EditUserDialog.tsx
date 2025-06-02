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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User } from "@/types"
import { UserStatus } from "@/constants"


type EditUserDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  user: User | null
  formData: {
    firstName: string
    lastName: string
    status: UserStatus
  }
  handleChange: (e: React.ChangeEvent<HTMLInputElement> | { name: string; value: string }) => void
  onSave: () => void
  isLoading: boolean
}

export function EditUserDialog({
  isOpen,
  setIsOpen,
  user,
  formData,
  handleChange,
  onSave,
  isLoading,
}: EditUserDialogProps) {
  const handleStatusChange = (value: string) => {
    handleChange({
      name: "status",
      value,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DialogContent
        className="bg-cosmic-card border-cosmic-accent/30"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-cosmic-text">Edit User</DialogTitle>
          <DialogDescription className="text-cosmic-muted">Make changes to user information</DialogDescription>
        </DialogHeader>

        {user && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right text-cosmic-muted text-sm">
                First Name:
              </Label>
              <div className="col-span-3">
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text w-full cursor-text"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right text-cosmic-muted text-sm">
                Last Name:
              </Label>
              <div className="col-span-3">
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text w-full cursor-text"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right text-cosmic-muted text-sm">
                Status:
              </Label>
              <div className="col-span-3">
                <Select value={formData.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-cosmic-card border-cosmic-accent/30">
                    <SelectItem value={UserStatus.Active} className="text-cosmic-text">
                      Active
                    </SelectItem>
                    <SelectItem value={UserStatus.Inactive} className="text-cosmic-text">
                      Inactive
                    </SelectItem>
                    <SelectItem value={UserStatus.Banned} className="text-cosmic-text">
                      Banned
                    </SelectItem>
                    <SelectItem value={UserStatus.Pending} className="text-cosmic-text">
                      Pending
                    </SelectItem>
                  </SelectContent>
                </Select>
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
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
