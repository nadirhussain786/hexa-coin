"use server";

import { createClient } from "@/utils/supabase/server";

export async function getAllPermission() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("hex_permissions")
    .select("*, users(first_name, last_name)");

  if (error) {
    console.error("Error reading hex permission:", error);
    return { success: false, data: [] };
  }

  const flattened = data.map((item) => {
    const { users, is_banned, ...rest } = item;

    const name = users
      ? `${users.first_name ?? ""} ${users.last_name ?? ""}`.trim()
      : "";

    const safeValues = is_banned
      ? {
          daily_limit: 0,
          ad_required: 0,
          ton_cost: 0,
        }
      : {
          daily_limit: item.daily_limit,
          ad_required: item.ad_required,
          ton_cost: item.ton_cost,
        };

    return {
      ...rest,
      is_banned,
      name,
      ...safeValues,
    };
  });

  return { success: true, data: flattened };
}
