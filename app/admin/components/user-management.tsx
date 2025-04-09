"use client"

import { AlertDescription } from "@/components/ui/alert"

import { AlertTitle } from "@/components/ui/alert"

import { Alert } from "@/components/ui/alert"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  MoreVertical,
  User,
  Wallet,
  Users,
  Ban,
  Edit,
  AlertTriangle,
  Plus,
  Minus,
} from "lucide-react"
import type { User as UserType, WithdrawalHistory } from "@/types"

// Sample user data for demonstration
const sampleUsers: UserType[] = [
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    hxcoBalance: 1250,
    ptsBalance: 5000,
    tonBalance: 0.25,
    referrals: 8,
    lastWithdrawalDate: "2025-03-10 09:22",
    role: "user",
    createdAt: "2025-01-15 10:30",
  },
  {
    id: "user2",
    name: "Alice Smith",
    email: "alice@example.com",
    hxcoBalance: 3500,
    ptsBalance: 12000,
    tonBalance: 0.75,
    referrals: 15,
    lastWithdrawalDate: "2025-03-05 11:30",
    role: "user",
    createdAt: "2025-01-20 14:45",
  },
  {
    id: "user3",
    name: "Bob Johnson",
    email: "bob@example.com",
    hxcoBalance: 750,
    ptsBalance: 2500,
    tonBalance: 0.1,
    referrals: 3,
    lastWithdrawalDate: "2025-03-01 14:15",
    role: "user",
    createdAt: "2025-02-05 09:15",
  },
  {
    id: "user4",
    name: "Emma Wilson",
    email: "emma@example.com",
    hxcoBalance: 4200,
    ptsBalance: 15000,
    tonBalance: 1.2,
    referrals: 22,
    lastWithdrawalDate: "2025-02-28 10:05",
    role: "user",
    createdAt: "2025-01-10 16:20",
  },
  {
    id: "user5",
    name: "Michael Brown",
    email: "michael@example.com",
    hxcoBalance: 950,
    ptsBalance: 3200,
    tonBalance: 0.3,
    referrals: 5,
    lastWithdrawalDate: "2025-02-25 13:45",
    role: "user",
    createdAt: "2025-02-12 11:30",
  },
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@luxurygame.app",
    hxcoBalance: 0,
    ptsBalance: 0,
    tonBalance: 0,
    referrals: 0,
    role: "admin",
    createdAt: "2025-01-01 00:00",
  },
]

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

export default function UserManagement() {
  const [users, setUsers] = useState<UserType[]>(sampleUsers)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState<boolean>(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState<boolean>(false)
  const [isAdjustBalanceOpen, setIsAdjustBalanceOpen] = useState<boolean>(false)
  const [isConfirmDisableOpen, setIsConfirmDisableOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeUserTab, setActiveUserTab] = useState<string>("overview")

  // Edit user form state
  const [editUserForm, setEditUserForm] = useState({
    name: "",
    email: "",
    isActive: true,
  })

  // Adjust balance form state
  const [adjustBalanceForm, setAdjustBalanceForm] = useState({
    currency: "HXCO" as "HXCO" | "TON" | "PTS",
    amount: 0,
    operation: "add" as "add" | "subtract",
    reason: "",
  })

  const itemsPerPage = 5

  // Filter users based on search query and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  // Paginate users
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Open user details
  const openUserDetails = (user: UserType) => {
    setSelectedUser(user)
    setIsUserDetailsOpen(true)
    setActiveUserTab("overview")
  }

  // Open edit user dialog
  const openEditUser = (user: UserType) => {
    setSelectedUser(user)
    setEditUserForm({
      name: user.name,
      email: user.email,
      isActive: true, // Assuming all users are active by default
    })
    setIsEditUserOpen(true)
  }

  // Open adjust balance dialog
  const openAdjustBalance = (user: UserType) => {
    setSelectedUser(user)
    setAdjustBalanceForm({
      currency: "HXCO",
      amount: 0,
      operation: "add",
      reason: "",
    })
    setIsAdjustBalanceOpen(true)
  }

  // Open confirm disable dialog
  const openConfirmDisable = (user: UserType) => {
    setSelectedUser(user)
    setIsConfirmDisableOpen(true)
  }

  // Handle edit user form changes
  const handleEditUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setEditUserForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Handle adjust balance form changes
  const handleAdjustBalanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setAdjustBalanceForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  // Save edited user
  const saveEditedUser = () => {
    if (!selectedUser) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              name: editUserForm.name,
              email: editUserForm.email,
            }
          : user,
      )

      setUsers(updatedUsers)
      setIsEditUserOpen(false)
      setIsLoading(false)

      // Update selected user for details view
      setSelectedUser((prev) =>
        prev
          ? {
              ...prev,
              name: editUserForm.name,
              email: editUserForm.email,
            }
          : null,
      )
    }, 1000)
  }

  // Save adjusted balance
  const saveAdjustedBalance = () => {
    if (!selectedUser || adjustBalanceForm.amount <= 0) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedUsers = users.map((user) => {
        if (user.id === selectedUser.id) {
          const updatedUser = { ...user }

          if (adjustBalanceForm.currency === "HXCO") {
            updatedUser.hxcoBalance =
              adjustBalanceForm.operation === "add"
                ? user.hxcoBalance + adjustBalanceForm.amount
                : Math.max(0, user.hxcoBalance - adjustBalanceForm.amount)
          } else if (adjustBalanceForm.currency === "TON") {
            updatedUser.tonBalance =
              adjustBalanceForm.operation === "add"
                ? user.tonBalance + adjustBalanceForm.amount
                : Math.max(0, user.tonBalance - adjustBalanceForm.amount)
          } else if (adjustBalanceForm.currency === "PTS") {
            updatedUser.ptsBalance =
              adjustBalanceForm.operation === "add"
                ? user.ptsBalance + adjustBalanceForm.amount
                : Math.max(0, user.ptsBalance - adjustBalanceForm.amount)
          }

          return updatedUser
        }
        return user
      })

      setUsers(updatedUsers)
      setIsAdjustBalanceOpen(false)
      setIsLoading(false)

      // Update selected user for details view
      const updatedUser = updatedUsers.find((u) => u.id === selectedUser.id)
      if (updatedUser) {
        setSelectedUser(updatedUser)
      }
    }, 1000)
  }

  // Disable user account
  const disableUserAccount = () => {
    if (!selectedUser) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would set a disabled flag on the user
      // For this demo, we'll just close the dialog
      setIsConfirmDisableOpen(false)
      setIsLoading(false)
    }, 1000)
  }

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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-cosmic-text">User Management</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cosmic-muted" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text w-full"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-cosmic-accent/20 text-cosmic-muted">
                <Filter className="h-4 w-4 mr-2" />
                {roleFilter === "all" ? "All Roles" : roleFilter === "admin" ? "Admins" : "Users"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-cosmic-card border-cosmic-accent/20">
              <DropdownMenuLabel className="text-cosmic-muted">Filter by Role</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-cosmic-accent/10" />
              <DropdownMenuItem
                className={`${roleFilter === "all" ? "text-cosmic-accent" : "text-cosmic-text"} cursor-pointer`}
                onClick={() => setRoleFilter("all")}
              >
                All Roles
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`${roleFilter === "user" ? "text-cosmic-accent" : "text-cosmic-text"} cursor-pointer`}
                onClick={() => setRoleFilter("user")}
              >
                Users
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`${roleFilter === "admin" ? "text-cosmic-accent" : "text-cosmic-text"} cursor-pointer`}
                onClick={() => setRoleFilter("admin")}
              >
                Admins
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            className="border-cosmic-accent/20 text-cosmic-muted"
            onClick={() => {
              setSearchQuery("")
              setRoleFilter("all")
              setCurrentPage(1)
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableCaption>List of all users in the system</TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-cosmic-accent/5 border-cosmic-accent/10">
              <TableHead className="text-cosmic-muted">User</TableHead>
              <TableHead className="text-cosmic-muted">Balance</TableHead>
              <TableHead className="text-cosmic-muted">Referrals</TableHead>
              <TableHead className="text-cosmic-muted">Registered</TableHead>
              <TableHead className="text-cosmic-muted">Role</TableHead>
              <TableHead className="text-cosmic-muted text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-cosmic-accent/5 border-cosmic-accent/10">
                  <TableCell>
                    <div>
                      <p className="font-medium text-cosmic-text">{user.name}</p>
                      <p className="text-xs text-cosmic-muted">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-xs flex justify-between">
                        <span className="text-cosmic-muted">HXCO:</span>
                        <span className="text-cosmic-accent">{user.hxcoBalance}</span>
                      </p>
                      <p className="text-xs flex justify-between">
                        <span className="text-cosmic-muted">TON:</span>
                        <span className="text-cosmic-tertiary">{user.tonBalance.toFixed(2)}</span>
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-cosmic-muted" />
                      <span className="text-cosmic-text">{user.referrals}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-cosmic-muted text-sm">
                    {user.createdAt ? formatDate(user.createdAt) : ""}
                    <p className="text-xs text-cosmic-muted">{user.createdAt ? daysSinceRegistration(user.createdAt) : ""} days ago</p>
                  </TableCell>
                  <TableCell>
                    {user.role === "admin" ? (
                      <Badge className="bg-cosmic-accent/20 text-cosmic-accent hover:bg-cosmic-accent/30">Admin</Badge>
                    ) : (
                      <Badge className="bg-cosmic-tertiary/20 text-cosmic-tertiary hover:bg-cosmic-tertiary/30">
                        User
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-cosmic-card border-cosmic-accent/20">
                        <DropdownMenuLabel className="text-cosmic-muted">Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-cosmic-accent/10" />
                        <DropdownMenuItem
                          className="text-cosmic-text cursor-pointer"
                          onClick={() => openUserDetails(user)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-cosmic-text cursor-pointer"
                          onClick={() => openEditUser(user)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-cosmic-text cursor-pointer"
                          onClick={() => openAdjustBalance(user)}
                        >
                          <Wallet className="h-4 w-4 mr-2" />
                          Adjust Balance
                        </DropdownMenuItem>
                        {user.role !== "admin" && (
                          <DropdownMenuItem
                            className="text-cosmic-secondary cursor-pointer"
                            onClick={() => openConfirmDisable(user)}
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Disable Account
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-cosmic-muted">
                    <AlertTriangle className="h-8 w-8 mb-2 text-cosmic-accent/50" />
                    <p>No users found</p>
                    <p className="text-sm">Try adjusting your search or filter</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-cosmic-muted">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} results
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="border-cosmic-accent/20 text-cosmic-muted"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm text-cosmic-muted">
              Page {currentPage} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="border-cosmic-accent/20 text-cosmic-muted"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* User Details Dialog */}
      <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
        <DialogContent className="bg-cosmic-card border-cosmic-accent/30 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-cosmic-text">User Details</DialogTitle>
            <DialogDescription className="text-cosmic-muted">
              View detailed information about this user
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="py-4">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="md:w-1/3">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight flex items-center justify-center text-4xl font-bold text-cosmic-text mb-4">
                      {selectedUser.name.charAt(0)}
                    </div>
                    <h3 className="text-lg font-medium text-cosmic-text">{selectedUser.name}</h3>
                    <p className="text-sm text-cosmic-muted">{selectedUser.email}</p>
                    <div className="mt-2">
                      <Badge
                        className={`${selectedUser.role === "admin" ? "bg-cosmic-accent/20 text-cosmic-accent" : "bg-cosmic-tertiary/20 text-cosmic-tertiary"}`}
                      >
                        {selectedUser.role === "admin" ? "Admin" : "User"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3">
                  <Tabs defaultValue="overview" value={activeUserTab} onValueChange={setActiveUserTab}>
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
                              <span className="text-cosmic-accent font-medium">{selectedUser.hxcoBalance}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-cosmic-muted">TON Balance:</span>
                              <span className="text-cosmic-tertiary font-medium">
                                {selectedUser.tonBalance.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-cosmic-muted">Points:</span>
                              <span className="text-cosmic-highlight font-medium">{selectedUser.ptsBalance}</span>
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
                              <span className="text-cosmic-accent font-medium">{selectedUser.referrals}</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-cosmic-muted">Progress to TON Withdrawal:</span>
                                <span className="text-cosmic-accent">{Math.min(selectedUser.referrals, 10)}/10</span>
                              </div>
                              <Progress value={Math.min((selectedUser.referrals / 10) * 100, 100)} className="h-2" />
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
                              <p className="text-sm text-cosmic-text">{selectedUser.createdAt ? formatDate(selectedUser.createdAt):""}</p>
                            </div>
                            <div>
                              <p className="text-xs text-cosmic-muted">Account Age</p>
                              <p className="text-sm text-cosmic-text">
                                {selectedUser.createdAt ? daysSinceRegistration(selectedUser.createdAt) : ""} days
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-cosmic-muted">Last Withdrawal</p>
                              <p className="text-sm text-cosmic-text">
                                {selectedUser.lastWithdrawalDate
                                  ? formatDate(selectedUser.lastWithdrawalDate)
                                  : "No withdrawals yet"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-cosmic-muted">Next Withdrawal Eligibility</p>
                              <p className="text-sm text-cosmic-text">
                                {selectedUser.lastWithdrawalDate
                                  ? daysUntilNextWithdrawal(selectedUser.lastWithdrawalDate) > 0
                                    ? `In ${daysUntilNextWithdrawal(selectedUser.lastWithdrawalDate)} days`
                                    : "Eligible now"
                                  : "Eligible now"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="withdrawals" className="mt-4">
                      <Card className="border border-cosmic-accent/20 bg-cosmic-card/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-cosmic-text">Withdrawal History</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {sampleWithdrawalHistory.length > 0 ? (
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
                                  {sampleWithdrawalHistory.map((withdrawal) => (
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
                    </TabsContent>

                    <TabsContent value="activity" className="mt-4">
                      <Card className="border border-cosmic-accent/20 bg-cosmic-card/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-cosmic-text">Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-4">
                            <p className="text-cosmic-muted">
                              Activity tracking will be implemented in a future update
                            </p>
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
                    onClick={() => setIsUserDetailsOpen(false)}
                    className="border-cosmic-accent/20 text-cosmic-muted"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setIsUserDetailsOpen(false)
                      openEditUser(selectedUser)
                    }}
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

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="bg-cosmic-card border-cosmic-accent/30">
          <DialogHeader>
            <DialogTitle className="text-cosmic-text">Edit User</DialogTitle>
            <DialogDescription className="text-cosmic-muted">Update user information</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-cosmic-text">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={editUserForm.name}
                  onChange={handleEditUserChange}
                  className="bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-cosmic-text">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={editUserForm.email}
                  onChange={handleEditUserChange}
                  className="bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  name="isActive"
                  checked={editUserForm.isActive}
                  onCheckedChange={(checked) => setEditUserForm((prev) => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive" className="text-cosmic-text">
                  Account Active
                </Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditUserOpen(false)}
              className="border-cosmic-accent/20 text-cosmic-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={saveEditedUser}
              className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight text-cosmic-text"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adjust Balance Dialog */}
      <Dialog open={isAdjustBalanceOpen} onOpenChange={setIsAdjustBalanceOpen}>
        <DialogContent className="bg-cosmic-card border-cosmic-accent/30">
          <DialogHeader>
            <DialogTitle className="text-cosmic-text">Adjust Balance</DialogTitle>
            <DialogDescription className="text-cosmic-muted">
              Add or subtract from user&apos;s balance
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right text-cosmic-muted text-sm">User:</div>
                <div className="col-span-3 text-cosmic-text">{selectedUser.name}</div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right text-cosmic-muted text-sm">Current Balance:</div>
                <div className="col-span-3">
                  <div className="space-y-1">
                    <p className="text-xs flex justify-between">
                      <span className="text-cosmic-muted">HXCO:</span>
                      <span className="text-cosmic-accent">{selectedUser.hxcoBalance}</span>
                    </p>
                    <p className="text-xs flex justify-between">
                      <span className="text-cosmic-muted">TON:</span>
                      <span className="text-cosmic-tertiary">{selectedUser.tonBalance.toFixed(2)}</span>
                    </p>
                    <p className="text-xs flex justify-between">
                      <span className="text-cosmic-muted">PTS:</span>
                      <span className="text-cosmic-highlight">{selectedUser.ptsBalance}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right text-cosmic-muted text-sm">Currency:</div>
                <div className="col-span-3">
                  <select
                    name="currency"
                    value={adjustBalanceForm.currency}
                    onChange={handleAdjustBalanceChange}
                    className="w-full rounded-md border border-cosmic-accent/20 bg-cosmic-bg/50 text-cosmic-text p-2"
                  >
                    <option value="HXCO">HXCO Tokens</option>
                    <option value="TON">TON</option>
                    <option value="PTS">Points</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right text-cosmic-muted text-sm">Operation:</div>
                <div className="col-span-3">
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="add"
                        name="operation"
                        value="add"
                        checked={adjustBalanceForm.operation === "add"}
                        onChange={() => setAdjustBalanceForm((prev) => ({ ...prev, operation: "add" }))}
                        className="text-cosmic-accent"
                      />
                      <Label htmlFor="add" className="text-cosmic-text flex items-center">
                        <Plus className="h-4 w-4 mr-1 text-green-500" />
                        Add
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="subtract"
                        name="operation"
                        value="subtract"
                        checked={adjustBalanceForm.operation === "subtract"}
                        onChange={() => setAdjustBalanceForm((prev) => ({ ...prev, operation: "subtract" }))}
                        className="text-cosmic-secondary"
                      />
                      <Label htmlFor="subtract" className="text-cosmic-text flex items-center">
                        <Minus className="h-4 w-4 mr-1 text-cosmic-secondary" />
                        Subtract
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right text-cosmic-muted text-sm">Amount:</div>
                <div className="col-span-3">
                  <Input
                    name="amount"
                    type="number"
                    min="0"
                    step={adjustBalanceForm.currency === "TON" ? "0.01" : "1"}
                    value={adjustBalanceForm.amount || ""}
                    onChange={handleAdjustBalanceChange}
                    className="bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right text-cosmic-muted text-sm">Reason:</div>
                <div className="col-span-3">
                  <Input
                    name="reason"
                    value={adjustBalanceForm.reason}
                    onChange={handleAdjustBalanceChange}
                    placeholder="Optional reason for adjustment"
                    className="bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAdjustBalanceOpen(false)}
              className="border-cosmic-accent/20 text-cosmic-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={saveAdjustedBalance}
              className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight text-cosmic-text"
              disabled={isLoading || adjustBalanceForm.amount <= 0}
            >
              {isLoading ? "Processing..." : "Adjust Balance"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Disable Dialog */}
      <Dialog open={isConfirmDisableOpen} onOpenChange={setIsConfirmDisableOpen}>
        <DialogContent className="bg-cosmic-card border-cosmic-accent/30">
          <DialogHeader>
            <DialogTitle className="text-cosmic-text">Disable User Account</DialogTitle>
            <DialogDescription className="text-cosmic-muted">
              Are you sure you want to disable this user account?
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right text-cosmic-muted text-sm">User:</div>
                <div className="col-span-3 text-cosmic-text">{selectedUser.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right text-cosmic-muted text-sm">Email:</div>
                <div className="col-span-3 text-cosmic-text">{selectedUser.email}</div>
              </div>

              <Alert className="bg-cosmic-secondary/10 border-cosmic-secondary/30">
                <AlertTriangle className="h-4 w-4 text-cosmic-secondary" />
                <AlertTitle className="text-cosmic-secondary">Warning</AlertTitle>
                <AlertDescription className="text-cosmic-secondary/80">
                  Disabling this account will prevent the user from logging in or performing any actions. This can be
                  reversed later.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDisableOpen(false)}
              className="border-cosmic-accent/20 text-cosmic-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={disableUserAccount}
              className="bg-cosmic-secondary/80 hover:bg-cosmic-secondary text-cosmic-text"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Disable Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
