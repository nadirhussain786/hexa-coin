"use server";

import { createClient } from "@/utils/supabase/server";

export async function completeTask(userId: string, taskId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("complete_task", {
    p_user_id: userId,
    p_task_id: taskId,
  });

  if (error) {
    const msg = error.message;
    if (msg.includes("already_completed")) return { success: false, error: "Task already completed" };
    if (msg.includes("already_completed_today")) return { success: false, error: "Already completed today" };
    if (msg.includes("task_not_found")) return { success: false, error: "Task not found" };
    return { success: false, error: msg };
  }

  return { success: true, data };
}
