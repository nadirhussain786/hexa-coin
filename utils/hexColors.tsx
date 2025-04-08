import type { HexPosition, Hexagon, HexReward } from "@/types"

// Luxury gradient pairs for hexagons
export const luxuryGradients: [string, string][] = [
  ["#FF6B6B", "#FFD166"], // Red to Gold
  ["#4ECDC4", "#00F5D4"], // Teal to Mint
  ["#7B3FE4", "#A45EFF"], // Purple to Lavender (updated to match Version 7)
  ["#F15BB5", "#FF4D8F"], // Pink to Rose (updated to match Version 7)
  ["#00D8FF", "#4ECDC4"], // Cyan to Teal (updated to match Version 7)
  ["#FFD166", "#FF6B6B"], // Gold to Red
  ["#A45EFF", "#F15BB5"], // Lavender to Pink (updated to match Version 7)
  ["#00F5D4", "#00D8FF"], // Mint to Cyan (updated to match Version 7)
  ["#FF6B6B", "#A45EFF"], // Red to Lavender (updated to match Version 7)
  ["#4ECDC4", "#FFD166"], // Teal to Gold
]

// Reward types and probabilities
interface RewardType {
  type: HexReward["type"]
  value: number
  probability: number
}

const rewardTypes: RewardType[] = [
  { type: "HXCO", value: 20, probability: 0.5 },
  { type: "HXCO", value: 30, probability: 0.05 },
  { type: "HXCO", value: 40, probability: 0.03 },
  { type: "HXCO", value: 50, probability: 0.02 },
  { type: "TON", value: 0.25, probability: 0.05 },
  { type: "Discount", value: 0.1, probability: 0.05 },
  { type: "Free Hex", value: 1, probability: 0.1 },
  { type: "Empty", value: 0, probability: 0.2 },
]

// Generate a random reward based on probabilities
export const generateReward = (): HexReward => {
  const rand = Math.random()
  let cumulativeProbability = 0

  for (const reward of rewardTypes) {
    cumulativeProbability += reward.probability
    if (rand < cumulativeProbability) {
      return { type: reward.type, value: reward.value }
    }
  }

  return { type: "Empty", value: 0 } // Fallback
}

// Generate hexagon positions for a hexagonal grid with 61 hexagons
export const generateHexPositions = (): HexPosition[] => {
  const positions: HexPosition[] = []
  const gridRadius = 4 // 0-indexed, so this gives 5 hexagons per side

  for (let q = -gridRadius; q <= gridRadius; q++) {
    const r1 = Math.max(-gridRadius, -q - gridRadius)
    const r2 = Math.min(gridRadius, -q + gridRadius)

    for (let r = r1; r <= r2; r++) {
      const s = -q - r // s coordinate (q + r + s = 0)
      positions.push({ q, r, s })
    }
  }

  return positions
}

// Generate initial hexagons with random colors and rewards
export const generateHexagons = (): Hexagon[] => {
  const positions = generateHexPositions()
  return positions.map((pos, index) => {
    const colorIndex = Math.floor(Math.random() * luxuryGradients.length)
    return {
      id: index,
      q: pos.q,
      r: pos.r,
      s: pos.s,
      colorIndex,
      opened: false,
      reward: generateReward(),
    }
  })
}

// Format time for cooldown display
export const formatCooldownTime = (seconds: number): string => {
  return `${seconds}s`
}
