export enum UserStatus {
  Active = "active",
  Inactive = "inactive",
  Banned = "banned",
  Pending = "pending",
}

export enum UserRole {
  Admin = "admin",
  Sub_Admin = "sub-admin",
  User = "user",
}

export enum Tabel {
  Users = "users",
}

export enum WithdrawalStatus {
  Pending = "pending",
  Processing = "processing",
  Confirmed = "confirmed",
  Rejected = "rejected",
  Failed = "failed",
}


export const DEFAULT_HEX_PERMISSION = {
  daily_limit: 2,
  ad_required: 0,
  ton_cost: 0,
  is_banned: false,
};

export const DEFAULT_BALANCE = {
  balance_hxco: 0,
  balance_ton: 0,
};
