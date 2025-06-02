"use client"

import { useState } from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, MoreVertical, AlertTriangle, XCircle, Settings, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { HexPermission } from "@/types"
import { HexPermissionFilters } from "./HexPermissionFilters"

interface HexPermissionsTableProps {
  permissions: HexPermission[]
  onEdit: (permission: HexPermission) => void
  onDelete: (id: string) => void
  onToggleBan: (id: string, is_banned: boolean) => void
  isLoading: boolean
}

export function HexPermissionsTable({
  permissions,
  onEdit,
  onDelete,
  onToggleBan,
  isLoading,
}: HexPermissionsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "banned">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Filter permissions based on search query and filter
  const filteredPermissions = permissions.filter((permission) => {
    const matchesSearch =
      permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      permission.user_id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      statusFilter === "all" ||
      (statusFilter === "banned" && permission.is_banned) ||
      (statusFilter === "active" && !permission.is_banned)

    return matchesSearch && matchesFilter
  })

  // Paginate permissions
  const totalPages = Math.ceil(filteredPermissions.length / itemsPerPage)
  const paginatedPermissions = filteredPermissions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Format date for display
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "-"
    return format(new Date(dateString), "MMM d, yyyy")
  }

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setCurrentPage(1)
  }

  return (
    <div>
      <div className="p-4">
        <HexPermissionFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          resetFilters={resetFilters}
        />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableCaption>Manage hex box permissions for Hex Chase users</TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-cosmic-accent/5 border-cosmic-accent/10">
              <TableHead className="text-cosmic-muted">Name</TableHead>
              <TableHead className="text-cosmic-muted">User ID</TableHead>
              <TableHead className="text-cosmic-muted">Daily Limit</TableHead>
              <TableHead className="text-cosmic-muted">Ads Required</TableHead>
              <TableHead className="text-cosmic-muted">TON Cost</TableHead>
              <TableHead className="text-cosmic-muted">Status</TableHead>
              <TableHead className="text-cosmic-muted">Last Updated</TableHead>
              <TableHead className="text-cosmic-muted text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPermissions.length > 0 ? (
              paginatedPermissions.map((permission) => (
                <TableRow key={permission.id} className="hover:bg-cosmic-accent/5 border-cosmic-accent/10">
                  <TableCell className="font-medium text-cosmic-text">{permission.name}</TableCell>
                  <TableCell className="text-cosmic-muted text-sm">{permission.user_id}</TableCell>
                  <TableCell>
                    {permission.is_banned ? (
                      <span className="text-cosmic-secondary">0</span>
                    ) : (
                      <span className="text-cosmic-accent">{permission.daily_limit}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {permission.is_banned ? (
                      <span className="text-cosmic-secondary">0</span>
                    ) : (
                      <span className="text-cosmic-text">{permission.ad_required}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {permission.is_banned ? (
                      <span className="text-cosmic-secondary">0</span>
                    ) : (
                      <span className="text-cosmic-text">{permission.ton_cost.toFixed(2)}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={permission.is_banned}
                        onCheckedChange={(checked) => onToggleBan(permission.id, checked)}
                        disabled={isLoading}
                      />
                      {permission.is_banned ? (
                        <Badge className="bg-cosmic-secondary/20 text-cosmic-secondary">Banned</Badge>
                      ) : (
                        <Badge className="bg-green-500/20 text-green-500">Active</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {permission.updated_at ? (
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3 text-cosmic-muted" />
                        <span className="text-sm text-cosmic-muted">{formatDate(permission.updated_at)}</span>
                      </div>
                    ) : (
                      <span className="text-cosmic-muted">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
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
                          onClick={(e) => {
                            e.stopPropagation()
                            onEdit(permission)
                          }}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Edit Permission
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem
                          className="text-cosmic-secondary cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(permission.id)
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Delete Permission
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-cosmic-muted">
                    <AlertTriangle className="h-8 w-8 mb-2 text-cosmic-accent/50" />
                    <p>No permissions found</p>
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
        <div className="flex items-center justify-between p-4">
          <p className="text-sm text-cosmic-muted">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredPermissions.length)} of {filteredPermissions.length} results
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isLoading}
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
              disabled={currentPage === totalPages || isLoading}
              className="border-cosmic-accent/20 text-cosmic-muted"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
