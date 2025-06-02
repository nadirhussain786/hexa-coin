"use client"

import { Sparkles } from "lucide-react"

interface UserData {
  name: string
  hxcoBalance: number
}

interface HexHeaderProps {
  user: UserData | null
  isEarningAnimating: boolean
  hxcoEarnings: number
}

const HexHeader: React.FC<HexHeaderProps> = ({ user, isEarningAnimating, hxcoEarnings }) => {
  const initialLetter = user?.name?.charAt(0) || "U"
  const balanceDifference = hxcoEarnings - ((user?.hxcoBalance || 0) - hxcoEarnings)

  return (
    <header className="relative z-10 px-6 py-4 border-b border-white/10 backdrop-blur-md bg-cosmic-card/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-gradient-to-br from-cosmic-accent to-cosmic-secondary rounded-xl flex items-center justify-center mr-3 shadow-[0_0_20px_rgba(123,63,228,0.4)]">
            <Sparkles className="h-5 w-5 text-cosmic-text animate-pulse" />
          </div>
          <h1 className="text-xl font-bold tracking-wider text-cosmic-text bg-clip-text text-transparent bg-gradient-to-r from-cosmic-text to-cosmic-highlight">
            Hex
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-cosmic-card/50 px-3 py-1 rounded-full border border-cosmic-accent/30 shadow-inner shadow-cosmic-accent/10 relative overflow-hidden">
            <span className={`text-cosmic-accent font-medium mr-1 ${isEarningAnimating ? "animate-pulse" : ""}`}>
              {user?.hxcoBalance || 0}
            </span>
            <span className="text-xs text-cosmic-muted">HXCO</span>

            {isEarningAnimating && (
              <div className="absolute inset-0 bg-cosmic-accent/10 flex items-center justify-center">
                <span className="text-cosmic-accent text-xs font-bold animate-bounce">+{balanceDifference}</span>
              </div>
            )}
          </div>

          <button className="w-8 h-8 rounded-full bg-gradient-to-br from-cosmic-accent to-cosmic-secondary flex items-center justify-center text-cosmic-text font-bold shadow-lg shadow-cosmic-accent/20 hover:shadow-cosmic-accent/40 transition-shadow">
            {initialLetter}
          </button>
        </div>
      </div>
    </header>
  )
}

export default HexHeader
