"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter, RefreshCw, Search } from "lucide-react"

type HexPermissionFiltersProps = {
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: "all" | "active" | "banned"
  setStatusFilter: (status: "all" | "active" | "banned") => void
  resetFilters: () => void
}

export function HexPermissionFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  resetFilters,
}: HexPermissionFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <div className="relative sm:w-64 w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cosmic-muted" />
        <Input
          placeholder="Search by name or user ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text w-full"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border-cosmic-accent/20 text-cosmic-muted">
            <Filter className="h-4 w-4 mr-2" />
            {statusFilter === "all" ? "All Users" : statusFilter === "banned" ? "Banned Users" : "Active Users"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-cosmic-card border-cosmic-accent/20">
          <DropdownMenuLabel className="text-cosmic-muted">Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-cosmic-accent/10" />
          <DropdownMenuItem
            className={`${statusFilter === "all" ? "text-cosmic-accent" : "text-cosmic-text"} cursor-pointer`}
            onClick={() => setStatusFilter("all")}
          >
            All Users
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`${statusFilter === "active" ? "text-cosmic-accent" : "text-cosmic-text"} cursor-pointer`}
            onClick={() => setStatusFilter("active")}
          >
            Active Users
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`${statusFilter === "banned" ? "text-cosmic-accent" : "text-cosmic-text"} cursor-pointer`}
            onClick={() => setStatusFilter("banned")}
          >
            Banned Users
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" className="border-cosmic-accent/20 text-cosmic-muted" onClick={resetFilters}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Reset
      </Button>
    </div>
  )
}
