"use server";

import { createClient } from "@/utils/supabase/server";

export async function deleteHexPermission(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("hex_permissions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting hex permission:", error);
    return { success: false, error };
  }

  return { success: true };
}
