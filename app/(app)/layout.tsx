"use client";

import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, Home, Send, ListTodo } from "lucide-react";
import HexTabs from "@/components/HexTabs";
import type { Tab } from "@/types";
import HexHeader from "./components/HexHeader";
import { UserProvider, useUser } from "@/contexts/user-context";
import { pageTransition } from "@/lib/animations";

const tabs: Tab[] = [
  { name: "Hex", icon: <Home className="h-5 w-5" /> },
  { name: "Task", icon: <ListTodo className="h-5 w-5" /> },
  { name: "Invite", icon: <Send className="h-5 w-5" /> },
  { name: "Reward", icon: <Gift className="h-5 w-5" /> },
];

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  const activeTab = useMemo(() => {
    const path = pathname.split("/")[1] || "hex";
    return path.charAt(0).toUpperCase() + path.slice(1);
  }, [pathname]);

  const userName = user
    ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || user.username || "Player"
    : "Player";

  // Infer avatar from localStorage cache to avoid flash
  const avatarUrl =
    typeof window !== "undefined"
      ? (() => {
          try {
            return JSON.parse(localStorage.getItem("basicTelegramUser") || "{}").avatar_url || "";
          } catch {
            return "";
          }
        })()
      : "";

  return (
    <div className="flex flex-col min-h-screen bg-cosmic-bg text-cosmic-text overflow-hidden">
      {/* Cosmic background effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cosmic-accent/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cosmic-highlight/5 rounded-full blur-3xl -ml-48 -mb-48" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-cosmic-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        {/* Floating stars */}
        {[
          "top-1/3 left-1/4", "top-2/3 right-1/3",
          "top-1/4 right-1/4", "bottom-1/4 left-1/3",
        ].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos} w-1 h-1 bg-cosmic-highlight rounded-full animate-pulse`}
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </div>

      <HexHeader userName={userName} profileUrl={avatarUrl} title={activeTab} />

      <div className="flex-1 mt-[73px] w-full max-w-[1800px] mx-auto relative z-10 overflow-hidden">
        <main className="flex-1 min-w-0 max-w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              variants={pageTransition}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="h-full overflow-y-auto pb-24 scrollbar-hidden"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <HexTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabName) => {
          const path = tabName.toLowerCase() === "hex" ? "/" : `/${tabName.toLowerCase()}`;
          router.push(path);
        }}
      />
    </div>
  );
}

export default function HexGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <AppShell>{children}</AppShell>
    </UserProvider>
  );
}
