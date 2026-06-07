"use server";

import { createClient } from "@/utils/supabase/server";

export type MiniGameType =
  | "memory-match"
  | "tap-hex"
  | "rock-paper-scissors"
  | "math-quiz"
  | "color-sequence"
  | "reflex-test"
  | "number-guess"
  | "word-scramble"
  | "coin-flip"
  | "spin-wheel";

export async function playMiniGame(
  userId: string,
  gameType: MiniGameType,
  score: number,
  rewardHxco: number
): Promise<{ success: boolean; playsToday?: number; error?: string }> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("play_mini_game", {
    p_user_id: userId,
    p_game_type: gameType,
    p_score: score,
    p_reward_hxco: rewardHxco,
    p_daily_limit: 3,
  });

  if (error) {
    if (error.message.includes("daily_limit_reached")) {
      return { success: false, error: "daily_limit_reached" };
    }
    return { success: false, error: error.message };
  }

  return {
    success: true,
    playsToday: (data as { plays_today: number }).plays_today,
  };
}

export async function getMiniGamePlaysToday(
  userId: string,
  gameType: MiniGameType
): Promise<number> {
  const supabase = await createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("mini_games")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("game_type", gameType)
    .gte("played_at", today.toISOString());

  return count ?? 0;
}

export async function getMiniGameStats() {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalResult, todayResult, topGamesResult] = await Promise.all([
    supabase.from("mini_games").select("reward_hxco").then(({ data }) => ({
      totalPlays: data?.length ?? 0,
      totalHxco: data?.reduce((s, r) => s + (r.reward_hxco ?? 0), 0) ?? 0,
    })),
    supabase
      .from("mini_games")
      .select("*", { count: "exact", head: true })
      .gte("played_at", today.toISOString())
      .then(({ count }) => ({ playsToday: count ?? 0 })),
    supabase
      .from("mini_games")
      .select("game_type")
      .then(({ data }) => {
        const counts: Record<string, number> = {};
        data?.forEach((r) => {
          counts[r.game_type] = (counts[r.game_type] ?? 0) + 1;
        });
        return Object.entries(counts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([game_type, count]) => ({ game_type, count }));
      }),
  ]);

  return {
    ...totalResult,
    ...todayResult,
    topGames: topGamesResult,
  };
}
