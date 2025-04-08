import { Wallet } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { UserBalance } from "@/types"
import RewardWithdrawal from "./reward-withdrawal"

export default function RewardPage(): JSX.Element {
  // User balance for withdrawal
  const userBalance: UserBalance = { ton: 0, hxco: 1250 }

  return (
    <div className="container py-4 sm:py-8 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
          Withdraw Funds
        </h1>
        <Card className="w-full sm:w-auto border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm p-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cosmic-tertiary to-cosmic-tertiary flex items-center justify-center">
                <Wallet className="h-4 w-4 text-cosmic-text" />
              </div>
              <div>
                <p className="text-xs text-cosmic-muted">TON Balance</p>
                <p className="font-bold text-cosmic-tertiary">{userBalance.ton.toFixed(2)} TON</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight flex items-center justify-center">
                <span className="text-xs font-bold text-cosmic-text">HX</span>
              </div>
              <div>
                <p className="text-xs text-cosmic-muted">HXCO Balance</p>
                <p className="font-bold text-cosmic-accent">{userBalance.hxco} HXCO</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <RewardWithdrawal userBalance={userBalance} />
    </div>
  )
}
