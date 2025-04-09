"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  CheckCircle,
  XCircle,
  MoreVertical,
  AlertTriangle,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { WithdrawalHistory, WithdrawalStatus } from "@/types"

// Sample withdrawal data for demonstration
const sampleWithdrawals: WithdrawalHistory[] = [
  {
    id: "w1",
    userId: "user1",
    userName: "John Doe",
    userEmail: "john@example.com",
    date: "2025-03-28 14:32",
    requestDate: "2025-03-27 10:15",
    amount: 0.25,
    currency: "TON",
    status: "Pending",
    address: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    lastWithdrawalDate: "2025-03-10 09:22",
  },
  {
    id: "w2",
    userId: "user2",
    userName: "Alice Smith",
    userEmail: "alice@example.com",
    date: "2025-03-26 09:15",
    requestDate: "2025-03-25 18:45",
    amount: 0.5,
    currency: "TON",
    status: "Processing",
    address: "0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c",
    lastWithdrawalDate: "2025-03-05 11:30",
  },
  {
    id: "w3",
    userId: "user3",
    userName: "Bob Johnson",
    userEmail: "bob@example.com",
    date: "2025-03-24 18:45",
    requestDate: "2025-03-24 12:30",
    amount: 0.1,
    currency: "TON",
    status: "Completed",
    txHash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
    address: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d",
    lastWithdrawalDate: "2025-03-01 14:15",
  },
  {
    id: "w4",
    userId: "user4",
    userName: "Emma Wilson",
    userEmail: "emma@example.com",
    date: "2025-03-22 11:22",
    requestDate: "2025-03-21 16:40",
    amount: 0.75,
    currency: "TON",
    status: "Failed",
    address: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e",
    lastWithdrawalDate: "2025-02-28 10:05",
  },
  {
    id: "w5",
    userId: "user5",
    userName: "Michael Brown",
    userEmail: "michael@example.com",
    date: "2025-03-20 15:10",
    requestDate: "2025-03-19 09:30",
    amount: 0.3,
    currency: "TON",
    status: "Completed",
    txHash: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
    address: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
    lastWithdrawalDate: "2025-02-25 13:45",
  },
  {
    id: "w6",
    userId: "user1",
    userName: "John Doe",
    userEmail: "john@example.com",
    date: "2025-03-10 09:22",
    requestDate: "2025-03-09 17:15",
    amount: 0.2,
    currency: "TON",
    status: "Completed",
    txHash: "0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5g",
    address: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
    lastWithdrawalDate: "2025-02-20 11:30",
  },
]

export default function WithdrawalManagement() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalHistory[]>(sampleWithdrawals)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<WithdrawalStatus | "All">("All")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalHistory | null>(null)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState<boolean>(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>("")
  const [rejectReason, setRejectReason] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const itemsPerPage = 5

  // Filter withdrawals based on search query and status filter
  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    const matchesSearch =
      (withdrawal.userName?.toLowerCase().includes(searchQuery.toLowerCase()) || "") ||
      (withdrawal.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) || "") ||
      (withdrawal.address?.toLowerCase().includes(searchQuery.toLowerCase()) || "");
  
    const matchesStatus = statusFilter === "All" || withdrawal.status === statusFilter;
  
    return matchesSearch && matchesStatus;
  });
  

  // Paginate withdrawals
  const totalPages = Math.ceil(filteredWithdrawals.length / itemsPerPage)
  const paginatedWithdrawals = filteredWithdrawals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Handle approve withdrawal
  const handleApproveWithdrawal = (withdrawal: WithdrawalHistory) => {
    setSelectedWithdrawal(withdrawal)
    setTxHash("")
    setIsApproveDialogOpen(true)
  }

  // Handle reject withdrawal
  const handleRejectWithdrawal = (withdrawal: WithdrawalHistory) => {
    setSelectedWithdrawal(withdrawal)
    setRejectReason("")
    setIsRejectDialogOpen(true)
  }

  // Confirm approve withdrawal
  const confirmApproveWithdrawal = () => {
    if (!selectedWithdrawal) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedWithdrawals = withdrawals.map((withdrawal) =>
        withdrawal.id === selectedWithdrawal.id
          ? {
              ...withdrawal,
              status: "Completed" as WithdrawalStatus,
              txHash,
            }
          : withdrawal,
      )

      setWithdrawals(updatedWithdrawals)
      setIsApproveDialogOpen(false)
      setIsLoading(false)
    }, 1500)
  }

  // Confirm reject withdrawal
  const confirmRejectWithdrawal = () => {
    if (!selectedWithdrawal) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedWithdrawals = withdrawals.map((withdrawal) =>
        withdrawal.id === selectedWithdrawal.id
          ? {
              ...withdrawal,
              status: "Failed" as WithdrawalStatus,
            }
          : withdrawal,
      )

      setWithdrawals(updatedWithdrawals)
      setIsRejectDialogOpen(false)
      setIsLoading(false)
    }, 1500)
  }

  // Get status badge
  const getStatusBadge = (status: WithdrawalStatus) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Completed</Badge>
      case "Pending":
        return <Badge className="bg-cosmic-tertiary/20 text-cosmic-tertiary hover:bg-cosmic-tertiary/30">Pending</Badge>
      case "Processing":
        return <Badge className="bg-cosmic-accent/20 text-cosmic-accent hover:bg-cosmic-accent/30">Processing</Badge>
      case "Failed":
        return (
          <Badge className="bg-cosmic-secondary/20 text-cosmic-secondary hover:bg-cosmic-secondary/30">Failed</Badge>
        )
      default:
        return null
    }
  }

  // Format address for display
  const formatAddress = (address: string): string => {
    if (address.length <= 12) return address
    return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`
  }

  // Check if withdrawal is eligible based on 15-day rule
  const isEligibleForWithdrawal = (lastWithdrawalDate: string | undefined): boolean => {
    if (!lastWithdrawalDate) return true

    const lastDate = new Date(lastWithdrawalDate)
    const currentDate = new Date()
    const diffTime = currentDate.getTime() - lastDate.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)

    return diffDays >= 15
  }

  // Calculate days until eligible
  const daysUntilEligible = (lastWithdrawalDate: string | undefined): number => {
    if (!lastWithdrawalDate) return 0

    const lastDate = new Date(lastWithdrawalDate)
    const currentDate = new Date()
    const diffTime = currentDate.getTime() - lastDate.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)

    return Math.max(0, 15 - Math.floor(diffDays))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-cosmic-text">Withdrawal Requests</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
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
                className={`${statusFilter === "Pending" ? "text-cosmic-accent" : "text-cosmic-text"} cursor-pointer`}
                onClick={() => setStatusFilter("Pending")}
              >
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`${statusFilter === "Processing" ? "text-cosmic-accent" : "text-cosmic-text"} cursor-pointer`}
                onClick={() => setStatusFilter("Processing")}
              >
                Processing
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`${statusFilter === "Completed" ? "text-cosmic-accent" : "text-cosmic-text"} cursor-pointer`}
                onClick={() => setStatusFilter("Completed")}
              >
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`${statusFilter === "Failed" ? "text-cosmic-accent" : "text-cosmic-text"} cursor-pointer`}
                onClick={() => setStatusFilter("Failed")}
              >
                Failed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            className="border-cosmic-accent/20 text-cosmic-muted"
            onClick={() => {
              setSearchQuery("")
              setStatusFilter("All")
              setCurrentPage(1)
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableCaption>List of withdrawal requests from users</TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-cosmic-accent/5 border-cosmic-accent/10">
              <TableHead className="text-cosmic-muted">User</TableHead>
              <TableHead className="text-cosmic-muted">Amount</TableHead>
              <TableHead className="text-cosmic-muted">Request Date</TableHead>
              <TableHead className="text-cosmic-muted">Status</TableHead>
              <TableHead className="text-cosmic-muted">Eligibility</TableHead>
              <TableHead className="text-cosmic-muted">Address</TableHead>
              <TableHead className="text-cosmic-muted text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedWithdrawals.length > 0 ? (
              paginatedWithdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id} className="hover:bg-cosmic-accent/5 border-cosmic-accent/10">
                  <TableCell>
                    <div>
                      <p className="font-medium text-cosmic-text">{withdrawal.userName}</p>
                      <p className="text-xs text-cosmic-muted">{withdrawal.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-cosmic-tertiary">
                    {withdrawal.amount} {withdrawal.currency}
                  </TableCell>
                  <TableCell className="text-cosmic-muted text-sm">
                    {withdrawal.requestDate || withdrawal.date}
                  </TableCell>
                  <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                  <TableCell>
                    {isEligibleForWithdrawal(withdrawal.lastWithdrawalDate) ? (
                      <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Eligible</Badge>
                    ) : (
                      <div>
                        <Badge className="bg-cosmic-secondary/20 text-cosmic-secondary hover:bg-cosmic-secondary/30">
                          Wait {daysUntilEligible(withdrawal.lastWithdrawalDate)} days
                        </Badge>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-cosmic-muted text-xs">{formatAddress(withdrawal.address)}</TableCell>
                  <TableCell className="text-right">
                    {withdrawal.status === "Pending" && (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-green-500/30 text-green-500 hover:bg-green-500/10"
                          onClick={() => handleApproveWithdrawal(withdrawal)}
                          disabled={!isEligibleForWithdrawal(withdrawal.lastWithdrawalDate)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-cosmic-secondary/30 text-cosmic-secondary hover:bg-cosmic-secondary/10"
                          onClick={() => handleRejectWithdrawal(withdrawal)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {withdrawal.status !== "Pending" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-cosmic-card border-cosmic-accent/20">
                          <DropdownMenuLabel className="text-cosmic-muted">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-cosmic-accent/10" />
                          <DropdownMenuItem className="text-cosmic-text cursor-pointer">View Details</DropdownMenuItem>
                          {withdrawal.status === "Processing" && (
                            <DropdownMenuItem
                              className="text-green-500 cursor-pointer"
                              onClick={() => handleApproveWithdrawal(withdrawal)}
                            >
                              Complete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-cosmic-muted">
                    <AlertTriangle className="h-8 w-8 mb-2 text-cosmic-accent/50" />
                    <p>No withdrawal requests found</p>
                    <p className="text-sm">Try adjusting your search or filter</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-cosmic-muted">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredWithdrawals.length)} of {filteredWithdrawals.length} results
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="border-cosmic-accent/20 text-cosmic-muted"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm text-cosmic-muted">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="border-cosmic-accent/20 text-cosmic-muted"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Approve Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="bg-cosmic-card border-cosmic-accent/30">
          <DialogHeader>
            <DialogTitle className="text-cosmic-text">Approve Withdrawal</DialogTitle>
            <DialogDescription className="text-cosmic-muted">
              Enter the transaction hash to complete this withdrawal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-cosmic-muted text-sm">User:</div>
              <div className="col-span-3 text-cosmic-text">{selectedWithdrawal?.userName}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-cosmic-muted text-sm">Amount:</div>
              <div className="col-span-3 text-cosmic-tertiary font-medium">
                {selectedWithdrawal?.amount} {selectedWithdrawal?.currency}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-cosmic-muted text-sm">Address:</div>
              <div className="col-span-3 text-cosmic-text text-sm break-all">{selectedWithdrawal?.address}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-cosmic-muted text-sm">TX Hash:</div>
              <div className="col-span-3">
                <Input
                  placeholder="Enter transaction hash"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  className="bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsApproveDialogOpen(false)}
              className="border-cosmic-accent/20 text-cosmic-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmApproveWithdrawal}
              className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight text-cosmic-text"
              disabled={!txHash.trim() || isLoading}
            >
              {isLoading ? "Processing..." : "Approve Withdrawal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="bg-cosmic-card border-cosmic-accent/30">
          <DialogHeader>
            <DialogTitle className="text-cosmic-text">Reject Withdrawal</DialogTitle>
            <DialogDescription className="text-cosmic-muted">
              Are you sure you want to reject this withdrawal request?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-cosmic-muted text-sm">User:</div>
              <div className="col-span-3 text-cosmic-text">{selectedWithdrawal?.userName}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-cosmic-muted text-sm">Amount:</div>
              <div className="col-span-3 text-cosmic-tertiary font-medium">
                {selectedWithdrawal?.amount} {selectedWithdrawal?.currency}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right text-cosmic-muted text-sm">Reason:</div>
              <div className="col-span-3">
                <Input
                  placeholder="Enter reason for rejection (optional)"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
              className="border-cosmic-accent/20 text-cosmic-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRejectWithdrawal}
              className="bg-cosmic-secondary/80 hover:bg-cosmic-secondary text-cosmic-text"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Reject Withdrawal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
