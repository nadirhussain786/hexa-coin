"use server";

import { createClient } from "@/utils/supabase/server";
import type { HexReward } from "@/types";

export async function recordHexOpen(
  userId: string,
  hexIndex: number,
  reward: HexReward
) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("open_hex", {
    p_user_id: userId,
    p_hex_index: hexIndex,
    p_reward_type: reward.type,
    p_reward_value: reward.value,
  });

  if (error) {
    const msg = error.message;
    if (msg.includes("daily_limit_reached")) {
      return { success: false, error: "daily_limit_reached" };
    }
    if (msg.includes("user_banned")) {
      return { success: false, error: "user_banned" };
    }
    return { success: false, error: msg };
  }

  return { success: true, data };
}

export async function getTodayOpenedHexes(userId: string): Promise<number[]> {
  const supabase = await createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from("game_sessions")
    .select("hex_index")
    .eq("user_id", userId)
    .gte("opened_at", today.toISOString());

  return (data || []).map((s) => s.hex_index);
}

export async function getRecentSessions(userId: string, limit = 3) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("game_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("opened_at", { ascending: false })
    .limit(limit);

  return data || [];
}
