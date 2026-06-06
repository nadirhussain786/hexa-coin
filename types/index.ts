import { UserStatus, WithdrawalStatus as DBWithdrawalStatus } from "@/constants";
import type React from "react";

// ─── Telegram / Auth ────────────────────────────────────────────────────────

export type TelegramUserBase = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
};

export type TelegramUserInput = {
  telegram_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
};

export enum Role {
  User = "user",
  Admin = "admin",
  SubAdmin = "sub-admin",
}

// ─── DB Entities ─────────────────────────────────────────────────────────────

export type TgUser = {
  id: string;
  telegram_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  email?: string;
  referral_code?: string;
  registered_at: string;
  created_at: string;
  status: string;
  role: string;
};

export interface HexPermission {
  id: string;
  name?: string;
  user_id: string;
  daily_limit: number;
  ad_required: number;
  ton_cost: number;
  is_banned: boolean;
  updated_at: string;
  created_at: string;
}

export interface UserBalance {
  id?: string;
  user_id?: string;
  balance_hxco: number;
  balance_ton: number;
  created_at?: string;
  updated_at?: string;
  /** shorthand aliases used in game UI */
  ton?: number;
  hxco?: number;
}

export interface TelegramUserFull {
  user: TgUser;
  hex_permission: HexPermission;
  user_balance: UserBalance;
}

// ─── Game ─────────────────────────────────────────────────────────────────────

export interface HexPosition {
  q: number;
  r: number;
  s: number;
}

export interface HexReward {
  type: "HXCO" | "TON" | "Discount" | "Free Hex" | "Empty";
  value: number;
}

export interface Hexagon extends HexPosition {
  id: number;
  colorIndex: number;
  opened: boolean;
  reward: HexReward;
}

export interface RewardType {
  type: HexReward["type"];
  value: number;
  probability: number;
}

export interface GameSession {
  id: string;
  user_id: string;
  hex_index: number;
  reward_type: string;
  reward_value: number;
  opened_at: string;
}

export interface WindowSize {
  width: number;
  height: number;
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

export interface Task {
  id: string;
  title: string;
  description?: string;
  reward_hxco: number;
  reward_ton: number;
  task_type: "one_time" | "daily";
  action_url?: string;
  action_type: "link" | "telegram" | "twitter" | "none";
  icon: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface UserTask {
  id: string;
  user_id: string;
  task_id: string;
  completed_at: string;
  rewarded: boolean;
}

export interface TaskWithStatus extends Task {
  completed: boolean;
}

// ─── Rewards / Withdrawals ────────────────────────────────────────────────────

export interface Reward {
  id: number;
  name: string;
  amount: string;
  claimed?: boolean;
  progress?: number;
  total?: number;
  timeLeft?: string;
}

export interface ReferralReward {
  title: string;
  reward: string;
}

export type Withdrawal = {
  id: string;
  user_id: string;
  amount: number;
  currency: "TON" | "HXCO";
  address: string;
  request_date: string;
  status: DBWithdrawalStatus;
  tx_hash: string | null;
  reason: string | null;
  last_withdrawal_date: string | null;
  created_at: string;
  users?: Users;
};

export interface WithdrawalFormData {
  amount: number;
  currency: "HXCO" | "TON";
  address: string;
}

export type WithdrawalStatus =
  | "Completed"
  | "Pending"
  | "Processing"
  | "Failed"
  | "Rejected";

export interface WithdrawalHistory {
  id: string;
  date: string;
  amount: number;
  currency: "HXCO" | "TON";
  status: WithdrawalStatus;
  txHash?: string;
  address: string;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminCredentials {
  email: string;
  password: string;
}

export type User = {
  id: string;
  name: string;
  email: string;
  hxco: number;
  ton: number;
  referrals: number;
  registered: string | null;
  role: string;
  status: UserStatus;
  telegram_id: string | null;
};

export type Users = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

export type DashboardStats = {
  totalUsers: number;
  activeUsers: number;
  totalWithdrawals: number;
  pendingWithdrawals: number;
  completedWithdrawals: number;
  totalHxcoDistributed?: number;
  hexOpensToday?: number;
};

// ─── UI ───────────────────────────────────────────────────────────────────────

export interface Tab {
  name: string;
  icon: React.ReactNode;
}

export interface HexBoxPermission {
  allowMultipleOpening: boolean;
  maxOpeningsPerDay: number;
  expiryDate: string | null;
  lastUpdated: string;
}

export interface UserData {
  id: string;
  username: string;
  email?: string;
  tonBalance?: number;
  hxcoBalance?: number;
  hexBoxPermission?: HexBoxPermission;
  walletAddress?: string;
  referralCode?: string;
  referrals?: number;
  [key: string]: unknown;
}

export interface Game {
  id: number;
  title: string;
  description: string;
  image: string;
  status: "Live" | "Coming Soon";
}
