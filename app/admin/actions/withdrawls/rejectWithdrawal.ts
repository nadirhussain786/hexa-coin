import { WithdrawalStatus } from "@/constants";
import { createClient } from "@/utils/supabase/client";

export async function rejectOrFailWithdrawal(
  withdrawalId: string,
  newStatus: WithdrawalStatus,
  rejectReason: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("withdrawals")
    .update({
      status: newStatus,
      reason: rejectReason,
    })
    .eq("id", withdrawalId);

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  return {
    error: "",
    success: true,
  };
}
