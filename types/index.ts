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

