import type { UserBalance } from "@/types"

interface BalanceDisplayProps {
  balance: UserBalance
}

export function BalanceDisplay({ balance }: BalanceDisplayProps) {
  const ton = Number(balance.balance_ton ?? balance.ton ?? 0);
  const hxco = Number(balance.balance_hxco ?? balance.hxco ?? 0);
  return (
    <div className="flex flex-col sm:flex-row justify-between w-full mb-6 p-4 rounded-lg border border-cosmic-accent/20 shadow-lg bg-cosmic-card/50">
      <div className="mb-4 sm:mb-0">
        <p className="text-sm text-cosmic-muted">TON Balance</p>
        <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmic-tertiary to-cosmic-tertiary">
          {ton.toFixed(2)} TON
        </p>
      </div>
      <div>
        <p className="text-sm text-cosmic-muted">HXCO Balance</p>
        <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
          {hxco} HXCO
        </p>
      </div>
    </div>
  )
}
