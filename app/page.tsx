"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gamepad2, Gift, Home, Send, ListTodo, Sparkles } from "lucide-react"
import SpacePage from "@/components/space-page"
import TaskPage from "@/components/task-page"
import GamesPage from "@/components/games-page"
import InvitePage from "@/components/invite-page"
import RewardPage from "@/components/reward-page"
import AdPlaceholder from "@/components/ad-placeholder"

export default function LuxuryGameApp() {
  const [activeTab, setActiveTab] = useState("Space")
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Show splash screen for 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const tabs = [
    { name: "Space", icon: <Home className="h-5 w-5" /> },
    { name: "Task", icon: <ListTodo className="h-5 w-5" /> },
    { name: "Games", icon: <Gamepad2 className="h-5 w-5" /> },
    { name: "Invite", icon: <Send className="h-5 w-5" /> },
    { name: "Reward", icon: <Gift className="h-5 w-5" /> },
  ]

  if (showSplash) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-cosmic-bg">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="h-20 w-20 bg-gradient-to-br from-cosmic-accent to-cosmic-secondary rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(123,63,228,0.5)]">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-cosmic-highlight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.5 }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
            }}
          />
        </motion.div>
        <motion.h1
          className="mt-6 text-3xl font-bold text-white tracking-wider"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          COSMIC ODYSSEY
        </motion.h1>
        <motion.div
          className="mt-2 text-cosmic-muted text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          PREMIUM EXPERIENCE
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-cosmic-bg text-white overflow-hidden">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cosmic-accent/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cosmic-highlight/5 rounded-full blur-3xl -ml-48 -mb-48"></div>
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-cosmic-highlight rounded-full"></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-cosmic-highlight rounded-full"></div>
        <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-cosmic-accent rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-cosmic-accent rounded-full"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 border-b border-white/5 backdrop-blur-md bg-cosmic-card/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-br from-cosmic-accent to-cosmic-secondary rounded-xl flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(123,63,228,0.3)]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-white">Cosmic Odyssey</h1>
              <p className="text-xs text-cosmic-muted">Embark on an epic journey through the stars</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-cosmic-card px-3 py-1 rounded-full border border-cosmic-accent/20">
              <span className="text-cosmic-highlight font-medium mr-1">5,000</span>
              <span className="text-xs text-cosmic-muted">PTS</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cosmic-accent to-cosmic-secondary"></div>
          </div>
        </div>
      </header>

      {/* Main content with ads */}
      <div className="flex flex-1 w-full max-w-[1800px] mx-auto relative z-10">
        {/* Left ad space - hidden on mobile */}
        <div className="hidden lg:block w-[160px] xl:w-[300px] flex-shrink-0 p-2">
          <div className="sticky top-4">
            <AdPlaceholder width="100%" height="600px" text="Ad Space (Left)" />
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-hidden min-w-0 max-w-full">
          <AnimatePresence mode="wait">
            {activeTab === "Space" && (
              <motion.div
                key="space"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full overflow-y-auto pb-20"
              >
                <SpacePage />
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
                <TaskPage />
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

        {/* Right ad space - hidden on mobile */}
        <div className="hidden lg:block w-[160px] xl:w-[300px] flex-shrink-0 p-2">
          <div className="sticky top-4">
            <AdPlaceholder width="100%" height="600px" text="Ad Space (Right)" />
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-20">
        <div className="mx-auto max-w-md">
          <div className="mx-4 mb-4 bg-cosmic-card/90 backdrop-blur-xl border border-cosmic-accent/10 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(123,63,228,0.2)]">
            <div className="flex justify-around items-center h-16 px-2">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 relative`}
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="relative">
                    <div className={`${activeTab === tab.name ? "text-cosmic-highlight" : "text-cosmic-muted"}`}>
                      {tab.icon}
                    </div>
                    {activeTab === tab.name && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cosmic-highlight rounded-full shadow-[0_0_5px_rgba(164,94,255,0.8)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.div>
                  <span
                    className={`text-xs mt-1 font-medium ${activeTab === tab.name ? "text-cosmic-highlight" : "text-cosmic-muted"}`}
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
    </div>
  )
}

