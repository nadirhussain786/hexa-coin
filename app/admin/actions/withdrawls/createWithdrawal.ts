"use server";

import { createClient } from "@/utils/supabase/server";

export async function createWithdrawal(
  userId: string,
  amount: number,
  address: string,
  currency: string = "TON"
) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("create_withdrawal", {
    p_user_id: userId,
    p_amount: amount,
    p_address: address,
    p_currency: currency,
  });

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
