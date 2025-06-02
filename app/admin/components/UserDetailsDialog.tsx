"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Edit } from "lucide-react"
import { Role, type User, type WithdrawalHistory } from "@/types"
import { UserWithdrawalHistory } from "./UserWithdrawalHistory"

type UserDetailsDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  user: User | null
  activeTab: string
  setActiveTab: (tab: string) => void
  onEditClick: () => void
}

// Sample withdrawal history for user details
const sampleWithdrawalHistory: WithdrawalHistory[] = [
  {
    id: "w1",
    date: "2025-03-10 09:22",
    amount: 0.2,
    currency: "TON",
    status: "Completed",
    txHash: "0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5g",
    address: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  },
  {
    id: "w2",
    date: "2025-02-20 11:30",
    amount: 0.15,
    currency: "TON",
    status: "Completed",
    txHash: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
    address: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  },
  {
    id: "w3",
    date: "2025-01-15 14:45",
    amount: 500,
    currency: "HXCO",
    status: "Completed",
    txHash: "0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e",
    address: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  },
]

export function UserDetailsDialog({
  isOpen,
  setIsOpen,
  user,
  activeTab,
  setActiveTab,
  onEditClick,
}: UserDetailsDialogProps) {
  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Calculate days since registration
  const daysSinceRegistration = (createdAt: string): number => {
    const registrationDate = new Date(createdAt)
    const currentDate = new Date()
    const diffTime = currentDate.getTime() - registrationDate.getTime()
    return Math.floor(diffTime / (1000 * 60 * 60 * 24))
  }

  // Calculate days until next withdrawal
  const daysUntilNextWithdrawal = (lastWithdrawalDate?: string): number => {
    if (!lastWithdrawalDate) return 0

    const lastDate = new Date(lastWithdrawalDate)
    const currentDate = new Date()
    const diffTime = currentDate.getTime() - lastDate.getTime()
    const diffDays = diffTime / (1000 * 60 * 60 * 24)

    return Math.max(0, 15 - Math.floor(diffDays))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <DialogContent
        className="bg-cosmic-card border-cosmic-accent/30 max-w-3xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-cosmic-text">User Details</DialogTitle>
          <DialogDescription className="text-cosmic-muted">View detailed information about this user</DialogDescription>
        </DialogHeader>

        {user && (
          <div className="py-4">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="md:w-1/3">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight flex items-center justify-center text-4xl font-bold text-cosmic-text mb-4">
                    {user.name.charAt(0)}
                  </div>
                  <h3 className="text-lg font-medium text-cosmic-text">{user.name}</h3>
                  <p className="text-sm text-cosmic-muted">{user.id}</p>
                  <div className="mt-2">
                    <Badge
                      className={`${user.role === Role.Admin ? "bg-cosmic-accent/20 text-cosmic-accent" : "bg-cosmic-tertiary/20 text-cosmic-tertiary"}`}
                    >
                      {user.role === Role.Admin ? "Admin" : "User"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="md:w-2/3">
                <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="bg-cosmic-card/50 border border-cosmic-accent/20">
                    <TabsTrigger value="overview" className="data-[state=active]:bg-cosmic-accent/20">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="withdrawals" className="data-[state=active]:bg-cosmic-accent/20">
                      Withdrawals
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="data-[state=active]:bg-cosmic-accent/20">
                      Activity
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="border border-cosmic-accent/20 bg-cosmic-card/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-cosmic-text">Balance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-cosmic-muted">HXCO Tokens:</span>
                            <span className="text-cosmic-accent font-medium">{user.hxco}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-cosmic-muted">TON Balance:</span>
                            <span className="text-cosmic-tertiary font-medium">{user.ton.toFixed(2)}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border border-cosmic-accent/20 bg-cosmic-card/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-cosmic-text">Referrals</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-cosmic-muted">Total Referrals:</span>
                            <span className="text-cosmic-accent font-medium">{user.referrals}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-cosmic-muted">Progress to TON Withdrawal:</span>
                              <span className="text-cosmic-accent">{Math.min(user.referrals, 10)}/10</span>
                            </div>
                            <Progress value={Math.min((user.referrals / 10) * 100, 100)} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="border border-cosmic-accent/20 bg-cosmic-card/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-cosmic-text">Account Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-cosmic-muted">Registered On</p>
                            <p className="text-sm text-cosmic-text">
                              {user.registered ? formatDate(user.registered) : ""}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-cosmic-muted">Account Age</p>
                            <p className="text-sm text-cosmic-text">
                              {user.registered ? daysSinceRegistration(user.registered) : ""} days
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="withdrawals" className="mt-4">
                    <UserWithdrawalHistory withdrawals={sampleWithdrawalHistory} />
                  </TabsContent>

                  <TabsContent value="activity" className="mt-4">
                    <Card className="border border-cosmic-accent/20 bg-cosmic-card/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-cosmic-text">Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-4">
                          <p className="text-cosmic-muted">Activity tracking will be implemented in a future update</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <DialogFooter>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="border-cosmic-accent/20 text-cosmic-muted"
                >
                  Close
                </Button>
                <Button
                  onClick={onEditClick}
                  className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight text-cosmic-text"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit User
                </Button>
              </div>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
