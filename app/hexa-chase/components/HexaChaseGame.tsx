"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, AlertCircle, Diamond } from "lucide-react"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Hexagon, HexPosition, HexReward, UserBalance, WindowSize } from "@/types"

// Luxury gradient pairs for hexagons
const luxuryGradients: [string, string][] = [
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
const generateReward = (): HexReward => {
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
const generateHexPositions = (): HexPosition[] => {
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
const generateHexagons = (): Hexagon[] => {
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

export default function HexaChaseGame() {
  const [hexagons, setHexagons] = useState<Hexagon[]>(() => generateHexagons())
  const [walletConnected, setWalletConnected] = useState<boolean>(false)
  const [userBalance, setUserBalance] = useState<UserBalance>({ ton: 1.0, hxco: 0 })
  const [selectedHex, setSelectedHex] = useState<Hexagon | null>(null)
  const [showReward, setShowReward] = useState<boolean>(false)
  const [currentReward, setCurrentReward] = useState<HexReward | null>(null)
  const [windowSize, setWindowSize] = useState<WindowSize>({ width: 0, height: 0 })
  const [hoveredHex, setHoveredHex] = useState<number | null>(null)

  // Handle window resize
  useEffect(() => {
    const handleResize = (): void => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Calculate container size and hexagon dimensions based on screen size
  const containerSize = useMemo((): number => {
    // Responsive sizing based on screen width
    if (windowSize.width < 640) return Math.min(windowSize.width - 40, 400)
    return Math.min(windowSize.width * 0.8, 600)
  }, [windowSize.width])

  // Connect wallet handler
  const connectWallet = (): void => {
    // In a real app, this would connect to TON wallet
    setWalletConnected(true)
  }

  // Open hexagon handler
  const openHexagon = (id: number): void => {
    if (!walletConnected) return

    const hex = hexagons.find((h) => h.id === id)
    if (!hex || hex.opened) return

    setSelectedHex(hex)
  }

  // Confirm opening hexagon
  const confirmOpenHexagon = (): void => {
    if (!selectedHex) return

    if (userBalance.ton < 0.2) {
      alert("Insufficient TON balance")
      setSelectedHex(null)
      return
    }

    // Update balances
    const newBalance = { ...userBalance, ton: userBalance.ton - 0.2 }

    // Apply reward
    if (selectedHex.reward.type === "HXCO") {
      newBalance.hxco += selectedHex.reward.value
    } else if (selectedHex.reward.type === "TON") {
      newBalance.ton += selectedHex.reward.value
    } else if (selectedHex.reward.type === "Discount") {
      newBalance.ton += selectedHex.reward.value // Refund discount amount
    } else if (selectedHex.reward.type === "Free Hex") {
      newBalance.ton += 0.2 // Refund the cost
    }

    setUserBalance(newBalance)

    // Update hexagons
    setHexagons(hexagons.map((h) => (h.id === selectedHex.id ? { ...h, opened: true } : h)))

    // Show reward
    setCurrentReward(selectedHex.reward)
    setShowReward(true)
    setSelectedHex(null)
  }

  // Close reward dialog
  const closeReward = (): void => {
    setShowReward(false)
    setCurrentReward(null)
  }

  // Verify we have exactly 61 hexagons
  const hexagonCount = hexagons.length

  return (
    <div className="flex flex-col items-center w-full max-w-4xl px-4">
      {!walletConnected ? (
        <div className="flex flex-col items-center justify-center p-8 mb-8 rounded-xl border border-cosmic-accent/20 shadow-xl w-full max-w-md bg-cosmic-card/50">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight flex items-center justify-center mb-6 shadow-lg">
            <Wallet className="w-10 h-10 text-cosmic-text" />
          </div>
          <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
            Connect Your Wallet
          </h2>
          <p className="text-cosmic-muted mb-6 text-center">
            Connect your TON wallet to start playing and winning rewards
          </p>
          <Button
            onClick={connectWallet}
            className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text shadow-lg transition-all duration-300 hover:shadow-cosmic-accent/20 hover:shadow-xl"
          >
            Connect Wallet
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between w-full mb-6 p-4 rounded-lg border border-cosmic-accent/20 shadow-lg bg-cosmic-card/50">
            <div className="mb-4 sm:mb-0">
              <p className="text-sm text-cosmic-muted">TON Balance</p>
              <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmic-tertiary to-cosmic-tertiary">
                {userBalance.ton.toFixed(2)} TON
              </p>
            </div>
            <div>
              <p className="text-sm text-cosmic-muted">HXCO Balance</p>
              <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
                {userBalance.hxco} HXCO
              </p>
            </div>
          </div>

          <Alert className="mb-6 border border-cosmic-secondary/30 shadow-lg bg-cosmic-card/50">
            <AlertCircle className="h-4 w-4 text-cosmic-secondary" />
            <AlertTitle className="text-cosmic-text">Opening costs 0.2 TON</AlertTitle>
            <AlertDescription className="text-cosmic-muted">
              Each hexagon costs 0.2 TON to open. Click on a hexagon to reveal your reward!
            </AlertDescription>
          </Alert>

          <div className="text-center mb-2 text-cosmic-muted text-sm">
            <span className="font-semibold text-cosmic-text">{hexagonCount}</span> hexagons in one big hexagon
          </div>

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
                      border: hex.opened
                        ? "1px solid #555555"
                        : isHovered
                          ? `2px solid ${color1}`
                          : `1px solid ${color1}33`,
                      zIndex: isHovered ? 10 : 1,
                      boxShadow: isHovered
                        ? `0 0 15px ${color1}66, inset 0 0 8px ${color1}44`
                        : hex.opened
                          ? "none"
                          : `0 0 5px ${color1}22`,
                      transform: isHovered && !hex.opened ? "scale(1.05)" : "scale(1)",
                    }}
                    onClick={() => !hex.opened && openHexagon(hex.id)}
                    onMouseEnter={() => setHoveredHex(hex.id)}
                    onMouseLeave={() => setHoveredHex(null)}
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
                        {hex.reward.type === "Free Hex" && (
                          <span className="font-bold text-[#4ECDC4] text-xs">Free</span>
                        )}
                        {hex.reward.type === "Empty" && <span className="text-zinc-500 text-xs">Empty</span>}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={selectedHex !== null} onOpenChange={() => setSelectedHex(null)}>
        <DialogContent className="shadow-xl max-w-sm mx-auto bg-cosmic-card border-cosmic-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
              Open Hexagon
            </DialogTitle>
            <DialogDescription className="text-cosmic-muted">
              Opening this hexagon will cost 0.2 TON. Do you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setSelectedHex(null)}
              className="border-cosmic-accent/20 text-cosmic-muted hover:bg-cosmic-accent/10 hover:text-cosmic-text"
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text shadow-lg transition-all duration-300"
              onClick={confirmOpenHexagon}
            >
              Open for 0.2 TON
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reward Dialog */}
      <Dialog open={showReward} onOpenChange={closeReward}>
        <DialogContent className="border-cosmic-accent/20 shadow-xl max-w-sm mx-auto bg-cosmic-card">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl bg-gradient-to-r from-cosmic-text to-cosmic-muted bg-clip-text text-transparent">
              {currentReward?.type === "Empty" ? "Better luck next time!" : "Congratulations!"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8">
            {currentReward?.type === "HXCO" && (
              <>
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(123,63,228,0.5)]">
                  <span className="text-2xl font-bold text-cosmic-text">+{currentReward.value}</span>
                </div>
                <p className="text-xl font-bold text-cosmic-secondary">{currentReward.value} HXCO</p>
              </>
            )}
            {currentReward?.type === "TON" && (
              <>
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cosmic-tertiary to-cosmic-tertiary flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,216,255,0.5)]">
                  <span className="text-2xl font-bold text-cosmic-text">+{currentReward.value}</span>
                </div>
                <p className="text-xl font-bold text-cosmic-tertiary">{currentReward.value} TON</p>
              </>
            )}
            {currentReward?.type === "Discount" && (
              <>
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#FFD166] to-[#FF6B6B] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,209,102,0.5)]">
                  <span className="text-2xl font-bold text-cosmic-text">{currentReward.value}</span>
                </div>
                <p className="text-xl font-bold text-[#FFD166]">{currentReward.value} TON Discount</p>
              </>
            )}
            {currentReward?.type === "Free Hex" && (
              <>
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#4ECDC4] to-[#00F5D4] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(78,205,196,0.5)]">
                  <span className="text-2xl font-bold text-cosmic-text">Free</span>
                </div>
                <p className="text-xl font-bold text-[#4ECDC4]">Free Hexagon</p>
              </>
            )}
            {currentReward?.type === "Empty" && (
              <>
                <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-zinc-500">Empty</span>
                </div>
                <p className="text-xl font-bold text-zinc-500">No Reward</p>
              </>
            )}
          </div>
          <Button
            className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text shadow-lg transition-all duration-300"
            onClick={closeReward}
          >
            Continue Playing
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

