"use server";

import { createClient } from "@/utils/supabase/server";

interface AdjustBalanceInput {
  userId: string;
  currency: "HXCO" | "TON";
  amount: number;
  operation: "add" | "subtract";
  reason?: string;
}

export async function adjustUserBalance({ userId, currency, amount, operation }: AdjustBalanceInput) {
  const supabase = await createClient();

  const column = `balance_${currency.toLowerCase()}`;
  const { data, error: fetchError } = await supabase
    .from("user_balances")
    .select(column)
    .eq("user_id", userId)
    .single();

  if (fetchError || !data) {
    console.error("Error fetching balance:", fetchError);
    return { success: false, error: fetchError };
  }

  const currentBalance = (data as Record<string, any>)[column] || 0;
  const newBalance = operation === "add" ? currentBalance + amount : currentBalance - amount;

  const updates: Record<string, any> = {
    [column]: newBalance,
  };

  const { error: updateError } = await supabase
    .from("user_balances")
    .update(updates)
    .eq("user_id", userId);

  if (updateError) {
    console.error("Error updating balance:", updateError);
    return { success: false, error: updateError };
  }

  return { success: true };
}
