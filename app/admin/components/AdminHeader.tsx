"use client"

import { LogOut, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  adminName: string
  onLogout: () => void
}

export default function AdminHeader({ adminName, onLogout }: Props) {
  return (
    <header className="border-b border-cosmic-accent/10 bg-cosmic-card/30 backdrop-blur-md">
      <div className="container py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-gradient-to-br from-cosmic-accent to-cosmic-secondary rounded-xl flex items-center justify-center shadow-lg">
            <LayoutDashboard className="h-5 w-5 text-cosmic-text" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
            Admin Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-cosmic-text font-medium">{adminName || "Admin"}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="border-cosmic-accent/20 text-cosmic-muted hover:bg-cosmic-accent/10 hover:text-cosmic-text"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
