"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getAllWithdrawals() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("withdrawals")
    .select("*, users(*)")
    .order("request_date", { ascending: false });

  if (error) {
    return { success: false, message: error.message, data: [] };
  }

  return { success: true, message: "", data };
}
