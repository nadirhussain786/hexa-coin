import { luxuryGradients, rewardTypes } from "@/constants/game-constants";
import { Hexagon, HexPosition, HexReward } from "@/types/game-types";

// Generate a random reward based on probabilities
export const generateReward = (): HexReward => {
  const rand = Math.random();
  let cumulativeProbability = 0;

  for (const reward of rewardTypes) {
    cumulativeProbability += reward.probability;
    if (rand < cumulativeProbability) {
      return { type: reward.type, value: reward.value };
    }
  }

  return { type: "Empty", value: 0 }; // Fallback
};

// Generate hexagon positions for a hexagonal grid with 61 hexagons
export const generateHexPositions = (): HexPosition[] => {
  const positions: HexPosition[] = [];
  const gridRadius = 4; // 0-indexed, so this gives 5 hexagons per side

  for (let q = -gridRadius; q <= gridRadius; q++) {
    const r1 = Math.max(-gridRadius, -q - gridRadius);
    const r2 = Math.min(gridRadius, -q + gridRadius);

    for (let r = r1; r <= r2; r++) {
      const s = -q - r; // s coordinate (q + r + s = 0)
      positions.push({ q, r, s });
    }
  }

  return positions;
};

// Generate initial hexagons with random colors and rewards
export const generateHexagons = (): Hexagon[] => {
  const positions = generateHexPositions();
  return positions.map((pos, index) => {
    const colorIndex = Math.floor(Math.random() * luxuryGradients.length);
    return {
      id: index,
      q: pos.q,
      r: pos.r,
      s: pos.s,
      colorIndex,
      opened: false,
      reward: generateReward(),
    };
  });
};

// Format time for cooldown display
export const formatCooldownTime = (seconds: number): string => {
  return `${seconds}s`;
};
