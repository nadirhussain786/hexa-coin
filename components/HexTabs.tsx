"use client"

import { motion } from "framer-motion"
import { Tab } from "@/types"

interface HexTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabName: string) => void
}

const HexTabs: React.FC<HexTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20">
      <div className="mx-auto max-w-md">
        <div className="mx-4 mb-4 bg-cosmic-card/80 backdrop-blur-xl border border-cosmic-accent/20 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(123,63,228,0.25)]">
          <div className="flex justify-around items-center h-16 px-2">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => onTabChange(tab.name)}
                className="flex flex-col items-center justify-center w-full h-full transition-all duration-300 relative"
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="relative">
                  <div className={activeTab === tab.name ? "text-cosmic-highlight" : "text-cosmic-muted"}>
                    {tab.icon}
                  </div>
                  {activeTab === tab.name && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cosmic-highlight rounded-full shadow-[0_0_8px_rgba(164,94,255,0.9)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
                <span
                  className={`text-xs mt-1 font-medium ${
                    activeTab === tab.name ? "text-cosmic-highlight" : "text-cosmic-muted"
                  }`}
                >
                  {tab.name}
                </span>
                {activeTab === tab.name && (
                  <motion.div
                    layoutId="tabBackground"
                    className="absolute inset-0 bg-gradient-to-b from-cosmic-accent/20 to-cosmic-accent/5 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default HexTabs
