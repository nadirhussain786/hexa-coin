// app/actions/saveUserCookie.ts
"use server";

import { TelegramUserFull } from "@/types";
import { addCookies, getCookies } from "@/utils/cookiesManager";

export async function saveUserToCookie(userData: TelegramUserFull) {
  await addCookies({ name: "telegramUser", values: userData });
}


export async function getUserFromCookie() {
  return await getCookies("telegramUser");
}


