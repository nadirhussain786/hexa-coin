"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { SheetTrigger } from "@/components/ui/sheet"

interface DrawerTriggerProps {
  children?: ReactNode
  className?: string
  onClick?: () => void
}

export function DrawerTrigger({
  children = "Open Drawer",
  className = "bg-gradient-to-r from-cosmic-accent to-cosmic-highlight text-cosmic-text",
  onClick,
}: DrawerTriggerProps){
  return (
    <SheetTrigger asChild>
      <Button className={className} onClick={onClick}>
        {children}
      </Button>
    </SheetTrigger>
  )
}
