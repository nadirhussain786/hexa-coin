"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Tab } from "@/types";

interface HexTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabName: string) => void;
}

const HexTabs: React.FC<HexTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40">
      {/* Fade gradient above bar */}
      <div
        className="h-10 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(8,5,20,0.85), transparent)" }}
      />

      <div className="px-3 pb-3 max-w-lg mx-auto">
        <div
          className="relative flex items-center justify-around h-[62px] rounded-2xl px-1.5"
          style={{
            background: "linear-gradient(135deg, rgba(17,13,42,0.96), rgba(26,20,56,0.92))",
            border: "1px solid rgba(124,58,237,0.22)",
            boxShadow:
              "0 0 0 1px rgba(124,58,237,0.06), " +
              "0 -4px 24px rgba(0,0,0,0.6), " +
              "0 0 50px rgba(124,58,237,0.1), " +
              "inset 0 1px 0 rgba(255,255,255,0.05)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                onClick={() => onTabChange(tab.name)}
                className="relative flex flex-col items-center justify-center flex-1 h-full gap-0.5 select-none"
              >
                {/* Sliding active background pill */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-y-1.5 inset-x-1 rounded-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(124,58,237,0.28), rgba(168,85,247,0.14))",
                      boxShadow: "0 0 18px rgba(124,58,237,0.22), inset 0 1px 0 rgba(255,255,255,0.06)",
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}

                <motion.div
                  whileTap={{ scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="relative z-10 flex flex-col items-center gap-0.5"
                >
                  {/* Icon */}
                  <motion.div
                    animate={isActive ? { y: -1 } : { y: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className={`transition-colors duration-200 ${
                      isActive ? "text-cosmic-highlight" : "text-cosmic-muted"
                    }`}
                    style={isActive ? { filter: "drop-shadow(0 0 6px rgba(168,85,247,0.8))" } : {}}
                  >
                    {tab.icon}
                  </motion.div>

                  {/* Label */}
                  <span
                    className={`text-[10px] font-semibold leading-none transition-all duration-200 ${
                      isActive ? "text-cosmic-highlight" : "text-cosmic-muted/70"
                    }`}
                  >
                    {tab.name}
                  </span>
                </motion.div>

                {/* Bottom dot */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabDot"
                    className="absolute bottom-1.5 w-1 h-1 rounded-full"
                    style={{
                      background: "#A855F7",
                      boxShadow: "0 0 7px rgba(168,85,247,1)",
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default HexTabs;
