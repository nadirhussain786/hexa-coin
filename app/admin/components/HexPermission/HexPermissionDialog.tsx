"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { AlertTriangle } from "lucide-react"
import { HexPermission } from "@/types"

interface HexPermissionDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  permission: HexPermission | null
  onSave: (permission: HexPermission) => void
  isLoading: boolean
}

export function HexPermissionDialog({ isOpen, setIsOpen, permission, onSave, isLoading }: HexPermissionDialogProps) {
  const [formData, setFormData] = useState<HexPermission>({
    id: "",
    name: "",
    user_id: "",
    daily_limit: 5,
    ad_required: 1,
    ton_cost: 5.0,
    is_banned: false,
    updated_at: "",
    created_at: "",
  })

  const [errors, setErrors] = useState<{
    name?: string
    user_id?: string
    daily_limit?: string
    ad_required?: string
    ton_cost?: string
  }>({})

  // Reset form when dialog opens/closes or permission changes
  useEffect(() => {
    if (isOpen) {
      if (permission) {
        setFormData(permission)
      } else {
        setFormData({
          id: "",
          name: "",
          user_id: "",
          daily_limit: 5,
          ad_required: 1,
          ton_cost: 5.0,
          is_banned: false,
          updated_at: "",
          created_at: "",
        })
      }
      setErrors({})
    }
  }, [isOpen, permission])

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string
      user_id?: string
      daily_limit?: string
      ad_required?: string
      ton_cost?: string
    } = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.user_id.trim()) {
      newErrors.user_id = "User ID is required"
    }

    if (formData.daily_limit < 0) {
      newErrors.daily_limit = "Daily limit cannot be negative"
    }

    if (formData.ad_required < 0) {
      newErrors.ad_required = "Ads required cannot be negative"
    }

    if (formData.ton_cost < 0) {
      newErrors.ton_cost = "TON cost cannot be negative"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSave(formData)
    }
  }

  const handleChange = (field: keyof HexPermission, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  return (
    <Dialog open={isOpen} modal={false}>
      <DialogContent className="bg-cosmic-card border-cosmic-accent/30 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-cosmic-text">
            {permission ? "Edit Hex Permission" : "Create New Hex Permission"}
          </DialogTitle>
          <DialogDescription className="text-cosmic-muted">
            {permission ? "Modify hex box permissions for this user" : "Create new hex box permissions for a user"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-cosmic-muted text-sm">Name:</div>
              <div className="col-span-3">
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter permission name"
                  className={`bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text w-full ${
                    errors.name ? "border-cosmic-secondary" : ""
                  }`}
                  disabled={true}
                />
                {errors.name && <p className="text-cosmic-secondary text-xs mt-1">{errors.name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-cosmic-muted text-sm">User ID:</div>
              <div className="col-span-3">
                <Input
                  value={formData.user_id}
                  onChange={(e) => handleChange("user_id", e.target.value)}
                  placeholder="Enter user ID or email"
                  className={`bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text w-full ${
                    errors.user_id ? "border-cosmic-secondary" : ""
                  }`}
                  disabled={!!permission || isLoading}
                />
                {errors.user_id && <p className="text-cosmic-secondary text-xs mt-1">{errors.user_id}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-cosmic-muted text-sm">Daily Limit:</div>
              <div className="col-span-3">
                <Input
                  type="number"
                  min="0"
                  value={formData.daily_limit}
                  onChange={(e) => handleChange("daily_limit", Number.parseInt(e.target.value) || 0)}
                  className={`bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text w-full ${
                    errors.daily_limit ? "border-cosmic-secondary" : ""
                  }`}
                  disabled={formData.is_banned || isLoading}
                />
                {errors.daily_limit ? (
                  <p className="text-cosmic-secondary text-xs mt-1">{errors.daily_limit}</p>
                ) : (
                  <p className="text-xs text-cosmic-muted mt-1">
                    Maximum number of hex boxes the user can open per day
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-cosmic-muted text-sm">Ads Required:</div>
              <div className="col-span-3">
                <Input
                  type="number"
                  min="0"
                  value={formData.ad_required}
                  onChange={(e) => handleChange("ad_required", Number.parseInt(e.target.value) || 0)}
                  className={`bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text w-full ${
                    errors.ad_required ? "border-cosmic-secondary" : ""
                  }`}
                  disabled={formData.is_banned || isLoading}
                />
                {errors.ad_required ? (
                  <p className="text-cosmic-secondary text-xs mt-1">{errors.ad_required}</p>
                ) : (
                  <p className="text-xs text-cosmic-muted mt-1">Number of ads shown per hex box opened</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-cosmic-muted text-sm">TON Cost:</div>
              <div className="col-span-3">
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.ton_cost}
                  onChange={(e) => handleChange("ton_cost", Number.parseFloat(e.target.value) || 0)}
                  className={`bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text w-full ${
                    errors.ton_cost ? "border-cosmic-secondary" : ""
                  }`}
                  disabled={formData.is_banned || isLoading}
                />
                {errors.ton_cost ? (
                  <p className="text-cosmic-secondary text-xs mt-1">{errors.ton_cost}</p>
                ) : (
                  <p className="text-xs text-cosmic-muted mt-1">Amount of TONs required to open each hex box</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-cosmic-muted text-sm">Ban User:</div>
              <div className="col-span-3 flex items-center space-x-2">
                <Checkbox
                  id="is_banned"
                  checked={formData.is_banned}
                  onCheckedChange={(checked) => {
                    handleChange("is_banned", checked === true)
                    if (checked) {
                      // If banned, reset values
                      handleChange("daily_limit", 0)
                      handleChange("ad_required", 0)
                      handleChange("ton_cost", 0)
                    }
                  }}
                  disabled={isLoading}
                  className="border-white data-[state=checked]:bg-cosmic-secondary data-[state=checked]:border-cosmic-secondary"
                />
                <Label htmlFor="is_banned" className="text-cosmic-text cursor-pointer">
                  {formData.is_banned ? "User is banned from hex boxes" : "User can access hex boxes"}
                </Label>
              </div>
            </div>

            {formData.is_banned && (
              <div className="bg-cosmic-secondary/10 border border-cosmic-secondary/30 rounded-md p-4 ml-[25%] mr-0 w-[75%]">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-cosmic-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-cosmic-secondary font-medium">Warning</p>
                    <p className="text-cosmic-secondary/80 text-sm">
                      Banned users cannot open hex boxes. All limits will be set to zero.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-cosmic-accent/20 text-cosmic-muted"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight text-cosmic-text"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : permission ? "Save Changes" : "Create Permission"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
