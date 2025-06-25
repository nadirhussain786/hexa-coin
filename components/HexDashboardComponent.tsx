"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import type { TelegramUserBase } from "@/types";

import dynamic from "next/dynamic";
const HexChaseCard = dynamic(
  () => import("../app/hex/components/hex-chase-card")
);
const ComingSoonCard = dynamic(
  () => import("../app/hex/components/coming-soon-card")
);
const GamesPage = dynamic(() => import("../app/hex/components/games-page"));
const RewardPage = dynamic(() => import("../app/hex/components/reward-page"));
const InvitePage = dynamic(() => import("../app/hex/components/invite-page"));

type Props = {
  userData: TelegramUserBase;
};

export function HexComponent({ userData }: Props) {

  const renderTabContent = useMemo(() => {
    switch (activeTab) {
      case "Hex":
        return (
          <motion.div
            key="hex"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full overflow-y-auto pb-20 flex justify-center items-center"
          >
            <div className="max-w-md w-full">
              <HexChaseCard />
            </div>
          </motion.div>
        );
      case "Task":
        return (
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
        );
      case "Games":
        return (
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
        );
      case "Invite":
        return (
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
        );
      case "Reward":
        return (
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
        );
      default:
        return null;
    }
  }, [activeTab]);

  return (
    <div className="flex-1 w-full max-w-[1800px] mx-auto relative z-10 overflow-hidden">
        <main className="flex-1 min-w-0 max-w-full">
          <AnimatePresence mode="wait">{renderTabContent}</AnimatePresence>
        </main>
      </div>
  );
}
