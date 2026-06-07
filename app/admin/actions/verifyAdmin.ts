"use server";

import { cookies } from "next/headers";

interface AdminData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function verifyAdmin(
  email: string,
  password: string
): Promise<{ success: true; admin: AdminData } | { success: false; error: string }> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return { success: false, error: "Admin credentials not configured" };
  }

  if (email !== adminEmail || password !== adminPassword) {
    return { success: false, error: "Invalid admin credentials" };
  }

  const admin: AdminData = {
    id: "admin",
    name: "Admin",
    email,
    role: "admin",
  };

  const cookieStore = await cookies();
  cookieStore.set("adminSession", JSON.stringify(admin), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return { success: true, admin };
}

export async function getAdminSession(): Promise<AdminData | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("adminSession");
  if (!session?.value) return null;
  try {
    return JSON.parse(session.value) as AdminData;
  } catch {
    return null;
  }
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("adminSession");
}
