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

type UserFiltersProps = {
  searchQuery: string
  setSearchQuery: (query: string) => void
  roleFilter: "all" | "user" | "admin"
  setRoleFilter: (role: "all" | "user" | "admin") => void
  resetFilters: () => void
}

export function UserFilters({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  resetFilters,
}: UserFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cosmic-muted" />
        <Input
          placeholder="Search by name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text w-full"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border-cosmic-accent/20 text-cosmic-muted">
            <Filter className="h-4 w-4 mr-2" />
            {roleFilter === "all" ? "All Roles" : roleFilter === "admin" ? "Admins" : "Users"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-cosmic-card border-cosmic-accent/20">
          <DropdownMenuLabel className="text-cosmic-muted">Filter by Role</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-cosmic-accent/10" />
          <DropdownMenuItem
            className={`${roleFilter === "all" ? "text-cosmic-accent" : "text-cosmic-text"} cursor-pointer`}
            onClick={() => setRoleFilter("all")}
          >
            All Roles
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`${roleFilter === "user" ? "text-cosmic-accent" : "text-cosmic-text"} cursor-pointer`}
            onClick={() => setRoleFilter("user")}
          >
            Users
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`${roleFilter === "admin" ? "text-cosmic-accent" : "text-cosmic-text"} cursor-pointer`}
            onClick={() => setRoleFilter("admin")}
          >
            Admins
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
