"use client"

import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

interface WalletConnectProps {
  onConnect: () => void
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 mb-8 rounded-xl border border-cosmic-accent/20 shadow-xl w-full max-w-md bg-cosmic-card/50">
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight flex items-center justify-center mb-6 shadow-lg">
        <Wallet className="w-10 h-10 text-cosmic-text" />
      </div>
      <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
        Connect Your Wallet
      </h2>
      <p className="text-cosmic-muted mb-6 text-center">Connect your TON wallet to start playing and winning rewards</p>
      <Button
        onClick={onConnect}
        className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text shadow-lg transition-all duration-300 hover:shadow-cosmic-accent/20 hover:shadow-xl"
      >
        Connect Wallet
      </Button>
    </div>
  )
}
