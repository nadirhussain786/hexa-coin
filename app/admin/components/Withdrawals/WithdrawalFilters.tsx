"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { WithdrawalStatus } from "@/constants"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type WithdrawalFiltersProps = {
  searchQuery: string
  setSearchQuery: (query: string) => void
  statusFilter: WithdrawalStatus | "All"
  setStatusFilter: (status: WithdrawalStatus | "All") => void
}

export function WithdrawalFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}: WithdrawalFiltersProps) {
  return (
    <>
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cosmic-muted" />
        <Input
          placeholder="Search by name, email, address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text w-full"
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="border-cosmic-accent/20 text-cosmic-muted">
            <Filter className="h-4 w-4 mr-2" />
            {statusFilter === "All" ? "All Status" : statusFilter}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-cosmic-card border-cosmic-accent/20">
          <DropdownMenuLabel className="text-cosmic-muted">Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-cosmic-accent/10" />
          <DropdownMenuItem
            className={`${statusFilter === "All" ? "text-cosmic-accent" : "text-cosmic-text"} cursor-pointer`}
            onClick={() => setStatusFilter("All")}
          >
            All
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`${statusFilter === WithdrawalStatus.Pending ? "text-cosmic-accent" : "text-cosmic-text"} cursor-pointer`}
            onClick={() => setStatusFilter(WithdrawalStatus.Pending)}
          >
            Pending
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`${statusFilter === WithdrawalStatus.Processing ? "text-cosmic-accent" : "text-cosmic-text"} cursor-pointer`}
            onClick={() => setStatusFilter(WithdrawalStatus.Processing)}
          >
            Processing
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`${statusFilter === WithdrawalStatus.Confirmed ? "text-cosmic-accent" : "text-cosmic-text"} cursor-pointer`}
            onClick={() => setStatusFilter(WithdrawalStatus.Confirmed)}
          >
            Completed
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`${statusFilter === WithdrawalStatus.Failed ? "text-cosmic-accent" : "text-cosmic-text"} cursor-pointer`}
            onClick={() => setStatusFilter(WithdrawalStatus.Failed)}
          >
            Failed
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
