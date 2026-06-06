"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { TgUser, UserBalance, HexPermission } from "@/types";
import { addOrGetTelegramUser } from "@/app/actions/addOrGetTelegramUser";
import { getUserBalanceById } from "@/app/actions/getUserBalanceById";

interface UserContextValue {
  user: TgUser | null;
  balance: UserBalance | null;
  permission: HexPermission | null;
  isLoading: boolean;
  refreshBalance: () => Promise<void>;
  setUser: (user: TgUser | null) => void;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  balance: null,
  permission: null,
  isLoading: true,
  refreshBalance: async () => {},
  setUser: () => {},
});

function getOrCreateAnonymousId(): number {
  const key = "hexcoin_anon_id";
  const existing = localStorage.getItem(key);
  if (existing) return parseInt(existing, 10);
  // Generate a unique stable ID for this browser
  const id = Math.floor(Math.random() * 9_000_000_000) + 1_000_000_000;
  localStorage.setItem(key, String(id));
  return id;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TgUser | null>(null);
  const [balance, setBalance] = useState<UserBalance | null>(null);
  const [permission, setPermission] = useState<HexPermission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshBalance = useCallback(async () => {
    if (!user?.id) return;
    const result = await getUserBalanceById(user.id);
    if (result) setBalance(result);
  }, [user?.id]);

  useEffect(() => {
    async function init() {
      try {
        let tgUser: {
          id: number;
          first_name?: string;
          last_name?: string;
          username?: string;
          photo_url?: string;
          is_anonymous?: boolean;
        } | null = null;

        // 1. Try Telegram Web App (inside Telegram)
        if (
          typeof window !== "undefined" &&
          window.Telegram?.WebApp?.initDataUnsafe?.user?.id
        ) {
          const tg = window.Telegram.WebApp.initDataUnsafe.user;
          tgUser = {
            id: tg.id,
            first_name: tg.first_name,
            last_name: tg.last_name,
            username: tg.username,
            photo_url: tg.photo_url,
          };
          // Expand the webapp viewport
          window.Telegram.WebApp.expand?.();
          window.Telegram.WebApp.ready?.();
        }

        if (!tgUser && typeof window !== "undefined") {
          // 2. Check localStorage for a cached user (returning web user)
          const cached = localStorage.getItem("basicTelegramUser");
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              if (parsed.id && parsed.id !== 8168157234) {
                tgUser = parsed;
              }
            } catch {}
          }

          // 3. Generate stable anonymous ID for web visitors
          if (!tgUser) {
            const anonId = getOrCreateAnonymousId();
            tgUser = {
              id: anonId,
              first_name: "Player",
              last_name: "",
              username: `user_${anonId}`,
              is_anonymous: true,
            };
          }
        }

        if (!tgUser) return;

        const result = await addOrGetTelegramUser({
          telegram_id: tgUser.id,
          first_name: tgUser.first_name,
          last_name: tgUser.last_name,
          username: tgUser.username,
          avatar_url: tgUser.photo_url,
        });

        if (result.success && result.user) {
          setUser(result.user as TgUser);
          setBalance(result.user_balance as UserBalance);
          setPermission(result.hex_permission as HexPermission);

          localStorage.setItem(
            "basicTelegramUser",
            JSON.stringify({
              id: tgUser.id,
              first_name: tgUser.first_name,
              last_name: tgUser.last_name,
              username: tgUser.username ?? `user_${tgUser.id}`,
              avatar_url: tgUser.photo_url ?? "",
            })
          );
        }
      } catch (err) {
        console.error("UserContext init error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, []);

  return (
    <UserContext.Provider value={{ user, balance, permission, isLoading, refreshBalance, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
