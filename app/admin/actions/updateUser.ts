"use server";

import { UserStatus } from "@/constants";
import { createClient } from "@/utils/supabase/server";

interface UpdateUserInput {
  userId: string;
  firstName?: string;
  lastName?: string;
  status?: UserStatus;
}

export async function updateUser({ userId, firstName, lastName, status }: UpdateUserInput) {
  const supabase = await createClient();

  const updates: Record<string, any> = {};
  if (firstName !== undefined) updates.first_name = firstName;
  if (lastName !== undefined) updates.last_name = lastName;
  if (status !== undefined) updates.status = status;

  const { error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId);

  if (error) {
    console.error("Error updating user:", error);
    return { success: false, error };
  }

  return { success: true };
}
