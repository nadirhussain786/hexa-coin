"use server";

import { createClient } from "@/utils/supabase/server";

interface AddUserBalanceInput {
  userId: string;
  balanceHxco?: number;
  balanceTon?: number;
}

export async function addUserBalance({
  userId,
  balanceHxco = 0,
  balanceTon = 0,
}: AddUserBalanceInput) {
  const supabase = await createClient();

  const { error } = await supabase.from("user_balances").insert({
    user_id: userId,
    balance_hxco: balanceHxco,
    balance_ton: balanceTon,
  });

  if (error) {
    console.error("Error adding user balance:", error);
    return { success: false, error };
  }

  return { success: true };
}
