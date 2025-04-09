"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerFooter } from "@/components/drawer"

interface DrawerExampleProps {
  title?: string
  description?: string
  children?: React.ReactNode
  triggerText?: string
  side?: "top" | "right" | "bottom" | "left"
  className?: string
}

export default function DrawerExample({
  title = "Drawer Title",
  description = "This is a drawer component using shadcn/ui Sheet instead of vaul.",
  children,
  triggerText = "Open Drawer",
  side = "bottom",
  className = "",
}: DrawerExampleProps) {
  const [open, setOpen] = useState<boolean>(false)

  const handleOpenChange = (newOpen: boolean): void => {
    setOpen(newOpen)
  }

  const handleClose = (): void => {
    setOpen(false)
  }

  return (
    <div className="p-4">
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerTrigger>{triggerText}</DrawerTrigger>
        <DrawerContent side={side} className={className}>
          <DrawerHeader title={title} description={description} />

          <div className="py-6">
            {children || (
              <p className="text-cosmic-text">
                Your drawer content goes here. This component is fully compatible with React 19 and Next.js 15.
              </p>
            )}
          </div>

          <DrawerFooter>
            <Button
              onClick={handleClose}
              className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight text-cosmic-text"
            >
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
