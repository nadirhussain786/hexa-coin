"use server";

import {
  DEFAULT_BALANCE,
  DEFAULT_HEX_PERMISSION,
  UserRole,
  UserStatus,
} from "@/constants";
import { TelegramUserInput } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function addOrGetTelegramUser(input: TelegramUserInput) {
  const supabase = await createClient();

  try {
    // 1. Fetch existing user by telegram_id
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("*")
      .eq("telegram_id", input.telegram_id)
      .maybeSingle();

    let user = existingUser;

    // 2. Insert user if not found
    if (!existingUser) {
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({
          telegram_id: input.telegram_id,
          username: input.username,
          first_name: input.first_name,
          last_name: input.last_name,
          avatar_url: input.avatar_url,
          status: UserStatus.Active,
          role: UserRole.User,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error inserting user:", insertError);
        return { success: false, error: insertError };
      }

      user = newUser;
    } else {
      // 3. Only update if values differ
      const updates: Partial<TelegramUserInput> = {};
      if (existingUser.username !== input.username) updates.username = input.username;
      if (existingUser.first_name !== input.first_name) updates.first_name = input.first_name;
      if (existingUser.last_name !== input.last_name) updates.last_name = input.last_name;
      if (existingUser.avatar_url !== input.avatar_url) updates.avatar_url = input.avatar_url;

      if (Object.keys(updates).length > 0) {
        const { data: updatedUser, error: updateError } = await supabase
          .from("users")
          .update(updates)
          .eq("id", existingUser.id)
          .select()
          .single();

        if (updateError) {
          console.error("Error updating user:", updateError);
          return { success: false, error: updateError };
        }

        user = updatedUser;
      }
    }

    // 4. Ensure hex_permission exists
    const { data: hex_permission } = await supabase
      .from("hex_permissions")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    let finalPermission = hex_permission;

    if (!hex_permission) {
      const { data: newPerm, error: permError } = await supabase
        .from("hex_permissions")
        .insert({
          user_id: user.id,
          ...DEFAULT_HEX_PERMISSION,
        })
        .select()
        .single();

      if (permError) {
        console.error("Error inserting hex permission:", permError);
        return { success: false, error: permError };
      }

      finalPermission = newPerm;
    }

    // 5. Ensure user_balance exists
    const { data: user_balance } = await supabase
      .from("user_balances")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    let finalBalance = user_balance;

    if (!user_balance) {
      const { data: newBalance, error: balanceError } = await supabase
        .from("user_balances")
        .insert({
          user_id: user.id,
          ...DEFAULT_BALANCE,
        })
        .select()
        .single();

      if (balanceError) {
        console.error("Error inserting user balance:", balanceError);
        return { success: false, error: balanceError };
      }

      finalBalance = newBalance;
    }

    // ✅ Return full user info
    return {
      success: true,
      user,
      hex_permission: finalPermission,
      user_balance: finalBalance,
    };
  } catch (error) {
    console.error("Unexpected error in addOrGetTelegramUser:", error);
    return { success: false, error };
  }
}
