"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type WithdrawalPaginationProps = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
};

export function WithdrawalPagination({
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage,
  totalItems,
}: WithdrawalPaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-cosmic-muted">
        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
        results
      </p>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="border-cosmic-accent/20 text-cosmic-muted"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
