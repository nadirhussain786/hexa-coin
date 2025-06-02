"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Withdrawal } from "@/types";
import { WithdrawalStatus } from "@/constants";
import {
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  XCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WithdrawalStatusBadge } from "./WithdrawalStatusBadge";
import { formatDateTime } from "@/utils/formatDate";

type WithdrawalTableProps = {
  paginatedWithdrawals: Withdrawal[];
  handleApproveWithdrawal: (withdrawal: Withdrawal) => void;
  handleRejectWithdrawal: (withdrawal: Withdrawal) => void;
};

export function WithdrawalTable({
  paginatedWithdrawals,
  handleApproveWithdrawal,
  handleRejectWithdrawal,
}: WithdrawalTableProps) {
  // Format address for display
  const formatAddress = (address: string): string => {
    if (address.length <= 12) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
  };

  // Check if withdrawal is eligible based on 15-day rule
  const isEligibleForWithdrawal = (
    lastWithdrawalDate: string | undefined
  ): boolean => {
    if (!lastWithdrawalDate) return true;

    const lastDate = new Date(lastWithdrawalDate);
    const currentDate = new Date();
    const diffTime = currentDate.getTime() - lastDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays >= 15;
  };

  // Calculate days until eligible
  const daysUntilEligible = (
    lastWithdrawalDate: string | undefined
  ): number => {
    if (!lastWithdrawalDate) return 0;

    const lastDate = new Date(lastWithdrawalDate);
    const currentDate = new Date();
    const diffTime = currentDate.getTime() - lastDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return Math.max(0, 15 - Math.floor(diffDays));
  };

  return (
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
            <TableHead className="text-cosmic-muted text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedWithdrawals.length > 0 ? (
            paginatedWithdrawals.map((withdrawal) => (
              <TableRow
                key={withdrawal.id}
                className="hover:bg-cosmic-accent/5 border-cosmic-accent/10"
              >
                <TableCell>
                  <div>
                    <p className="font-medium text-cosmic-text">
                      {`${withdrawal.users.first_name} ${withdrawal.users.last_name}`}
                    </p>
                    <p className="text-xs text-cosmic-muted">
                      {withdrawal.users.email}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-cosmic-tertiary">
                  {withdrawal.amount} {withdrawal.currency}
                </TableCell>
                <TableCell className="text-cosmic-muted text-sm">
                  {formatDateTime(withdrawal.request_date)}
                </TableCell>
                <TableCell>
                  <WithdrawalStatusBadge status={withdrawal.status} />
                </TableCell>
                <TableCell>
                  {withdrawal.last_withdrawal_date &&
                  isEligibleForWithdrawal(withdrawal.last_withdrawal_date) ? (
                    <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">
                      Eligible
                    </Badge>
                  ) : (
                    <div>
                      <Badge className="bg-cosmic-secondary/20 text-cosmic-secondary hover:bg-cosmic-secondary/30">
                        Wait
                        {withdrawal.last_withdrawal_date &&
                          daysUntilEligible(
                            withdrawal.last_withdrawal_date
                          )}
                        days
                      </Badge>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-cosmic-muted text-xs">
                  {formatAddress(withdrawal.address)}
                </TableCell>
                <TableCell className="text-right">
                  {withdrawal.status === WithdrawalStatus.Pending && (
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 border-green-500/30 text-green-500 hover:bg-green-500/10"
                        onClick={() => handleApproveWithdrawal(withdrawal)}
                        disabled={
                          !isEligibleForWithdrawal(
                            withdrawal.last_withdrawal_date || ""
                          )
                        }
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
                  {withdrawal.status !== WithdrawalStatus.Pending && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-cosmic-card border-cosmic-accent/20"
                      >
                        <DropdownMenuLabel className="text-cosmic-muted">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-cosmic-accent/10" />
                        <DropdownMenuItem className="text-cosmic-text cursor-pointer">
                          View Details
                        </DropdownMenuItem>
                        {withdrawal.status === WithdrawalStatus.Processing && (
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
  );
}
