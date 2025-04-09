import type { ReactNode } from "react"
import { SheetFooter } from "@/components/ui/sheet"

interface DrawerFooterProps {
  children: ReactNode
  className?: string
}

export function DrawerFooter({ children, className = "" }: DrawerFooterProps){
  return <SheetFooter className={className}>{children}</SheetFooter>
}
