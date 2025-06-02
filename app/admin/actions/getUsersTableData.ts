"use server";

import { createClient } from "@/utils/supabase/server";

export async function getUsersTableData() {
  const supabase = await createClient();

  const { data: users, error: userError } = await supabase
    .from("users")
    .select("*");

  if (userError) {
    console.error("Error fetching users:", userError);
    return [];
  }

  const userIds = users.map((user) => user.id);


  const { data: balances, error: balanceError } = await supabase
    .from("user_balances")
    .select("user_id, balance_hxco, balance_ton")
    .in("user_id", userIds);

  if (balanceError) {
    console.error("Error fetching balances:", balanceError);
    return [];
  }

  const { data: referrals, error: referralError } = await supabase
    .from("user_referrals")
    .select("referrer_id");

  if (referralError) {
    console.error("Error fetching referrals:", referralError);
    return [];
  }

  const referralCounts = referrals.reduce((acc: Record<string, number>, row) => {
    if (row.referrer_id) {
      acc[row.referrer_id] = (acc[row.referrer_id] || 0) + 1;
    }
    return acc;
  }, {});

  const userTableData = users.map((user) => {
    const balance = balances.find((b) => b.user_id === user.id);
    const referralCount = referralCounts[user.id] || 0;

    return {
      id: user.id,
      name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      email: user.email,
      hxco: balance?.balance_hxco ?? 0,
      ton: balance?.balance_ton ?? 0,
      referrals: referralCount,
      registered: user.registered_at,
      role: user.role,
      status: user.status,
      telegram_id: user.telegram_id,
    };
  });

  return userTableData;
}
