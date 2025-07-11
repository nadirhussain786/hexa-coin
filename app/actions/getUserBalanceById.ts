"use server";

import { createClient } from "@/utils/supabase/server";

export async function getUserBalanceById(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_balances")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching user balance:", error);
    return { success: false, error };
  }

  return { success: true, data };
}
