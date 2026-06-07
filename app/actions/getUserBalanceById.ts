"use server";

import { createClient } from "@/utils/supabase/server";
import type { UserBalance } from "@/types";

export async function getUserBalanceById(userId: string): Promise<UserBalance | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_balances")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;

  return data as UserBalance;
}
