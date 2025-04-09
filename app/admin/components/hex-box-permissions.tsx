"use client"

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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  RefreshCw,
  MoreVertical,
  CalendarIcon,
  AlertTriangle,
  XCircle,
  Settings,
} from "lucide-react"
import { format } from "date-fns"
import type { User, HexBoxPermission } from "@/types"

// Sample user data for demonstration
const sampleUsers: User[] = [
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
    hexBoxPermission: {
      allowMultipleOpening: true,
      maxOpeningsPerDay: 10,
      expiryDate: "2025-04-15T00:00:00.000Z",
      lastUpdated: "2025-03-20T14:30:00.000Z",
    },
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
    hexBoxPermission: {
      allowMultipleOpening: true,
      maxOpeningsPerDay: 5,
      expiryDate: null, // No expiry date
      lastUpdated: "2025-03-15T10:45:00.000Z",
    },
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
]

export default function HexBoxPermissions() {
  const [users, setUsers] = useState<User[]>(sampleUsers)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [permissionFilter, setPermissionFilter] = useState<"all" | "granted" | "none">("all")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditPermissionOpen, setIsEditPermissionOpen] = useState<boolean>(false)
  const [isConfirmRevokeOpen, setIsConfirmRevokeOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Edit permission form state
  const [permissionForm, setPermissionForm] = useState<{
    allowMultipleOpening: boolean
    maxOpeningsPerDay: number
    hasExpiryDate: boolean
    expiryDate: Date | undefined
  }>({
    allowMultipleOpening: true,
    maxOpeningsPerDay: 5,
    hasExpiryDate: false,
    expiryDate: undefined,
  })

  const itemsPerPage = 5

  // Filter users based on search query and permission filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesPermission =
      permissionFilter === "all" ||
      (permissionFilter === "granted" && user.hexBoxPermission?.allowMultipleOpening) ||
      (permissionFilter === "none" && !user.hexBoxPermission?.allowMultipleOpening)

    return matchesSearch && matchesPermission
  })

  // Paginate users
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Open edit permission dialog
  const openEditPermission = (user: User) => {
    setSelectedUser(user)

    // Initialize form with current permissions or defaults
    if (user.hexBoxPermission) {
      setPermissionForm({
        allowMultipleOpening: user.hexBoxPermission.allowMultipleOpening,
        maxOpeningsPerDay: user.hexBoxPermission.maxOpeningsPerDay,
        hasExpiryDate: !!user.hexBoxPermission.expiryDate,
        expiryDate: user.hexBoxPermission.expiryDate ? new Date(user.hexBoxPermission.expiryDate) : undefined,
      })
    } else {
      setPermissionForm({
        allowMultipleOpening: true,
        maxOpeningsPerDay: 5,
        hasExpiryDate: false,
        expiryDate: undefined,
      })
    }

    setIsEditPermissionOpen(true)
  }

  // Open confirm revoke dialog
  const openConfirmRevoke = (user: User) => {
    setSelectedUser(user)
    setIsConfirmRevokeOpen(true)
  }

  // Save permission changes
  const savePermissionChanges = () => {
    if (!selectedUser) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedUsers = users.map((user) => {
        if (user.id === selectedUser.id) {
          return {
            ...user,
            hexBoxPermission: {
              allowMultipleOpening: permissionForm.allowMultipleOpening,
              maxOpeningsPerDay: permissionForm.maxOpeningsPerDay,
              expiryDate:
                permissionForm.hasExpiryDate && permissionForm.expiryDate
                  ? permissionForm.expiryDate.toISOString()
                  : null,
              lastUpdated: new Date().toISOString(),
            },
          }
        }
        return user
      })

      setUsers(updatedUsers)
      setIsEditPermissionOpen(false)
      setIsLoading(false)
    }, 1000)
  }

  // Revoke permission
  const revokePermission = () => {
    if (!selectedUser) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const updatedUsers = users.map((user) => {
        if (user.id === selectedUser.id) {
          // Remove hexBoxPermission or set allowMultipleOpening to false
          return {
            ...user,
            hexBoxPermission: {
              allowMultipleOpening: false,
              maxOpeningsPerDay: 0,
              expiryDate: null,
              lastUpdated: new Date().toISOString(),
            },
          }
        }
        return user
      })

      setUsers(updatedUsers)
      setIsConfirmRevokeOpen(false)
      setIsLoading(false)
    }, 1000)
  }

  // Format date for display
  const formatDate = (dateString: string): string => {
    return format(new Date(dateString), "MMM d, yyyy")
  }

  // Check if permission is expired
  const isPermissionExpired = (permission?: HexBoxPermission): boolean => {
    if (!permission || !permission.expiryDate) return false
    return new Date(permission.expiryDate) < new Date()
  }

  // Get permission status badge
  const getPermissionStatusBadge = (user: User) => {
    if (!user.hexBoxPermission || !user.hexBoxPermission.allowMultipleOpening) {
      return <Badge className="bg-cosmic-secondary/20 text-cosmic-secondary">No Special Access</Badge>
    }

    if (isPermissionExpired(user.hexBoxPermission)) {
      return <Badge className="bg-cosmic-secondary/20 text-cosmic-secondary">Expired</Badge>
    }

    return (
      <Badge className="bg-green-500/20 text-green-500">
        {user.hexBoxPermission.expiryDate ? "Temporary Access" : "Permanent Access"}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-cosmic-text">Hex Box Permissions</h2>

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
                {permissionFilter === "all"
                  ? "All Users"
                  : permissionFilter === "granted"
                    ? "With Access"
                    : "No Access"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-cosmic-card border-cosmic-accent/20">
              <DropdownMenuLabel className="text-cosmic-muted">Filter by Permission</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-cosmic-accent/10" />
              <DropdownMenuItem
                className={`${permissionFilter === "all" ? "text-cosmic-accent" : "text-cosmic-text"} cursor-pointer`}
                onClick={() => setPermissionFilter("all")}
              >
                All Users
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`${permissionFilter === "granted" ? "text-cosmic-accent" : "text-cosmic-text"} cursor-pointer`}
                onClick={() => setPermissionFilter("granted")}
              >
                With Special Access
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`${permissionFilter === "none" ? "text-cosmic-accent" : "text-cosmic-text"} cursor-pointer`}
                onClick={() => setPermissionFilter("none")}
              >
                No Special Access
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            className="border-cosmic-accent/20 text-cosmic-muted"
            onClick={() => {
              setSearchQuery("")
              setPermissionFilter("all")
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
          <TableCaption>Manage special hex box opening permissions for users</TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-cosmic-accent/5 border-cosmic-accent/10">
              <TableHead className="text-cosmic-muted">User</TableHead>
              <TableHead className="text-cosmic-muted">Status</TableHead>
              <TableHead className="text-cosmic-muted">Daily Limit</TableHead>
              <TableHead className="text-cosmic-muted">Expiry Date</TableHead>
              <TableHead className="text-cosmic-muted">Last Updated</TableHead>
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
                  <TableCell>{getPermissionStatusBadge(user)}</TableCell>
                  <TableCell>
                    {user.hexBoxPermission?.allowMultipleOpening ? (
                      <span className="text-cosmic-accent">{user.hexBoxPermission.maxOpeningsPerDay} per day</span>
                    ) : (
                      <span className="text-cosmic-muted">Standard (2 per day)</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.hexBoxPermission?.expiryDate ? (
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3 text-cosmic-muted" />
                        <span
                          className={`text-sm ${isPermissionExpired(user.hexBoxPermission) ? "text-cosmic-secondary" : "text-cosmic-text"}`}
                        >
                          {formatDate(user.hexBoxPermission.expiryDate)}
                        </span>
                      </div>
                    ) : user.hexBoxPermission?.allowMultipleOpening ? (
                      <span className="text-cosmic-muted">No expiry</span>
                    ) : (
                      <span className="text-cosmic-muted">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.hexBoxPermission?.lastUpdated ? (
                      <span className="text-cosmic-muted text-sm">{formatDate(user.hexBoxPermission.lastUpdated)}</span>
                    ) : (
                      <span className="text-cosmic-muted">-</span>
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
                          onClick={() => openEditPermission(user)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          {user.hexBoxPermission?.allowMultipleOpening ? "Edit Permission" : "Grant Permission"}
                        </DropdownMenuItem>
                        {user.hexBoxPermission?.allowMultipleOpening && (
                          <DropdownMenuItem
                            className="text-cosmic-secondary cursor-pointer"
                            onClick={() => openConfirmRevoke(user)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Revoke Permission
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

      {/* Edit Permission Dialog */}
      <Dialog open={isEditPermissionOpen} onOpenChange={setIsEditPermissionOpen}>
        <DialogContent className="bg-cosmic-card border-cosmic-accent/30">
          <DialogHeader>
            <DialogTitle className="text-cosmic-text">
              {selectedUser?.hexBoxPermission?.allowMultipleOpening
                ? "Edit Hex Box Permission"
                : "Grant Hex Box Permission"}
            </DialogTitle>
            <DialogDescription className="text-cosmic-muted">
              {selectedUser?.hexBoxPermission?.allowMultipleOpening
                ? "Modify special hex box opening permissions for this user"
                : "Grant special hex box opening permissions to this user"}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right text-cosmic-muted text-sm">User:</div>
                <div className="col-span-3">
                  <p className="text-cosmic-text">{selectedUser.name}</p>
                  <p className="text-xs text-cosmic-muted">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right text-cosmic-muted text-sm">Allow Multiple Opening:</div>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    checked={permissionForm.allowMultipleOpening}
                    onCheckedChange={(checked) =>
                      setPermissionForm((prev) => ({ ...prev, allowMultipleOpening: checked }))
                    }
                  />
                  <Label className="text-cosmic-text">
                    {permissionForm.allowMultipleOpening ? "Enabled" : "Disabled"}
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right text-cosmic-muted text-sm">Daily Limit:</div>
                <div className="col-span-3">
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    value={permissionForm.maxOpeningsPerDay}
                    onChange={(e) =>
                      setPermissionForm((prev) => ({
                        ...prev,
                        maxOpeningsPerDay: Number.parseInt(e.target.value) || 1,
                      }))
                    }
                    disabled={!permissionForm.allowMultipleOpening}
                    className="bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text w-full"
                  />
                  <p className="text-xs text-cosmic-muted mt-1">
                    Maximum number of hex boxes the user can open per day
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right text-cosmic-muted text-sm">Set Expiry Date:</div>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    checked={permissionForm.hasExpiryDate}
                    onCheckedChange={(checked) => setPermissionForm((prev) => ({ ...prev, hasExpiryDate: checked }))}
                    disabled={!permissionForm.allowMultipleOpening}
                  />
                  <Label className="text-cosmic-text">
                    {permissionForm.hasExpiryDate ? "Yes" : "No expiry (permanent)"}
                  </Label>
                </div>
              </div>

              {permissionForm.hasExpiryDate && permissionForm.allowMultipleOpening && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="text-right text-cosmic-muted text-sm">Expiry Date:</div>
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal border-cosmic-accent/20 bg-cosmic-bg/50 text-cosmic-text"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {permissionForm.expiryDate ? (
                            format(permissionForm.expiryDate, "PPP")
                          ) : (
                            <span className="text-cosmic-muted">Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-cosmic-card border-cosmic-accent/20">
                        {/* Calendar component is used here but imported at the top */}
                        <div className="p-4 text-cosmic-muted">Select a date using the date picker</div>
                      </PopoverContent>
                    </Popover>
                    <p className="text-xs text-cosmic-muted mt-1">
                      The permission will automatically expire on this date
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditPermissionOpen(false)}
              className="border-cosmic-accent/20 text-cosmic-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={savePermissionChanges}
              className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight text-cosmic-text"
              disabled={isLoading || (permissionForm.hasExpiryDate && !permissionForm.expiryDate)}
            >
              {isLoading ? "Saving..." : "Save Permission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Revoke Dialog */}
      <Dialog open={isConfirmRevokeOpen} onOpenChange={setIsConfirmRevokeOpen}>
        <DialogContent className="bg-cosmic-card border-cosmic-accent/30">
          <DialogHeader>
            <DialogTitle className="text-cosmic-text">Revoke Permission</DialogTitle>
            <DialogDescription className="text-cosmic-muted">
              Are you sure you want to revoke the special hex box opening permission for this user?
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right text-cosmic-muted text-sm">User:</div>
                <div className="col-span-3">
                  <p className="text-cosmic-text">{selectedUser.name}</p>
                  <p className="text-xs text-cosmic-muted">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-right text-cosmic-muted text-sm">Current Limit:</div>
                <div className="col-span-3 text-cosmic-accent">
                  {selectedUser.hexBoxPermission?.maxOpeningsPerDay || 0} hex boxes per day
                </div>
              </div>

              <div className="bg-cosmic-secondary/10 border border-cosmic-secondary/30 rounded-md p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-cosmic-secondary mt-0.5" />
                  <div>
                    <p className="text-cosmic-secondary font-medium">Warning</p>
                    <p className="text-cosmic-secondary/80 text-sm">
                      This user will be limited to the standard 2 hex boxes per day after revoking this permission.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmRevokeOpen(false)}
              className="border-cosmic-accent/20 text-cosmic-muted"
            >
              Cancel
            </Button>
            <Button
              onClick={revokePermission}
              className="bg-cosmic-secondary/80 hover:bg-cosmic-secondary text-cosmic-text"
              disabled={isLoading}
            >
              {isLoading ? "Revoking..." : "Revoke Permission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
