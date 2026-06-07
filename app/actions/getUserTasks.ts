"use server";

import { createClient } from "@/utils/supabase/server";
import type { TaskWithStatus } from "@/types";

export async function getUserTasks(userId: string): Promise<{
  success: boolean;
  data: TaskWithStatus[];
  error?: string;
}> {
  const supabase = await createClient();

  const [tasksRes, completedRes] = await Promise.all([
    supabase.from("tasks").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("user_tasks").select("task_id").eq("user_id", userId),
  ]);

  if (tasksRes.error) return { success: false, data: [], error: tasksRes.error.message };

  const completedIds = new Set((completedRes.data || []).map((r) => r.task_id));

  const data: TaskWithStatus[] = (tasksRes.data || []).map((task) => ({
    ...task,
    completed: completedIds.has(task.id),
  }));

  return { success: true, data };
}
