"use server";

import { createClient } from "@/utils/supabase/server";
import type { WithdrawalHistory } from "@/types";

export async function getWithdrawals(userId: string): Promise<{
  success: boolean;
  data: WithdrawalHistory[];
  error?: string;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("withdrawals")
    .select("*")
    .eq("user_id", userId)
    .order("request_date", { ascending: false })
    .limit(50);

  if (error) return { success: false, data: [], error: error.message };

  const mapped: WithdrawalHistory[] = (data || []).map((w) => ({
    id: w.id,
    date: w.request_date,
    amount: Number(w.amount),
    currency: w.currency as "HXCO" | "TON",
    status: mapStatus(w.status),
    txHash: w.tx_hash ?? undefined,
    address: w.address,
  }));

  return { success: true, data: mapped };
}

function mapStatus(s: string): WithdrawalHistory["status"] {
  const map: Record<string, WithdrawalHistory["status"]> = {
    confirmed: "Completed",
    pending: "Pending",
    processing: "Processing",
    rejected: "Failed",
    failed: "Failed",
  };
  return map[s] ?? "Pending";
}
