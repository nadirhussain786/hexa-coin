"use server"

import { createClient } from "@/utils/supabase/server"
import { WithdrawalStatus } from "@/constants"
import { UserStatus } from "@/constants"
import { DashboardStats } from "@/types"

export type DashboardStatsResponse =
  | {
      success: true
      data: DashboardStats
    }
  | {
      success: false
      error: string
    }

export async function getDashboardStats(): Promise<DashboardStatsResponse> {
  const supabase = await createClient()

  const { count: totalUsers, error: totalUsersError } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })

  const { count: activeUsers, error: activeUsersError } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("status", UserStatus.Active)
    .gte("registered_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

  const { data: totalWithdrawalsData, error: totalWithdrawalsError } = await supabase
    .from("withdrawals")
    .select("amount")

  const totalWithdrawals = totalWithdrawalsData?.reduce((sum, w) => sum + Number(w.amount || 0), 0) || 0

  const { data: pendingData, error: pendingError } = await supabase
    .from("withdrawals")
    .select("amount")
    .eq("status", WithdrawalStatus.Pending)

  const pendingWithdrawals = pendingData?.reduce((sum, w) => sum + Number(w.amount || 0), 0) || 0

  const { data: completedData, error: completedError } = await supabase
    .from("withdrawals")
    .select("amount")
    .eq("status", WithdrawalStatus.Confirmed)

  const completedWithdrawals = completedData?.reduce((sum, w) => sum + Number(w.amount || 0), 0) || 0

  if (
    totalUsersError ||
    activeUsersError ||
    totalWithdrawalsError ||
    pendingError ||
    completedError
  ) {
    return {
      success: false,
      error:
        totalUsersError?.message ||
        activeUsersError?.message ||
        totalWithdrawalsError?.message ||
        pendingError?.message ||
        completedError?.message ||
        "Unknown error",
    }
  }

  return {
    success: true,
    data: {
      totalUsers: totalUsers ?? 0,
      activeUsers: activeUsers ?? 0,
      totalWithdrawals,
      pendingWithdrawals,
      completedWithdrawals,
    },
  }
}
