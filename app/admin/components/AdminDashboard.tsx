"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  LogOut,
  LayoutDashboard,
  Users,
  Wallet,
  Settings,
  Box,
} from "lucide-react";
import type { DashboardStats, HexPermission, User, Withdrawal } from "@/types";
import AdminLogin from "./admin-login";
import PaymentSummaryCard from "./payment-summary-card";
import UserManagement from "./UserManagement";
import AdminHeader from "./AdminHeader";
import HexPermissionsManager from "./HexPermission/HexPermissionsManager";
import WithdrawalManagement from "./Withdrawals/WithdrawalManagement";

interface AdminData {
  id: string;
  name: string;
  email: string;
  role: string;
}

type Props = {
  users: User[];
  hexPermissions: HexPermission[];
  withdrawals: Withdrawal[];
  dashboardStats:DashboardStats
};

export default function AdminDashboard({
  users,
  hexPermissions,
  withdrawals,
  dashboardStats,
}: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAdmin = localStorage.getItem("adminSession");
      if (storedAdmin) {
        try {
          const adminData = JSON.parse(storedAdmin) as AdminData;
          setAdmin(adminData);
          setIsAuthenticated(true);
        } catch (_error) {
          localStorage.removeItem("adminSession");
        }
      }
    }
  }, []);

  const handleLogin = (adminData: AdminData) => {
    setAdmin(adminData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setAdmin(null);
    setIsAuthenticated(false);

    if (typeof window !== "undefined") {
      localStorage.removeItem("adminSession");
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-cosmic-bg text-cosmic-text">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cosmic-accent/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cosmic-highlight/5 rounded-full blur-3xl -ml-48 -mb-48"></div>
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-cosmic-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <AdminHeader adminName={admin?.name || "Admin"} onLogout={handleLogout} />

      <main className="container py-8">
        <Tabs
          defaultValue="dashboard"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-8 bg-cosmic-card/50 border border-cosmic-accent/20">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-cosmic-accent/20 data-[state=active]:text-white"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="withdrawals"
              className="data-[state=active]:bg-cosmic-accent/20 data-[state=active]:text-white"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Withdrawals
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-cosmic-accent/20 data-[state=active]:text-white"
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="hexPermissions"
              className="data-[state=active]:bg-cosmic-accent/20 data-[state=active]:text-white"
            >
              <Box className="h-4 w-4 mr-2" />
              Hex Permissions
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-cosmic-accent/20 data-[state=active]:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            <PaymentSummaryCard summary={dashboardStats} />

            <div className="border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-cosmic-text mb-4">
                Recent Activity
              </h2>
              <p className="text-cosmic-muted">
                Dashboard content will be displayed here.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="withdrawals">
            <WithdrawalManagement withdrawal={withdrawals} />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement users={users} />
          </TabsContent>

          <TabsContent value="hexPermissions">
            <HexPermissionsManager hexPermissions={hexPermissions} />
          </TabsContent>

          <TabsContent value="settings">
            <div className="border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-lg font-medium text-cosmic-text mb-4">
                System Settings
              </h2>
              <p className="text-cosmic-muted">
                Settings content will be displayed here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
