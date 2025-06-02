"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "@/types"
import { UserFilters } from "./UserFilters"
import { UserTable } from "./UserTable"
import { Pagination } from "./Pagination"
import { UserDetailsDialog } from "./UserDetailsDialog"
import { EditUserDialog } from "./EditUserDialog"
import { AdjustBalanceDialog } from "./AdjustBalanceDialog"
import { ConfirmDisableDialog } from "./ConfirmDisableDialog"
import { updateUser } from "../actions/updateUser"
import { UserStatus } from "@/constants"
import { adjustUserBalance } from "../actions/updateUserBalance"
import { useRouter } from "next/navigation"

type Props = {
  users: User[]
}

export default function UserManagement({ users }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState<boolean>(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState<boolean>(false)
  const [isAdjustBalanceOpen, setIsAdjustBalanceOpen] = useState<boolean>(false)
  const [isConfirmDisableOpen, setIsConfirmDisableOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [activeUserTab, setActiveUserTab] = useState<string>("overview")

  // Edit user form state
  const [editUserForm, setEditUserForm] = useState({
    firstName: "",
    lastName: "",
    status: UserStatus.Active,
  })

  // Adjust balance form state
  const [adjustBalanceForm, setAdjustBalanceForm] = useState({
    currency: "HXCO" as "HXCO" | "TON",
    amount: 0,
    operation: "add" as "add" | "subtract",
    reason: "",
  })

  const itemsPerPage = 5

  const filteredUsers = Array.isArray(users)
    ? users.filter((user) => {
        const matchesSearch =
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.id.toString().includes(searchQuery.toLowerCase())

        const matchesRole = roleFilter === "all" || user.role === roleFilter

        return matchesSearch && matchesRole
      })
    : []

  // Paginate users
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Open user details
  const openUserDetails = (user: User) => {
    setSelectedUser(user)
    setIsUserDetailsOpen(true)
    setActiveUserTab("overview")
  }

  // Open edit user dialog
  const openEditUser = (user: User) => {
    setSelectedUser(user)
    // Split the name into first and last name
    const nameParts = user.name.split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    setEditUserForm({
      firstName,
      lastName,
      status: user.status,
    })
    setIsEditUserOpen(true)
  }

  // Open adjust balance dialog
  const openAdjustBalance = (user: User) => {
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
  const openConfirmDisable = (user: User) => {
    setSelectedUser(user)
    setIsConfirmDisableOpen(true)
  }

  // Handle edit user form changes
  const handleEditUserChange = (e: React.ChangeEvent<HTMLInputElement> | { name: string; value: string }) => {
    if ("target" in e) {
      const { name, value, type, checked } = e.target
      setEditUserForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    } else {
      const { name, value } = e
      setEditUserForm((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  // Handle adjust balance form changes
  const handleAdjustBalanceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setAdjustBalanceForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? Number.parseFloat(value) || 0 : value,
    }))
  }

const saveEditedUser = async () => {
  if (!selectedUser) return;

  setIsLoading(true);

  const { firstName, lastName, status } = editUserForm;

  const result = await updateUser({
    userId: selectedUser.id,
    firstName,
    lastName,
    status,
  });

  if (!result.success) {
    console.error("Update failed:", result.error);
  }

  setIsEditUserOpen(false);
  setIsLoading(false);
};


const saveAdjustedBalance = async () => {
  if (!selectedUser || adjustBalanceForm.amount <= 0) return;

  setIsLoading(true);

  const result = await adjustUserBalance({
    userId: selectedUser.id.toString(),
    currency: adjustBalanceForm.currency,
    amount: adjustBalanceForm.amount,
    operation: adjustBalanceForm.operation,
    reason: adjustBalanceForm.reason,
  });

  if (result.success) {
    setIsAdjustBalanceOpen(false);
  } else {
    console.error("Failed to adjust balance:", result.error);
    // optionally display a toast/error message here
  }

  router.refresh();

  setIsLoading(false);
};


  // Disable user account
  const disableUserAccount = () => {
    if (!selectedUser) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would set a disabled flag on the user
      setIsConfirmDisableOpen(false)
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-cosmic-text">User Management</h2>

        <UserFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          resetFilters={() => {
            setSearchQuery("")
            setRoleFilter("all")
            setCurrentPage(1)
          }}
        />
      </div>

      <UserTable
        users={paginatedUsers}
        openUserDetails={openUserDetails}
        openEditUser={openEditUser}
        openAdjustBalance={openAdjustBalance}
        openConfirmDisable={openConfirmDisable}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      <UserDetailsDialog
        isOpen={isUserDetailsOpen}
        setIsOpen={setIsUserDetailsOpen}
        user={selectedUser}
        activeTab={activeUserTab}
        setActiveTab={setActiveUserTab}
        onEditClick={() => {
          setIsUserDetailsOpen(false)
          if (selectedUser) openEditUser(selectedUser)
        }}
      />

      <EditUserDialog
        isOpen={isEditUserOpen}
        setIsOpen={setIsEditUserOpen}
        user={selectedUser}
        formData={editUserForm}
        handleChange={handleEditUserChange}
        onSave={saveEditedUser}
        isLoading={isLoading}
      />

      <AdjustBalanceDialog
        isOpen={isAdjustBalanceOpen}
        setIsOpen={setIsAdjustBalanceOpen}
        user={selectedUser}
        formData={adjustBalanceForm}
        handleChange={handleAdjustBalanceChange}
        onSave={saveAdjustedBalance}
        isLoading={isLoading}
      />

      <ConfirmDisableDialog
        isOpen={isConfirmDisableOpen}
        setIsOpen={setIsConfirmDisableOpen}
        user={selectedUser}
        onConfirm={disableUserAccount}
        isLoading={isLoading}
      />
    </div>
  )
}
