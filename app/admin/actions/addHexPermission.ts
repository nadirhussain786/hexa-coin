"use server";

import { createClient } from "@/utils/supabase/server";

interface CreateHexPermissionInput {
  userId: string;
  dailyLimit: number;
  adRequired: number;
  tonCost: number;
}

export async function addHexPermission({
  userId,
  dailyLimit,
  adRequired,
  tonCost,
}: CreateHexPermissionInput) {
  const supabase = await createClient();

  const { error } = await supabase.from("hex_permissions").insert({
    user_id: userId,
    daily_limit: dailyLimit,
    ad_required: adRequired,
    ton_cost: tonCost,
    is_banned: false,
  });

  if (error) {
    console.error("Error creating hex permission:", error);
    return { success: false, error };
  }

  return { success: true };
}
