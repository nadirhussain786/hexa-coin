"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, AlertCircle, Diamond, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Hexagon, HexPosition, HexReward, UserBalance, WindowSize } from "@/types"

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

interface HexaChaseGameProps {
  isEmbedded?: boolean
  walletConnected?: boolean
}

export default function HexaChaseGame({
  isEmbedded = false,
  walletConnected: externalWalletConnected = false,
}: HexaChaseGameProps): JSX.Element {
  const [hexagons, setHexagons] = useState<Hexagon[]>(() => generateHexagons())
  const [walletConnected, setWalletConnected] = useState<boolean>(externalWalletConnected)
  // Update the initial user balance to have 0 TON
  const [userBalance, setUserBalance] = useState<UserBalance>({ ton: 0, hxco: 0 })
  const [selectedHex, setSelectedHex] = useState<Hexagon | null>(null)
  const [showReward, setShowReward] = useState<boolean>(false)
  const [currentReward, setCurrentReward] = useState<HexReward | null>(null)
  const [windowSize, setWindowSize] = useState<WindowSize>({ width: 0, height: 0 })
  const [hoveredHex, setHoveredHex] = useState<number | null>(null)

  // Add state for ad viewing
  const [adViewCount, setAdViewCount] = useState<number>(0)
  const [showAdDialog, setShowAdDialog] = useState<boolean>(false)
  const [adLoading, setAdLoading] = useState<boolean>(false)
  const [showOpenOptions, setShowOpenOptions] = useState<boolean>(false)

  // Add state for ad viewing limits
  const [adViewsToday, setAdViewsToday] = useState<number>(0)
  const [lastAdViewTime, setLastAdViewTime] = useState<number>(0)
  const [adCooldown, setAdCooldown] = useState<number>(0)
  const adCooldownInterval = useRef<NodeJS.Timeout | null>(null)
  const [showAdLimitMessage, setShowAdLimitMessage] = useState<boolean>(false)

  // Effect to sync with external wallet connected state
  useEffect(() => {
    setWalletConnected(externalWalletConnected)
  }, [externalWalletConnected])

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

  // Effect to handle ad cooldown timer
  useEffect(() => {
    if (adCooldown > 0) {
      adCooldownInterval.current = setInterval(() => {
        setAdCooldown((prev) => {
          if (prev <= 1) {
            if (adCooldownInterval.current) {
              clearInterval(adCooldownInterval.current)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (adCooldownInterval.current) {
        clearInterval(adCooldownInterval.current)
      }
    }
  }, [adCooldown])

  // Effect to reset ad views count at midnight
  useEffect(() => {
    const checkDate = (): void => {
      const now = new Date()
      const lastViewDate = new Date(lastAdViewTime)

      // If it's a new day, reset the ad views count
      if (
        now.getDate() !== lastViewDate.getDate() ||
        now.getMonth() !== lastViewDate.getMonth() ||
        now.getFullYear() !== lastViewDate.getFullYear()
      ) {
        setAdViewsToday(0)
      }
    }

    // Check when component mounts
    if (lastAdViewTime > 0) {
      checkDate()
    }

    // Set up interval to check every hour
    const interval = setInterval(checkDate, 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [lastAdViewTime])

  // Calculate container size and hexagon dimensions based on screen size
  const containerSize = useMemo((): number => {
    // Responsive sizing based on screen width
    if (isEmbedded) {
      return Math.min(windowSize.width * 0.8, 500)
    }
    if (windowSize.width < 640) return Math.min(windowSize.width - 40, 400)
    return Math.min(windowSize.width * 0.8, 600)
  }, [windowSize.width, isEmbedded])

  // Connect wallet handler
  const connectWallet = (): void => {
    // In a real app, this would connect to TON wallet
    setWalletConnected(true)
  }

  // Update the openHexagon function to show options instead of directly opening
  const openHexagon = (id: number): void => {
    if (!walletConnected) return

    const hex = hexagons.find((h) => h.id === id)
    if (!hex || hex.opened) return

    setSelectedHex(hex)
    setShowOpenOptions(true)
  }

  // Add function to handle ad viewing
  const watchAd = (): void => {
    // Check if user has reached the daily limit
    if (adViewsToday >= 2) {
      setShowAdLimitMessage(true)
      return
    }

    // Check if we're in the cooldown period
    if (adCooldown > 0) {
      return
    }

    setAdLoading(true)
    setShowAdDialog(true)

    // Simulate ad loading and viewing
    setTimeout(() => {
      setAdLoading(false)

      // After ad is "watched"
      setTimeout(() => {
        // Update ad view count and time
        setAdViewCount(adViewCount + 1)
        setAdViewsToday(adViewsToday + 1)
        setLastAdViewTime(Date.now())

        // Set cooldown for 7 seconds
        setAdCooldown(7)

        setShowAdDialog(false)

        // If user has watched 10 ads, open the hexagon
        if (adViewCount + 1 >= 10) {
          setAdViewCount(0)
          confirmOpenHexagon()
        }
      }, 2000)
    }, 1500)
  }

  // Add function to handle TON payment
  const payWithTON = (): void => {
    if (userBalance.ton < 0.2) {
      alert("Insufficient TON balance")
      setShowOpenOptions(false)
      setSelectedHex(null)
      return
    }

    // Deduct TON and open hexagon
    setUserBalance({ ...userBalance, ton: userBalance.ton - 0.2 })
    confirmOpenHexagon()
  }

  // Update confirmOpenHexagon to not check TON balance
  const confirmOpenHexagon = (): void => {
    if (!selectedHex) return

    // Update hexagons
    setHexagons(hexagons.map((h) => (h.id === selectedHex.id ? { ...h, opened: true } : h)))

    // Show reward
    setCurrentReward(selectedHex.reward)
    setShowReward(true)
    setSelectedHex(null)
    setShowOpenOptions(false)
  }

  // Close reward dialog
  const closeReward = (): void => {
    setShowReward(false)
    setCurrentReward(null)
  }

  // Format time for cooldown display
  const formatCooldownTime = (seconds: number): string => {
    return `${seconds}s`
  }

  // Verify we have exactly 61 hexagons
  const hexagonCount = hexagons.length

  return (
    <div className={`flex flex-col items-center w-full ${isEmbedded ? "" : "max-w-4xl"} px-4`}>
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

      {/* Open Options Dialog */}
      <Dialog open={showOpenOptions} onOpenChange={setShowOpenOptions}>
        <DialogContent className="shadow-xl max-w-sm mx-auto bg-cosmic-card border-cosmic-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
              Open Hexagon
            </DialogTitle>
            <DialogDescription className="text-cosmic-muted">
              Choose how you want to open this hexagon
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="relative">
                <Button
                  onClick={watchAd}
                  disabled={adCooldown > 0 || adViewsToday >= 2}
                  className={
                    adCooldown > 0 || adViewsToday >= 2
                      ? "bg-cosmic-card border border-cosmic-accent/20 text-cosmic-muted w-full cursor-not-allowed"
                      : "bg-cosmic-card border border-cosmic-accent/20 text-cosmic-text hover:bg-cosmic-accent/10 w-full"
                  }
                >
                  <div className="flex flex-col items-center w-full">
                    <div className="flex items-center justify-center w-full">
                      <span className="text-cosmic-text">Watch Ad</span>
                      {adCooldown > 0 && (
                        <div className="ml-2 flex items-center text-cosmic-muted">
                          <Clock className="h-3 w-3 mr-1" />
                          <span className="text-xs">{formatCooldownTime(adCooldown)}</span>
                        </div>
                      )}
                    </div>
                    <div className="w-full bg-cosmic-bg h-2 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight h-full"
                        style={{ width: `${(adViewCount / 10) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between w-full text-xs mt-1">
                      <span className="text-cosmic-muted">{adViewCount}/10 ads watched</span>
                      <span className="text-cosmic-muted">{adViewsToday}/2 today</span>
                    </div>
                  </div>
                </Button>
                {adViewsToday >= 2 && (
                  <span className="text-xs text-cosmic-secondary absolute -bottom-5 left-0 right-0 text-center">
                    Daily ad limit reached
                  </span>
                )}
              </div>

              <div className="relative">
                <Button
                  onClick={payWithTON}
                  disabled={userBalance.ton < 0.2}
                  className={
                    userBalance.ton >= 0.2
                      ? "bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text w-full"
                      : "bg-cosmic-card border border-cosmic-accent/20 text-cosmic-muted w-full cursor-not-allowed"
                  }
                >
                  Pay 0.2 TON
                </Button>
                {userBalance.ton < 0.2 && (
                  <span className="text-xs text-cosmic-secondary absolute -bottom-5 left-0 right-0 text-center">
                    Insufficient TON balance
                  </span>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowOpenOptions(false)
                setSelectedHex(null)
              }}
              className="border-cosmic-accent/20 text-cosmic-muted hover:bg-cosmic-accent/10 hover:text-cosmic-text"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ad Viewing Dialog */}
      <Dialog open={showAdDialog} onOpenChange={setShowAdDialog}>
        <DialogContent className="shadow-xl max-w-sm mx-auto bg-cosmic-card border-cosmic-accent/20">
          <div className="flex flex-col items-center justify-center py-6">
            {adLoading ? (
              <>
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight flex items-center justify-center mb-6 animate-pulse">
                  <span className="text-2xl font-bold text-cosmic-text">Ad</span>
                </div>
                <DialogTitle className="text-xl text-center mb-2">Loading Advertisement...</DialogTitle>
                <DialogDescription className="text-cosmic-muted text-center max-w-xs">
                  Please wait while we load your advertisement.
                </DialogDescription>
              </>
            ) : (
              <>
                <div className="w-full h-40 bg-cosmic-bg rounded-lg flex items-center justify-center mb-6">
                  <div className="text-center">
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
                      Advertisement
                    </span>
                    <p className="text-cosmic-muted mt-2">This is a simulated advertisement</p>
                  </div>
                </div>
                <DialogDescription className="text-cosmic-muted text-center max-w-xs">
                  Watch this ad to earn progress toward opening a hexagon. You need to watch 10 ads to open one hexagon
                  for free.
                </DialogDescription>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Ad Limit Message Dialog */}
      <Dialog open={showAdLimitMessage} onOpenChange={setShowAdLimitMessage}>
        <DialogContent className="shadow-xl max-w-sm mx-auto bg-cosmic-card border-cosmic-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
              Daily Ad Limit Reached
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-cosmic-muted">
              You've reached your daily limit of 2 ads. Please come back tomorrow to watch more ads or use TON to open
              hexagons.
            </p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowAdLimitMessage(false)}
              className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text"
            >
              Got it
            </Button>
          </DialogFooter>
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
