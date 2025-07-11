"use client"

import { cn } from "@/lib/utils"
import { luxuryGradients } from "@/constants/game-constants"
import { Diamond } from "lucide-react"
import type { Hexagon } from "@/types/game-types"

interface HexagonGridProps {
  hexagons: Hexagon[]
  containerSize: number
  hoveredHex: number | null
  onHexClick: (id: number) => void
  onHexHover: (id: number | null) => void
}

export function HexagonGrid({ hexagons, containerSize, hoveredHex, onHexClick, onHexHover }: HexagonGridProps) {
  return (
    <div className="relative mb-8">
      {/* Outer hexagon container */}
      <div
        className="relative overflow-hidden"
        style={{
          width: `${containerSize}px`,
          height: `${containerSize * 0.866}px`, // Height of a hexagon is width * 0.866
          clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          boxShadow: "0 0 30px rgba(123, 63, 228, 0.2)",
        }}
      >
        {/* Inner hexagons */}
        {hexagons.map((hex) => {
          // Calculate the size of each small hexagon to fit perfectly
          const gridRadius = 4 // 5 hexagons per side (0-indexed)
          const hexSize = containerSize / (2 * gridRadius + 1) / 2.1 // Adjusted to fit perfectly

          // Calculate position within the container
          const hexWidth = hexSize * 2
          const hexHeight = hexSize * Math.sqrt(3)

          // Center coordinates
          const centerX = containerSize / 2
          const centerY = (containerSize * 0.866) / 2

          // Calculate position using axial coordinates
          const x = centerX + hexSize * 1.5 * hex.q
          const y = centerY + hexSize * Math.sqrt(3) * (hex.r + hex.q / 2)

          const [color1, color2] = luxuryGradients[hex.colorIndex]
          const isHovered = hoveredHex === hex.id

          return (
            <div
              key={hex.id}
              className={cn(
                "absolute transition-all duration-300 ease-in-out cursor-pointer",
                hex.opened ? "opacity-90" : "hover:scale-105 hover:z-10",
              )}
              style={{
                width: `${hexWidth}px`,
                height: `${hexHeight}px`,
                left: `${x - hexWidth / 2}px`,
                top: `${y - hexHeight / 2}px`,
                clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                background: hex.opened
                  ? "linear-gradient(135deg, #222222, #333333)"
                  : `linear-gradient(135deg, ${color1}, ${color2})`,
                border: hex.opened ? "1px solid #555555" : isHovered ? `2px solid ${color1}` : `1px solid ${color1}33`,
                zIndex: isHovered ? 10 : 1,
                boxShadow: isHovered
                  ? `0 0 15px ${color1}66, inset 0 0 8px ${color1}44`
                  : hex.opened
                    ? "none"
                    : `0 0 5px ${color1}22`,
                transform: isHovered && !hex.opened ? "scale(1.05)" : "scale(1)",
              }}
              onClick={() => !hex.opened && onHexClick(hex.id)}
              onMouseEnter={() => onHexHover(hex.id)}
              onMouseLeave={() => onHexHover(null)}
            >
              {hex.opened && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {hex.reward.type === "HXCO" && (
                    <div className="flex flex-col items-center">
                      <Diamond className="w-3 h-3 text-cosmic-secondary mb-0.5" />
                      <span className="font-bold text-cosmic-secondary text-xs">{hex.reward.value}</span>
                    </div>
                  )}
                  {hex.reward.type === "TON" && (
                    <span className="font-bold text-cosmic-tertiary text-xs">{hex.reward.value}</span>
                  )}
                  {hex.reward.type === "Discount" && (
                    <span className="font-bold text-[#FFD166] text-xs">{hex.reward.value}</span>
                  )}
                  {hex.reward.type === "Free Hex" && <span className="font-bold text-[#4ECDC4] text-xs">Free</span>}
                  {hex.reward.type === "Empty" && <span className="text-zinc-500 text-xs">Empty</span>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
