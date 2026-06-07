"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const ADS_PER_HEX = 10;
const AD_COOLDOWN_SECS = 7;
const STORAGE_KEY = "hexcoin_ad_progress";

interface StoredAdState {
  adViewCount: number;
  date: string; // YYYY-MM-DD to detect day change
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function loadStoredState(): StoredAdState {
  if (typeof window === "undefined") return { adViewCount: 0, date: todayStr() };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { adViewCount: 0, date: todayStr() };
    const parsed: StoredAdState = JSON.parse(raw);
    // Reset if it's a new day
    if (parsed.date !== todayStr()) return { adViewCount: 0, date: todayStr() };
    return parsed;
  } catch {
    return { adViewCount: 0, date: todayStr() };
  }
}

function saveStoredState(state: StoredAdState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

interface AdSystemState {
  adViewCount: number;
  adCooldown: number;
  showAdDialog: boolean;
  adLoading: boolean;
  showAdLimitMessage: boolean;
  adsNeeded: number;
}

interface AdSystemActions {
  watchAd: () => void;
  setShowAdDialog: (show: boolean) => void;
  setShowAdLimitMessage: (show: boolean) => void;
  resetAdCount: () => void;
}

export function useAdSystem(onAdComplete: () => void): AdSystemState & AdSystemActions {
  const [adViewCount, setAdViewCount] = useState(0);
  const [adCooldown, setAdCooldown] = useState(0);
  const [showAdDialog, setShowAdDialog] = useState(false);
  const [adLoading, setAdLoading] = useState(false);
  const [showAdLimitMessage, setShowAdLimitMessage] = useState(false);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onAdComplete);
  onCompleteRef.current = onAdComplete;

  // Load persisted state on mount
  useEffect(() => {
    const stored = loadStoredState();
    setAdViewCount(stored.adViewCount);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (adCooldown <= 0) return;
    cooldownRef.current = setInterval(() => {
      setAdCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (cooldownRef.current) clearInterval(cooldownRef.current); };
  }, [adCooldown]);

  const resetAdCount = useCallback(() => {
    setAdViewCount(0);
    saveStoredState({ adViewCount: 0, date: todayStr() });
  }, []);

  const watchAd = useCallback(() => {
    if (adCooldown > 0) return;

    setAdLoading(true);
    setShowAdDialog(true);

    // Simulate ad loading (1.5s) then watching (2s)
    setTimeout(() => {
      setAdLoading(false);

      setTimeout(() => {
        setShowAdDialog(false);
        setAdCooldown(AD_COOLDOWN_SECS);

        setAdViewCount((prev) => {
          const next = prev + 1;
          if (next >= ADS_PER_HEX) {
            // Earned a free hex open!
            saveStoredState({ adViewCount: 0, date: todayStr() });
            setTimeout(() => onCompleteRef.current(), 100);
            return 0;
          }
          saveStoredState({ adViewCount: next, date: todayStr() });
          return next;
        });
      }, 2000);
    }, 1500);
  }, [adCooldown]);

  return {
    adViewCount,
    adCooldown,
    showAdDialog,
    adLoading,
    showAdLimitMessage,
    adsNeeded: ADS_PER_HEX,
    watchAd,
    setShowAdDialog,
    setShowAdLimitMessage,
    resetAdCount,
  };
}
