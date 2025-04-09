import type { ReactNode } from "react"

export interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

export interface SheetContentProps {
  side?: "top" | "right" | "bottom" | "left"
  className?: string
  children: ReactNode
}

export interface SheetTriggerProps {
  asChild?: boolean
  children: ReactNode
}

export interface SheetHeaderProps {
  className?: string
  children: ReactNode
}

export interface SheetFooterProps {
  className?: string
  children: ReactNode
}

export interface SheetTitleProps {
  className?: string
  children: ReactNode
}

export interface SheetDescriptionProps {
  className?: string
  children: ReactNode
}
