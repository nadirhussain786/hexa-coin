"use server";

import { createClient } from "@/utils/supabase/client";
import crypto from "crypto";

interface TelegramUserInput {
  initData: string;
}

export async function verifyAndInsertTelegramUser({ initData }: TelegramUserInput) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
  const supabase = createClient();

  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get("hash");
  urlParams.delete("hash");

  const dataCheckString = [...urlParams.entries()]
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join("\n");

  const secret = crypto.createHash("sha256").update(BOT_TOKEN).digest();
  const hmac = crypto.createHmac("sha256", secret).update(dataCheckString).digest("hex");

  if (hmac !== hash) {
    return { success: false, error: "⚠️ Telegram verification failed. Tampered data." };
  }

  const userParam = urlParams.get("user");
  if (!userParam) {
    return { success: false, error: "❌ No user data in initData." };
  }

  const telegramUser = JSON.parse(userParam);
  const telegramId = telegramUser.id;

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("telegram_id", telegramId)
    .single();

  if (existingUser) {
    return { success: true, user: existingUser, message: "User already exists" };
  }

  // Insert new user
  const { data: newUser, error: insertError } = await supabase.from("users").insert({
    telegram_id: telegramId,
    username: telegramUser.username || null,
    first_name: telegramUser.first_name || null,
    last_name: telegramUser.last_name || null,
    avatar_url: telegramUser.photo_url || null,
    status: "active",
    role: "user",
  }).select("*").single();

  if (insertError) return { success: false, error: insertError.message };

  return { success: true, user: newUser, message: "New user created" };
}
