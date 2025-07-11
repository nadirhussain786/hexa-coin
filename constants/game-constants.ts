import type { RewardType } from "@/types/game-types"

export const luxuryGradients: [string, string][] = [
  ["#FF6B6B", "#FFD166"], // Red to Gold
  ["#4ECDC4", "#00F5D4"], // Teal to Mint
  ["#6A0572", "#AB83A1"], // Purple to Mauve
  ["#F15BB5", "#9B5DE5"], // Pink to Lavender
  ["#00BBF9", "#4ECDC4"], // Blue to Teal
  ["#FFD166", "#FF6B6B"], // Gold to Red
  ["#9B5DE5", "#F15BB5"], // Lavender to Pink
  ["#00F5D4", "#00BBF9"], // Mint to Blue
  ["#FF6B6B", "#9B5DE5"], // Red to Lavender
  ["#4ECDC4", "#FFD166"], // Teal to Gold
]

export const rewardTypes: RewardType[] = [
  { type: "HXCO", value: 20, probability: 0.5 },
  { type: "HXCO", value: 30, probability: 0.05 },
  { type: "HXCO", value: 40, probability: 0.03 },
  { type: "HXCO", value: 50, probability: 0.02 },
  { type: "TON", value: 0.25, probability: 0.05 },
  { type: "Discount", value: 0.1, probability: 0.05 },
  { type: "Free Hex", value: 1, probability: 0.1 },
  { type: "Empty", value: 0, probability: 0.2 },
]
