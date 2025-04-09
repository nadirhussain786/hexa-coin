import type React from "react"
// Common types used across components

// Game types
export interface Game {
  id: number
  title: string
  description: string
  image: string
  status: "Live" | "Coming Soon"
}

// Reward types
export interface Reward {
  id: number
  name: string
  amount: string
  claimed?: boolean
  progress?: number
  total?: number
  timeLeft?: string
}

// Referral reward types
export interface ReferralReward {
  title: string
  reward: string
}

// Hexagon types
export interface HexPosition {
  q: number
  r: number
  s: number
}

export interface HexReward {
  type: "HXCO" | "TON" | "Discount" | "Free Hex" | "Empty"
  value: number
}

export interface Hexagon extends HexPosition {
  id: number
  colorIndex: number
  opened: boolean
  reward: HexReward
}

export interface UserBalance {
  ton: number
  hxco: number
}

export interface WindowSize {
  width: number
  height: number
}

// Tab types
export interface Tab {
  name: string
  icon: React.ReactNode
}

// Withdrawal types
export interface WithdrawalHistory {
  id: string
  date: string
  amount: number
  currency: "HXCO" | "TON"
  status: WithdrawalStatus
  txHash?: string
  address: string
  userId?: string
  userName?: string
  userEmail?: string
  requestDate?: string
  lastWithdrawalDate?: string
}

export interface WithdrawalFormData {
  amount: number
  currency: "HXCO" | "TON"
  address: string
}

export type WithdrawalStatus = "Completed" | "Pending" | "Failed" | "Processing"

// User types
export interface User {
  id: string
  name: string
  email: string
  hxcoBalance: number
  ptsBalance: number
  tonBalance: number
  referrals: number
  lastWithdrawalDate?: string
  role: "user" | "admin"
  createdAt?: string
  hexBoxPermission?: HexBoxPermission
  avatar?: string | null
}

// Admin types
export interface AdminCredentials {
  email: string
  password: string
}

export interface PaymentSummary {
  totalWithdrawals: number
  pendingWithdrawals: number
  completedWithdrawals: number
  totalUsers: number
  activeUsers: number
}

// Add these new types for hex box permissions
export interface HexBoxPermission {
  allowMultipleOpening: boolean
  maxOpeningsPerDay: number
  expiryDate: string | null // ISO date string when permission expires
  lastUpdated: string // ISO date string when permission was last updated
}

export interface UserData {
  id: string
  username: string
  email?: string
  tonBalance?: number
  hxcoBalance?: number
  hexBoxPermission?: HexBoxPermission
  walletAddress?: string
  referralCode?: string
  [key: string]: any // For any additional properties
}