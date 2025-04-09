"use client"

import { useState, type ReactNode } from "react"
import { Sheet } from "@/components/ui/sheet"

interface DrawerProps {
  children: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
}

export function Drawer({ children, open, onOpenChange, defaultOpen = false }: DrawerProps): JSX.Element {
  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen)

  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen

  const handleOpenChange = (newOpen: boolean): void => {
    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      {children}
    </Sheet>
  )
}
