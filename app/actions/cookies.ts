"use server";

import { cookies } from "next/headers";
import type { TelegramUserFull } from "@/types";

export async function saveUserToCookie(userData: TelegramUserFull) {
  const cookieStore = await cookies();
  cookieStore.set("telegramUser", JSON.stringify(userData), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
  });
}

export async function getUserFromCookie(): Promise<TelegramUserFull | null> {
  const cookieStore = await cookies();
  const val = cookieStore.get("telegramUser");
  if (!val?.value) return null;
  try { return JSON.parse(val.value) as TelegramUserFull; } catch { return null; }
}
