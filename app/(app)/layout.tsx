"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gift, Home, Send, ListTodo } from "lucide-react";
import HexTabs from "@/components/HexTabs";
import type { Tab, TelegramUserBase } from "@/types";
import HexHeader from "./components/HexHeader";

const tabs: Tab[] = [
  { name: "Hex", icon: <Home className="h-5 w-5" /> },
  { name: "Task", icon: <ListTodo className="h-5 w-5" /> },
  // { name: "Games", icon: <Gamepad2 className="h-5 w-5" /> },
  { name: "Invite", icon: <Send className="h-5 w-5" /> },
  { name: "Reward", icon: <Gift className="h-5 w-5" /> },
];

export default function HexGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [hxcoEarnings, setHxcoEarnings] = useState(0);
  const [isEarningAnimating, setIsEarningAnimating] = useState(false);
  const [userData, setUserData] = useState<TelegramUserBase>({
    id: 0,
    username: "Guest",
    first_name: "Guest",
    last_name: "",
    avatar_url: "",
  });

  useEffect(() => {
    const cached = localStorage.getItem("basicTelegramUser");
    if (cached) {
      try {
        setUserData(JSON.parse(cached));
      } catch {
        console.warn("Invalid cached user");
      }
    } else {
      const tg = {
        id: 8168157234,
        first_name: "Hello",
        last_name: "Code",
        photo_url:
          "https://t.me/i/userpic/320/x0L4GZ42dfjSs8dyIB78VnWgOjXyb9iezO-KhdovT5vhOO0ic3362ZoJAA4FgPoK.svg",
      };

      const basicUser: TelegramUserBase = {
        id: tg.id,
        first_name: tg.first_name,
        last_name: tg.last_name,
        username: `${tg.first_name} ${tg.last_name}`,
        avatar_url: tg.photo_url,
      };

      localStorage.setItem("basicTelegramUser", JSON.stringify(basicUser));
      setUserData(basicUser);
    }
  }, []);

  const activeTab = useMemo(() => {
    const path = pathname.split("/")[1] || "hex";
    return path.charAt(0).toUpperCase() + path.slice(1);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-cosmic-bg text-cosmic-text overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cosmic-accent/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cosmic-highlight/5 rounded-full blur-3xl -ml-48 -mb-48" />
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-cosmic-highlight rounded-full animate-pulse" />
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-cosmic-highlight rounded-full animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-cosmic-accent rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-cosmic-accent rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-cosmic-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>

      <HexHeader
        userName={userData.username}
        profileUrl={userData.avatar_url || ""}
        title={activeTab}
      />

      <div className="flex-1 mt-[73px] w-full max-w-[1800px] mx-auto relative z-10 overflow-hidden">
        <main className="flex-1 min-w-0 max-w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full overflow-y-auto pb-20"
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
          const path =
            tabName.toLowerCase() === "hex" ? "/" : `/${tabName.toLowerCase()}`;
          router.push(path);
        }}
      />
    </div>
  );
}
