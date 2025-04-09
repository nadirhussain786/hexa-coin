import type { ReactNode } from "react"
import { SheetContent } from "@/components/ui/sheet"

interface DrawerContentProps {
  children: ReactNode
  side?: "top" | "right" | "bottom" | "left"
  className?: string
}

export function DrawerContent({
  children,
  side = "bottom",
  className = "bg-cosmic-card border-cosmic-accent/30",
}: DrawerContentProps){
  return (
    <SheetContent side={side} className={className}>
      {children}
    </SheetContent>
  )
}
