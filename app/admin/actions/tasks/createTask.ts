"use server";

import { createClient } from "@/utils/supabase/server";
import type { Task } from "@/types";

type TaskInput = Omit<Task, "id" | "created_at">;

export async function createTask(input: TaskInput): Promise<{ success: boolean; data?: Task; error?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .insert([input])
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
}
