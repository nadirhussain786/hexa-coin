"use client";

import { useState, useEffect, useCallback } from "react";
import type { HexReward } from "@/types";
import { recordHexOpen, getTodayOpenedHexes } from "@/app/actions/recordHexOpen";

interface GameSessionState {
  opensToday: number;
  openedHexIndices: number[];
  isLoading: boolean;
}

interface GameSessionActions {
  openHex: (
    userId: string,
    hexIndex: number,
    reward: HexReward
  ) => Promise<{ success: boolean; error?: string; opensToday?: number; dailyLimit?: number }>;
  loadTodaySession: (userId: string) => Promise<void>;
}

export function useGameSession(dailyLimit: number): GameSessionState & GameSessionActions {
  const [opensToday, setOpensToday] = useState(0);
  const [openedHexIndices, setOpenedHexIndices] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTodaySession = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      const indices = await getTodayOpenedHexes(userId);
      setOpenedHexIndices(indices);
      setOpensToday(indices.length);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openHex = useCallback(
    async (userId: string, hexIndex: number, reward: HexReward) => {
      const result = await recordHexOpen(userId, hexIndex, reward);
      if (result.success) {
        setOpenedHexIndices((prev) => [...prev, hexIndex]);
        setOpensToday((prev) => prev + 1);
        const data = result.data as { opens_today?: number; daily_limit?: number } | null;
        return {
          success: true,
          opensToday: data?.opens_today,
          dailyLimit: data?.daily_limit,
        };
      }
      return { success: false, error: result.error };
    },
    []
  );

  return {
    opensToday,
    openedHexIndices,
    isLoading,
    openHex,
    loadTodaySession,
  };
}
