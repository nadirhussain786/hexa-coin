import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { WithdrawalHistory } from "@/types"

type UserWithdrawalHistoryProps = {
  withdrawals: WithdrawalHistory[]
}

export function UserWithdrawalHistory({ withdrawals }: UserWithdrawalHistoryProps) {
  return (
    <Card className="border border-cosmic-accent/20 bg-cosmic-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-cosmic-text">Withdrawal History</CardTitle>
      </CardHeader>
      <CardContent>
        {withdrawals.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-cosmic-muted">Date</TableHead>
                  <TableHead className="text-cosmic-muted">Amount</TableHead>
                  <TableHead className="text-cosmic-muted">Status</TableHead>
                  <TableHead className="text-cosmic-muted">Transaction</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell className="text-cosmic-muted text-sm">{withdrawal.date}</TableCell>
                    <TableCell
                      className={`font-medium ${withdrawal.currency === "HXCO" ? "text-cosmic-accent" : "text-cosmic-tertiary"}`}
                    >
                      {withdrawal.amount} {withdrawal.currency}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/20 text-green-500">{withdrawal.status}</Badge>
                    </TableCell>
                    <TableCell className="text-cosmic-accent text-xs">
                      {withdrawal.txHash ? withdrawal.txHash.substring(0, 10) + "..." : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-cosmic-muted">No withdrawal history</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
