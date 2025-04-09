import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Wallet, Clock, CheckCircle } from "lucide-react"
import type { PaymentSummary } from "@/types"

interface PaymentSummaryCardProps {
  summary: PaymentSummary
}

export default function PaymentSummaryCard({ summary }: PaymentSummaryCardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-cosmic-text">Total Users</CardTitle>
          <Users className="h-4 w-4 text-cosmic-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cosmic-accent">{summary.totalUsers}</div>
          <p className="text-xs text-cosmic-muted">{summary.activeUsers} active in the last 30 days</p>
        </CardContent>
      </Card>

      <Card className="border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-cosmic-text">Total Withdrawals</CardTitle>
          <Wallet className="h-4 w-4 text-cosmic-tertiary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cosmic-tertiary">{summary.totalWithdrawals.toFixed(2)} TON</div>
          <p className="text-xs text-cosmic-muted">Across all users</p>
        </CardContent>
      </Card>

      <Card className="border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-cosmic-text">Pending Withdrawals</CardTitle>
          <Clock className="h-4 w-4 text-cosmic-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cosmic-secondary">{summary.pendingWithdrawals.toFixed(2)} TON</div>
          <p className="text-xs text-cosmic-muted">Awaiting approval</p>
        </CardContent>
      </Card>

      <Card className="border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-cosmic-text">Completed Withdrawals</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">{summary.completedWithdrawals.toFixed(2)} TON</div>
          <p className="text-xs text-cosmic-muted">Successfully processed</p>
        </CardContent>
      </Card>
    </div>
  )
}
