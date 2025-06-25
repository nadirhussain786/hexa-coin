export interface HexPosition {
  q: number
  r: number
  s: number
}

export interface HexReward {
  type: "HXCO" | "TON" | "Discount" | "Free Hex" | "Empty"
  value: number
}

export interface Hexagon {
  id: number
  q: number
  r: number
  s: number
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

export interface RewardType {
  type: HexReward["type"]
  value: number
  probability: number
}
