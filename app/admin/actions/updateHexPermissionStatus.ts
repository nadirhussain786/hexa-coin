"use server";

import { createClient } from "@/utils/supabase/server";

export async function updateHexPermissionStatus(id: string, isBanned: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("hex_permissions")
    .update({"is_banned":isBanned})
    .eq("id", id);

  if (error) {
    console.error("Error updating user status:", error);
    return { success: false, error };
  }

  return { success: true };
}
