import type { UserBalance } from "@/types/game-types"

interface BalanceDisplayProps {
  balance: UserBalance
}

export function BalanceDisplay({ balance }: BalanceDisplayProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between w-full mb-6 p-4 rounded-lg border border-cosmic-accent/20 shadow-lg bg-cosmic-card/50">
      <div className="mb-4 sm:mb-0">
        <p className="text-sm text-cosmic-muted">TON Balance</p>
        <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmic-tertiary to-cosmic-tertiary">
          {balance.ton.toFixed(2)} TON
        </p>
      </div>
      <div>
        <p className="text-sm text-cosmic-muted">HXCO Balance</p>
        <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
          {balance.hxco} HXCO
        </p>
      </div>
    </div>
  )
}
