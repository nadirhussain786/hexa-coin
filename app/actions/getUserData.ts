"use server";

import { createClient } from "@/utils/supabase/server";

export async function getUserData(userId: string) {
  const supabase = await createClient();

  const [userRes, balanceRes, permRes] = await Promise.all([
    supabase.from("users").select("*").eq("id", userId).single(),
    supabase.from("user_balances").select("*").eq("user_id", userId).single(),
    supabase.from("hex_permissions").select("*").eq("user_id", userId).single(),
  ]);

  if (userRes.error) return { success: false, error: userRes.error.message };

  return {
    success: true,
    user: userRes.data,
    balance: balanceRes.data,
    permission: permRes.data,
  };
}
