"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import type { Withdrawal } from "@/types"
import { WithdrawalStatus } from "@/constants"
import { WithdrawalFilters } from "./WithdrawalFilters"
import { WithdrawalTable } from "./WithdrawalTable"
import { WithdrawalPagination } from "./WithdrawalPagination"
import { ApproveWithdrawalDialog } from "./ApproveWithdrawalDialog"
import { RejectWithdrawalDialog } from "./RejectWithdrawalDialog"
import { rejectOrFailWithdrawal } from "../../actions/withdrawls/rejectWithdrawal"
import { confirmWithdrawal } from "../../actions/withdrawls/confirmWithdrawals"

type Props = {
  withdrawal: Withdrawal[]
}

export default function WithdrawalManagement({ withdrawal }: Props) {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(withdrawal)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<WithdrawalStatus | "All">("All")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState<boolean>(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string>("")
  const [rejectReason, setRejectReason] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const itemsPerPage = 5

  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    const matchesSearch =
      withdrawal.users.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      "" ||
      withdrawal.users.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      "" ||
      withdrawal.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ""

    const matchesStatus = statusFilter === "All" || withdrawal.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredWithdrawals.length / itemsPerPage)
  const paginatedWithdrawals = filteredWithdrawals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleApproveWithdrawal = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal)
    setTxHash("")
    setIsApproveDialogOpen(true)
  }

  const handleRejectWithdrawal = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal)
    setRejectReason("")
    setIsRejectDialogOpen(true)
  }


const confirmApproveWithdrawal = async () => {
  if (!selectedWithdrawal) return

  setIsLoading(true)

  try {
    const result = await confirmWithdrawal(selectedWithdrawal.id, txHash)

    if (!result.success) {
      console.error("Approval failed:", result.error)
      return
    }

    const updatedWithdrawals = withdrawals.map((withdrawal) =>
      withdrawal.id === selectedWithdrawal.id
        ? {
            ...withdrawal,
            status: WithdrawalStatus.Processing,
            tx_hash: txHash,
          }
        : withdrawal
    )

    setWithdrawals(updatedWithdrawals)
    setIsApproveDialogOpen(false)
  } catch (error) {
    console.error("Unexpected error approving withdrawal:", error)
  } finally {
    setIsLoading(false)
  }
}

const confirmRejectWithdrawal = async () => {
  if (!selectedWithdrawal) return;

  setIsLoading(true);

  try {
    const response = await rejectOrFailWithdrawal(
      selectedWithdrawal.id,
      WithdrawalStatus.Rejected, 
      rejectReason,
    );

    if (!response.success) {
      console.error("RPC error:", response.error);
      return;
    }

    const updatedWithdrawals = withdrawals.map((withdrawal) =>
      withdrawal.id === selectedWithdrawal.id
        ? {
            ...withdrawal,
            status: WithdrawalStatus.Rejected,
            rejectReason,
          }
        : withdrawal
    );

    setWithdrawals(updatedWithdrawals);
    setIsRejectDialogOpen(false);
  } catch (error) {
    console.error("Reject failed", error);
  } finally {
    setIsLoading(false);
  }
};


  const resetFilters = () => {
    setSearchQuery("")
    setStatusFilter("All")
    setCurrentPage(1)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-cosmic-text">Withdrawal Requests</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <WithdrawalFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <Button variant="outline" className="border-cosmic-accent/20 text-cosmic-muted" onClick={resetFilters}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <WithdrawalTable
        paginatedWithdrawals={paginatedWithdrawals}
        handleApproveWithdrawal={handleApproveWithdrawal}
        handleRejectWithdrawal={handleRejectWithdrawal}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <WithdrawalPagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredWithdrawals.length}
        />
      )}

      {/* Dialogs */}
      <ApproveWithdrawalDialog
        isOpen={isApproveDialogOpen}
        setIsOpen={setIsApproveDialogOpen}
        selectedWithdrawal={selectedWithdrawal}
        txHash={txHash}
        setTxHash={setTxHash}
        isLoading={isLoading}
        onConfirm={confirmApproveWithdrawal}
      />

      <RejectWithdrawalDialog
        isOpen={isRejectDialogOpen}
        setIsOpen={setIsRejectDialogOpen}
        selectedWithdrawal={selectedWithdrawal}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        isLoading={isLoading}
        onConfirm={confirmRejectWithdrawal}
      />
    </div>
  )
}
