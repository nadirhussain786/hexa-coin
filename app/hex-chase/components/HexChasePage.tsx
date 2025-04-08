"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Wallet, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { UserData } from "@/types"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import AdPlaceholder from "@/app/hex/components/ad-placeholder"
import HexaChaseGame from "@/app/hex/components/hexa-chase-game"

export default function HexChasePage() {
  const [walletConnected, setWalletConnected] = useState<boolean>(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  // Check authentication and wallet status on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if user is logged in
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser) as UserData
          setUser(userData)
          setIsLoggedIn(true)

          // Check if wallet is connected
          const walletConnected = localStorage.getItem("walletConnected")
          setWalletConnected(!!walletConnected)
          setIsLoading(false)
        } catch (err: unknown) {
          // Invalid stored data, clear it
          console.error("Error parsing user data:", err instanceof Error ? err.message : String(err))
          localStorage.removeItem("user")
          localStorage.removeItem("walletConnected")
          document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
          // Redirect to home if not authenticated
          router.push("/")
        }
      } else {
        // Redirect to home if not authenticated
        setIsLoading(false)
        router.push("/")
      }
    }
  }, [router])

  const connectWallet = (): void => {
    // Simulate wallet connection
    setWalletConnected(true)
    if (typeof window !== "undefined") {
      localStorage.setItem("walletConnected", "true")
    }
  }

  const goBack = (): void => {
    router.push("/hex")
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex flex-col min-h-screen bg-cosmic-bg text-cosmic-text">
      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cosmic-accent/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cosmic-highlight/5 rounded-full blur-3xl -ml-48 -mb-48"></div>
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-cosmic-highlight rounded-full animate-pulse"></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-cosmic-highlight rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-cosmic-accent rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-cosmic-accent rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-cosmic-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Header with back button */}
      <header className="relative z-10 px-6 py-4 border-b border-white/10 backdrop-blur-md bg-cosmic-card/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={goBack}
              className="mr-2 text-cosmic-muted hover:text-cosmic-accent hover:bg-cosmic-accent/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold tracking-wider text-cosmic-text bg-clip-text text-transparent bg-gradient-to-r from-cosmic-text to-cosmic-highlight">
              Hex Chase Game
            </h1>
          </div>

          {isLoggedIn && user && (
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-cosmic-card/50 px-3 py-1 rounded-full border border-cosmic-accent/30 shadow-inner shadow-cosmic-accent/10">
                <span className="text-cosmic-accent font-medium mr-1">{user.hxcoBalance || 0}</span>
                <span className="text-xs text-cosmic-muted">HXCO</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cosmic-accent to-cosmic-secondary flex items-center justify-center text-cosmic-text font-bold">
                {user.name?.charAt(0) || "U"}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content with ads */}
      <div className="flex flex-1 w-full max-w-[1800px] mx-auto relative z-10">
        {/* Left ad space - responsive on all screens */}
        <div className="hidden sm:block w-[120px] lg:w-[160px] xl:w-[300px] flex-shrink-0 p-2">
          <div className="sticky top-4">
            <AdPlaceholder width="100%" height="600px" text="Ad Space (Left)" className="hidden sm:flex" />
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-hidden min-w-0 max-w-full py-8 px-4">
          {isLoggedIn && !walletConnected ? (
            <Card className="max-w-md mx-auto p-8 border border-cosmic-accent/30 bg-cosmic-card/50 backdrop-blur-md shadow-2xl">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight flex items-center justify-center mb-6 shadow-2xl animate-pulse">
                  <Wallet className="w-10 h-10 text-cosmic-text" />
                </div>
                <h2 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
                  Connect Your Wallet
                </h2>
                <p className="text-cosmic-muted mb-6">Connect your TON wallet to start playing and winning rewards</p>
                <Button
                  onClick={connectWallet}
                  className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text shadow-xl transition-all duration-300 hover:shadow-cosmic-accent/30 hover:shadow-2xl"
                >
                  Connect Wallet
                </Button>
              </div>
            </Card>
          ) : isLoggedIn && walletConnected ? (
            <HexaChaseGame walletConnected={true} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-cosmic-muted">Loading...</p>
            </div>
          )}
        </main>

        {/* Right ad space - responsive on all screens */}
        <div className="hidden sm:block w-[120px] lg:w-[160px] xl:w-[300px] flex-shrink-0 p-2">
          <div className="sticky top-4">
            <AdPlaceholder width="100%" height="600px" text="Ad Space (Right)" className="hidden sm:flex" />
          </div>
        </div>
      </div>

      {/* Bottom ad space - visible on all screens */}
      <div className="w-full p-2 bg-cosmic-card/30 border-t border-cosmic-accent/10">
        <AdPlaceholder width="100%" height="90px" text="Ad Space (Bottom)" className="flex" />
      </div>
    </div>
  )
}
