"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { LogOut, LayoutDashboard, Users, Wallet, Settings, Box } from "lucide-react"
import type { PaymentSummary } from "@/types"
import AdminLogin from "./admin-login"
import PaymentSummaryCard from "./payment-summary-card"
import WithdrawalManagement from "./withdrawal-management"
import UserManagement from "./user-management"
import HexBoxPermissions from "./hex-box-permissions"

// Define AdminData type
interface AdminData {
  id: string
  name: string
  email: string
  role: string
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [admin, setAdmin] = useState<AdminData | null>(null)
  const [activeTab, setActiveTab] = useState<string>("dashboard")

  // Sample payment summary data
  const paymentSummary: PaymentSummary = {
    totalWithdrawals: 2.1,
    pendingWithdrawals: 0.75,
    completedWithdrawals: 1.35,
    totalUsers: 125,
    activeUsers: 78,
  }

  // Check if admin is authenticated on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAdmin = localStorage.getItem("adminSession")
      if (storedAdmin) {
        try {
          const adminData = JSON.parse(storedAdmin) as AdminData
          setAdmin(adminData)
          setIsAuthenticated(true)
        } catch (_error) {
          // Invalid stored data
          localStorage.removeItem("adminSession")
        }
      }
    }
  }, [])

  const handleLogin = (adminData: AdminData) => {
    setAdmin(adminData)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setAdmin(null)
    setIsAuthenticated(false)

    // Clear admin session
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminSession")
    }
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-cosmic-bg text-cosmic-text">
      {/* Background decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cosmic-accent/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cosmic-highlight/5 rounded-full blur-3xl -ml-48 -mb-48"></div>
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-cosmic-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Header */}
      <header className="border-b border-cosmic-accent/10 bg-cosmic-card/30 backdrop-blur-md">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-gradient-to-br from-cosmic-accent to-cosmic-secondary rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="h-5 w-5 text-cosmic-text" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-cosmic-muted">Logged in as</p>
              <p className="text-cosmic-text font-medium">{admin?.name || "Admin"}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-cosmic-accent/20 text-cosmic-muted hover:bg-cosmic-accent/10 hover:text-cosmic-text"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container py-8">
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-cosmic-card/50 border border-cosmic-accent/20">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-cosmic-accent/20">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="withdrawals" className="data-[state=active]:bg-cosmic-accent/20">
              <Wallet className="h-4 w-4 mr-2" />
              Withdrawals
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-cosmic-accent/20">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="hexPermissions" className="data-[state=active]:bg-cosmic-accent/20">
              <Box className="h-4 w-4 mr-2" />
              Hex Permissions
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-cosmic-accent/20">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            <PaymentSummaryCard summary={paymentSummary} />

            <div className="border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-cosmic-text mb-4">Recent Activity</h2>
              <p className="text-cosmic-muted">Dashboard content will be displayed here.</p>
            </div>
          </TabsContent>

          <TabsContent value="withdrawals">
            <WithdrawalManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="hexPermissions">
            <HexBoxPermissions />
          </TabsContent>

          <TabsContent value="settings">
            <div className="border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-cosmic-text mb-4">System Settings</h2>
              <p className="text-cosmic-muted">Settings content will be displayed here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
