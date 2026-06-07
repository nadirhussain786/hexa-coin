"use client";

import { useState, useCallback } from "react";
import { playMiniGame } from "@/app/actions/playMiniGame";
import type { MiniGameType } from "@/app/actions/playMiniGame";
import { useUser } from "@/contexts/user-context";

export function useMiniGame(gameType: MiniGameType, maxScore: number) {
  const { user, refreshBalance } = useUser();
  const [gameState, setGameState] = useState<"waiting" | "playing" | "done">("waiting");
  const [score, setScore] = useState(0);
  const [rewardHxco, setRewardHxco] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calcReward = (s: number): number => {
    const pct = s / maxScore;
    if (pct >= 0.9) return 50;
    if (pct >= 0.7) return 35;
    if (pct >= 0.5) return 20;
    if (pct >= 0.3) return 10;
    if (pct > 0) return 5;
    return 0;
  };

  const startGame = useCallback(() => {
    setGameState("playing");
    setScore(0);
    setError(null);
  }, []);

  const finishGame = useCallback(async (finalScore: number) => {
    if (!user?.id) return;
    const reward = calcReward(finalScore);
    setScore(finalScore);
    setRewardHxco(reward);
    setGameState("done");

    const result = await playMiniGame(user.id, gameType, finalScore, reward);
    if (!result.success && result.error !== "daily_limit_reached") {
      setError(result.error ?? "Failed to record score");
    } else {
      await refreshBalance();
    }
    setShowReward(true);
  }, [user?.id, gameType, refreshBalance]);

  const resetGame = useCallback(() => {
    setGameState("waiting");
    setScore(0);
    setRewardHxco(0);
    setShowReward(false);
    setError(null);
  }, []);

  return {
    gameState, score, rewardHxco, showReward, error,
    startGame, finishGame, resetGame,
    setShowReward,
  };
}
