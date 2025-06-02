"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Gift, Home, Send, ListTodo, Sparkles } from "lucide-react";
import { Tab } from "@/types";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import HexChaseCard from "../app/hex/components/hex-chase-card";
import ComingSoonCard from "../app/hex/components/coming-soon-card";
import GamesPage from "../app/hex/components/games-page";
import RewardPage from "../app/hex/components/reward-page";
import InvitePage from "../app/hex/components/invite-page";
import HexTabs from "./HexTabs";
import HexHeader from "./HexHeader";

interface UserData {
  id: string;
  name: string;
  email: string;
  hxcoBalance: number;
  ptsBalance: number;
  tonBalance: number;
  referrals: number;
  role: string;
  avatar: string | null;
}

const staticUser: UserData = {
  id: "tg_123456",
  name: "Telegram User",
  email: "telegramuser@example.com",
  hxcoBalance: 250,
  ptsBalance: 120,
  tonBalance: 3.75,
  referrals: 5,
  role: "user",
  avatar: null,
};

export function HexDashboardComponent() {
  const [activeTab, setActiveTab] = useState<string>("Hex");
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hxcoEarnings, setHxcoEarnings] = useState<number>(0);
  const [isEarningAnimating, setIsEarningAnimating] = useState<boolean>(false);

  const tabs: Tab[] = [
    { name: "Hex", icon: <Home className="h-5 w-5" /> },
    { name: "Task", icon: <ListTodo className="h-5 w-5" /> },
    { name: "Games", icon: <Gamepad2 className="h-5 w-5" /> },
    { name: "Invite", icon: <Send className="h-5 w-5" /> },
    { name: "Reward", icon: <Gift className="h-5 w-5" /> },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      localStorage.setItem("user", JSON.stringify(staticUser));
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Check if user is logged in on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser) as UserData;
          setUser(userData);
          setHxcoEarnings(userData.hxcoBalance || 0);
          setIsLoading(false);
        } catch (_error) {
          // Invalid stored data, clear it
          localStorage.removeItem("user");
          document.cookie =
            "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          // Redirect to home if not authenticated
          router.push("/");
        }
      } else {
        // Redirect to home if not authenticated
        router.push("/");
      }
    }
  }, [router]);

  // Simulate earning HXCO tokens randomly
  useEffect(() => {
    if (user) {
      const earnInterval = setInterval(() => {
        // 10% chance to earn HXCO every 30 seconds
        if (Math.random() < 0.1) {
          const amount = Math.floor(Math.random() * 5) + 1; // Earn 1-5 HXCO
          setHxcoEarnings((prev) => prev + amount);
          setIsEarningAnimating(true);

          // Update user data with new earnings
          setUser((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              hxcoBalance: (prev.hxcoBalance || 0) + amount,
            };
          });

          // Reset animation after 2 seconds
          setTimeout(() => {
            setIsEarningAnimating(false);
          }, 2000);
        }
      }, 30000); // Check every 30 seconds

      return () => clearInterval(earnInterval);
    }
  }, [user]);

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName);
  };

  // useEffect(() => {
  //   if (typeof window !== "undefined" && window.Telegram?.WebApp?.initDataUnsafe?.user) {
  //     const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
  //     console.log({ tgUser })
  //   }
  // }, []);

  const handlePlayGame = () => {
    router.push("/hex-chase");
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-cosmic-bg text-cosmic-text overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cosmic-accent/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cosmic-highlight/5 rounded-full blur-3xl -ml-48 -mb-48"></div>
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-cosmic-highlight rounded-full animate-pulse"></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-cosmic-highlight rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-cosmic-accent rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-cosmic-accent rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-cosmic-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <HexHeader
        user={user}
        isEarningAnimating={isEarningAnimating}
        hxcoEarnings={hxcoEarnings}
      />

      <div className="flex flex-1 w-full max-w-[1800px] mx-auto relative z-10">
        <main className="flex-1 overflow-hidden min-w-0 max-w-full">
          <AnimatePresence mode="wait">
            {activeTab === "Hex" && (
              <motion.div
                key="space"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full overflow-y-auto pb-20 flex justify-center items-center"
              >
                <div className="max-w-md w-full">
                  <HexChaseCard onPlayClick={handlePlayGame} />
                </div>
              </motion.div>
            )}
            {activeTab === "Task" && (
              <motion.div
                key="task"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full overflow-y-auto pb-20"
              >
                <ComingSoonCard />
              </motion.div>
            )}
            {activeTab === "Games" && (
              <motion.div
                key="games"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full overflow-y-auto pb-20"
              >
                <GamesPage />
              </motion.div>
            )}
            {activeTab === "Invite" && (
              <motion.div
                key="invite"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full overflow-y-auto pb-20"
              >
                <InvitePage />
              </motion.div>
            )}
            {activeTab === "Reward" && (
              <motion.div
                key="reward"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full overflow-y-auto pb-20"
              >
                <RewardPage />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <HexTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
}
