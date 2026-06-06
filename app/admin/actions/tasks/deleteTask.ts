"use server";

import { createClient } from "@/utils/supabase/server";

export async function deleteTask(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
