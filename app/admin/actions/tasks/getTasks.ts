"use server";

import { createClient } from "@/utils/supabase/server";
import type { Task } from "@/types";

export async function getTasks(): Promise<{ success: boolean; data: Task[]; error?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return { success: false, data: [], error: error.message };
  return { success: true, data: data ?? [] };
}
