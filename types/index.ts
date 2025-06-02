import { UserStatus, WithdrawalStatus } from "@/constants";
import type React from "react";
// Common types used across components

export enum Role {
  User = "user",
  Admin = "admin",
}
// Game types
export interface Game {
  id: number;
  title: string;
  description: string;
  image: string;
  status: "Live" | "Coming Soon";
}

// Reward types
export interface Reward {
  id: number;
  name: string;
  amount: string;
  claimed?: boolean;
  progress?: number;
  total?: number;
  timeLeft?: string;
}

// Referral reward types
export interface ReferralReward {
  title: string;
  reward: string;
}

// Hexagon types
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

export interface UserBalance {
  ton: number;
  hxco: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

// Tab types
export interface Tab {
  name: string;
  icon: React.ReactNode;
}

export interface WithdrawalFormData {
  amount: number;
  currency: "HXCO" | "TON";
  address: string;
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

export interface HexPermission {
  id: string;
  name: string;
  user_id: string;
  daily_limit: number;
  ad_required: number;
  ton_cost: number;
  is_banned: boolean;
  updated_at: string;
  created_at: string;
}

// Admin types
export interface AdminCredentials {
  email: string;
  password: string;
}

// Add these new types for hex box permissions
export interface HexBoxPermission {
  allowMultipleOpening: boolean;
  maxOpeningsPerDay: number;
  expiryDate: string | null; // ISO date string when permission expires
  lastUpdated: string; // ISO date string when permission was last updated
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
  [key: string]: any; // For any additional properties
}

export type Users = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

export type Withdrawal = {
  id: string;
  user_id: string;
  amount: number;
  currency: "TON";
  address: string;
  request_date: string;
  status: WithdrawalStatus;
  tx_hash: string | null;
  reason: string | null;
  last_withdrawal_date: string | null;
  created_at: string;
  users: Users;
};

export type DashboardStats = {
  totalUsers: number;
  activeUsers: number;
  totalWithdrawals: number;
  pendingWithdrawals: number;
  completedWithdrawals: number;
};
