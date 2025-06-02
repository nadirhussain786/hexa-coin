import React from "react";
import { Badge } from "@/components/ui/badge";
import { WithdrawalStatus } from "@/constants";

const withdrawalStatusClasses: Record<
  WithdrawalStatus,
  { background: string; text: string }
> = {
  [WithdrawalStatus.Pending]: {
    background: "bg-yellow-100",
    text: "text-yellow-700",
  },
  [WithdrawalStatus.Processing]: {
    background: "bg-blue-100",
    text: "text-blue-800",
  },
  [WithdrawalStatus.Confirmed]: {
    background: "bg-green-100",
    text: "text-green-800",
  },
  [WithdrawalStatus.Rejected]: {
    background: "bg-red-100",
    text: "text-red-700",
  },
  [WithdrawalStatus.Failed]: {
    background: "bg-gray-100",
    text: "text-gray-600",
  },
};

export const WithdrawalStatusBadge = ({
  status,
}: {
  status: WithdrawalStatus;
}) => {
  const { background, text } = withdrawalStatusClasses[status];

  return (
    <Badge
      className={`w-fit capitalize flex justify-center ${background} ${text} hover:${background} hover:${text}`}
    >
      {status}
    </Badge>
  );
};
