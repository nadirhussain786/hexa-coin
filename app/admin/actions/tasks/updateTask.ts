"use server";

import { createClient } from "@/utils/supabase/server";
import type { Task } from "@/types";

type TaskUpdate = Partial<Omit<Task, "id" | "created_at">>;

export async function updateTask(id: string, input: TaskUpdate): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update(input).eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
