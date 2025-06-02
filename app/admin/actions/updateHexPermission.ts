"use server";

import { createClient } from "@/utils/supabase/server";

interface UpdateHexPermissionInput {
  id: string;
  dailyLimit?: number;
  adRequired?: number;
  tonCost?: number;
}

export async function updateHexPermission({
  id,
  dailyLimit,
  adRequired,
  tonCost,
}: UpdateHexPermissionInput) {
  const supabase = await createClient();

  const updates: Record<string, any> = {};
  if (dailyLimit !== undefined) updates.daily_limit = dailyLimit;
  if (adRequired !== undefined) updates.ad_required = adRequired;
  if (tonCost !== undefined) updates.ton_cost = tonCost;

  const { error } = await supabase
    .from("hex_permissions")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Error updating hex permission:", error);
    return { success: false, error };
  }

  return { success: true };
}
