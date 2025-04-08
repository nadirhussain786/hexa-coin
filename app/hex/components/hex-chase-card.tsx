"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import AuthModal from "../../components/AuthModal"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import HexChaseGameImage from "./hex-chase-game-image"

interface HexChaseCardProps {
  onPlayClick?: () => void
}

interface UserData {
  id: string
  name: string
  email: string
  hxcoBalance: number
  ptsBalance: number
  tonBalance: number
  referrals: number
  role: string
  avatar: string | null
}
export default function HexChaseCard({ onPlayClick }: HexChaseCardProps) {
  const router = useRouter()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false)

  // Check authentication status on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      setIsLoggedIn(!!storedUser)

      // Check if wallet is connected
      const walletConnected = localStorage.getItem("walletConnected")
      setIsWalletConnected(!!walletConnected)
    }
  }, [])

  const handlePlayNowClick = () => {
    if (!isLoggedIn) {
      // Step 1: If not logged in, show auth modal
      setIsAuthModalOpen(true)
    } else if (onPlayClick) {
      // If we have an onPlayClick handler (on the dashboard), use it
      onPlayClick()
    } else if (!isWalletConnected) {
      // Step 2: If logged in but wallet not connected, show wallet modal
      setIsWalletModalOpen(true)
    } else {
      // Step 3: If logged in and wallet connected, navigate to game
      router.push("/hex-chase")
    }
  }

  const handleAuthSuccess = (userData: UserData) => {
    // Store user data in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData))
      document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=2592000` // 30 days
    }

    setIsLoggedIn(true)
    setIsAuthModalOpen(false)

    // Redirect to hex dashboard after login
    router.push("/hex")
  }

  const handleConnectWallet = () => {
    // Simulate wallet connection
    if (typeof window !== "undefined") {
      localStorage.setItem("walletConnected", "true")
    }

    setIsWalletConnected(true)
    setIsWalletModalOpen(false)

    // Navigate to hex-chase game after wallet connection
    router.push("/hex-chase")
  }

  return (
    <>
      <div className="container py-8 px-4 max-w-md">
        <Card className="overflow-hidden border border-cosmic-accent/30 bg-cosmic-card/50 backdrop-blur-sm shadow-xl shadow-cosmic-accent/10 hover:shadow-cosmic-accent/20 hover:shadow-2xl transition-all duration-300">
          <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-cosmic-accent/20 to-cosmic-highlight/20 relative">
            {/* Replace placeholder with our custom game image */}
            <HexChaseGameImage />
          </div>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-cosmic-text bg-clip-text text-transparent bg-gradient-to-r from-cosmic-text to-cosmic-highlight">
                Hex Chase
              </CardTitle>
              <div className="px-2 py-1 rounded-full text-xs bg-cosmic-tertiary/20 text-cosmic-tertiary border border-cosmic-tertiary/30">
                Live
              </div>
            </div>
            <CardDescription className="text-cosmic-muted">
              Open hexagons and win crypto rewards in this exciting game
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-cosmic-muted mb-4">
              Connect your wallet to start playing and earn TON and HXCO tokens. Open hexagons by watching ads or paying
              with TON.
            </p>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-cosmic-muted">Rewards:</span>
              <span className="text-cosmic-accent font-medium">Up to 50 HXCO</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-cosmic-muted">Cost:</span>
              <span className="text-cosmic-tertiary font-medium">0.2 TON or Watch Ads</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text w-full shadow-lg shadow-cosmic-accent/20 hover:shadow-cosmic-accent/30 hover:shadow-xl transition-all duration-300"
              onClick={handlePlayNowClick}
            >
              Play Now
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={handleAuthSuccess} />

      {/* Wallet Connection Modal */}
      <Dialog open={isWalletModalOpen} onOpenChange={setIsWalletModalOpen}>
        <DialogContent className="sm:max-w-md border-cosmic-accent/30 bg-cosmic-card/95 backdrop-blur-xl shadow-2xl w-[95%]">
          <DialogHeader>
            <DialogTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
              Connect Your Wallet
            </DialogTitle>
            <DialogDescription className="text-cosmic-muted">
              Connect your TON wallet to start playing and winning rewards
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center py-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight flex items-center justify-center mb-6 shadow-2xl animate-pulse">
              <Wallet className="w-10 h-10 text-cosmic-text" />
            </div>
            <p className="text-cosmic-muted text-center mb-6">
              You need to connect your TON wallet to play Hex Chase and earn rewards. Your wallet will be used for
              transactions and to store your earnings.
            </p>
          </div>

          <DialogFooter>
            <Button
              onClick={handleConnectWallet}
              className="w-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text shadow-xl transition-all duration-300 hover:shadow-cosmic-accent/30 hover:shadow-2xl"
            >
              Connect Wallet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
