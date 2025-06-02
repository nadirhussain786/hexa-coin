"use client"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertTriangle, Ban, Edit, MoreVertical, UserIcon, Users, Wallet } from "lucide-react"
import { Role, type User } from "@/types"
import { UserStatusBadge } from "./UserStatusBadge"

type UserTableProps = {
  users: User[]
  openUserDetails: (user: User) => void
  openEditUser: (user: User) => void
  openAdjustBalance: (user: User) => void
  openConfirmDisable: (user: User) => void
}

export function UserTable({
  users,
  openUserDetails,
  openEditUser,
  openAdjustBalance,
  openConfirmDisable,
}: UserTableProps) {
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

  return (
    <div className="rounded-md border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableCaption>List of all users in the system</TableCaption>
        <TableHeader>
          <TableRow className="hover:bg-cosmic-accent/5 border-cosmic-accent/10">
            <TableHead className="text-cosmic-muted">User</TableHead>
            <TableHead className="text-cosmic-muted">Balance</TableHead>
            <TableHead className="text-cosmic-muted">Referrals</TableHead>
            <TableHead className="text-cosmic-muted">Registered</TableHead>
            <TableHead className="text-cosmic-muted">Status</TableHead>
            <TableHead className="text-cosmic-muted text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id} className="hover:bg-cosmic-accent/5 border-cosmic-accent/10">
                <TableCell>
                  <div>
                    <p className="font-medium text-cosmic-text">{user.name}</p>
                    <p className="text-xs text-cosmic-muted">{user.telegram_id}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-xs flex justify-between">
                      <span className="text-cosmic-muted">HXCO:</span>
                      <span className="text-cosmic-accent">{user.hxco}</span>
                    </p>
                    <p className="text-xs flex justify-between">
                      <span className="text-cosmic-muted">TON:</span>
                      <span className="text-cosmic-tertiary">{user.ton.toFixed(2)}</span>
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
                  {user.registered ? formatDate(user.registered) : ""}
                  <p className="text-xs text-cosmic-muted">
                    {user.registered ? daysSinceRegistration(user.registered) : ""} days ago
                  </p>
                </TableCell>
                <TableCell>
                  <UserStatusBadge status={user.status} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-cosmic-card border-cosmic-accent/20 z-50"
                      sideOffset={5}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenuLabel className="text-cosmic-muted">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-cosmic-accent/10" />
                      <DropdownMenuItem
                        className="text-cosmic-text cursor-pointer"
                        onSelect={(e) => {
                          // Using onSelect instead of onClick for better keyboard accessibility
                          openUserDetails(user)
                        }}
                      >
                        <UserIcon className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-cosmic-text cursor-pointer"
                        onSelect={(e) => {
                          openEditUser(user)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-cosmic-text cursor-pointer"
                        onSelect={(e) => {
                          openAdjustBalance(user)
                        }}
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        Adjust Balance
                      </DropdownMenuItem>
                      {user.role !== Role.Admin && (
                        <DropdownMenuItem
                          className="text-cosmic-secondary cursor-pointer"
                          onSelect={(e) => {
                            openConfirmDisable(user)
                          }}
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
  )
}
