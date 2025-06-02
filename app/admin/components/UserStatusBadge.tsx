import React from "react";
import { Badge } from "@/components/ui/badge";
import { UserStatus } from "@/constants";

const userStatusClasses = {
  active: {
    background: "bg-green-100",
    text: "text-green-800",
  },
  inactive: {
    background: "bg-gray-100",
    text: "text-gray-600",
  },
  banned: {
    background: "bg-red-100",
    text: "text-red-700",
  },
  pending: {
    background: "bg-yellow-100",
    text: "text-yellow-700",
  },
} as const;

export const UserStatusBadge = ({ status }: { status: UserStatus }) => {
  const { background, text } = userStatusClasses[status];

  return (
    <Badge
      className={`w-fit capitalize flex justify-center ${background} ${text} hover:${background} hover:${text}`}
    >
      {status}
    </Badge>
  );
};
