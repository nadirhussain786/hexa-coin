"use server";

import { WithdrawalStatus } from "@/constants";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function confirmWithdrawal(withdrawalId: string, txHash: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("withdrawals")
    .update({ status: WithdrawalStatus.Processing, tx_hash: txHash })
    .eq("id", withdrawalId);

    if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  revalidatePath("/admin/withdrawals");
  return {
    error: "",
    success: true,
  };
}
