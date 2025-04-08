"use client"

import { Suspense } from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gamepad2, Gift, Home, Send, ListTodo, Sparkles } from "lucide-react"
import { Tab } from "@/types"
import { useRouter } from "next/navigation"
import LoadingSpinner from "@/app/components/LoadingSpinner"
import AdPlaceholder from "./ad-placeholder"
import HexChaseCard from "./hex-chase-card"
import ComingSoonCard from "./coming-soon-card"
import GamesPage from "./games-page"
import RewardPage from "./reward-page"
import InvitePage from "./invite-page"
import ProfileModal from "./ProfileModal"

interface UserData {
  id: string
  name: string
  email: string
  hxcoBalance: number
  ptsBalance: number
  tonBalance: number
  referrals: number
  role: string
  avatar: string | null
}

export function HexDashboardComponent() {
  const [activeTab, setActiveTab] = useState<string>("Hex")
  const router = useRouter()

  // Auth state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Live HXCO earnings animation
  const [hxcoEarnings, setHxcoEarnings] = useState<number>(0)
  const [isEarningAnimating, setIsEarningAnimating] = useState<boolean>(false)

  const tabs: Tab[] = [
    { name: "Hex", icon: <Home className="h-5 w-5" /> },
    { name: "Task", icon: <ListTodo className="h-5 w-5" /> },
    { name: "Games", icon: <Gamepad2 className="h-5 w-5" /> },
    { name: "Invite", icon: <Send className="h-5 w-5" /> },
    { name: "Reward", icon: <Gift className="h-5 w-5" /> },
  ]

  // Check if user is logged in on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser) as UserData
          setUser(userData)
          setIsLoggedIn(true)
          setHxcoEarnings(userData.hxcoBalance || 0)
          setIsLoading(false)
        } catch (_error) {
          // Invalid stored data, clear it
          localStorage.removeItem("user")
          document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
          // Redirect to home if not authenticated
          router.push("/")
        }
      } else {
        // Redirect to home if not authenticated
        router.push("/")
      }
    }
  }, [router])

  // Simulate earning HXCO tokens randomly
  useEffect(() => {
    if (isLoggedIn) {
      const earnInterval = setInterval(() => {
        // 10% chance to earn HXCO every 30 seconds
        if (Math.random() < 0.1) {
          const amount = Math.floor(Math.random() * 5) + 1 // Earn 1-5 HXCO
          setHxcoEarnings((prev) => prev + amount)
          setIsEarningAnimating(true)

          // Update user data with new earnings
          setUser((prev) => {
            if (!prev) return null
            return {
              ...prev,
              hxcoBalance: (prev.hxcoBalance || 0) + amount,
            }
          })

          // Reset animation after 2 seconds
          setTimeout(() => {
            setIsEarningAnimating(false)
          }, 2000)
        }
      }, 30000) // Check every 30 seconds

      return () => clearInterval(earnInterval)
    }
  }, [isLoggedIn])

  const handleTabChange = (tabName: string) => {
    setActiveTab(tabName)
  }

  const handleUpdateUser = (userData: UserData) => {
    setUser(userData)
  }

  // Handle logout
  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
    setIsProfileModalOpen(false)

    // Clear user data from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      localStorage.removeItem("walletConnected")

      // Also clear the cookie
      document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }

    // Redirect to home page after logout
    router.push("/")
  }

  // Handle delete account
  const handleDeleteAccount = () => {
    setUser(null)
    setIsLoggedIn(false)
    setIsProfileModalOpen(false)

    // Clear user data from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      localStorage.removeItem("walletConnected")

      // Also clear the cookie
      document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }

    // Redirect to home page after account deletion
    router.push("/")
  }

  // Handle play game button click
  const handlePlayGame = () => {
    router.push("/hex-chase")
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex flex-col min-h-screen bg-cosmic-bg text-cosmic-text overflow-hidden">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cosmic-accent/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cosmic-highlight/5 rounded-full blur-3xl -ml-48 -mb-48"></div>
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-cosmic-highlight rounded-full animate-pulse"></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-cosmic-highlight rounded-full animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-cosmic-accent rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-cosmic-accent rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-cosmic-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 border-b border-white/10 backdrop-blur-md bg-cosmic-card/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-br from-cosmic-accent to-cosmic-secondary rounded-xl flex items-center justify-center mr-3 shadow-[0_0_20px_rgba(123,63,228,0.4)]">
              <Sparkles className="h-5 w-5 text-cosmic-text animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-cosmic-text bg-clip-text text-transparent bg-gradient-to-r from-cosmic-text to-cosmic-highlight">
                Hex
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              {/* <div className="flex items-center bg-cosmic-card/50 px-3 py-1 rounded-full border border-cosmic-accent/30 shadow-inner shadow-cosmic-accent/10">
                <span className="text-cosmic-highlight font-medium mr-1">{user?.ptsBalance || 0}</span>
                <span className="text-xs text-cosmic-muted">PTS</span>
              </div> */}

              <div className="flex items-center bg-cosmic-card/50 px-3 py-1 rounded-full border border-cosmic-accent/30 shadow-inner shadow-cosmic-accent/10 relative overflow-hidden">
                <span className={`text-cosmic-accent font-medium mr-1 ${isEarningAnimating ? "animate-pulse" : ""}`}>
                  {user?.hxcoBalance || 0}
                </span>
                <span className="text-xs text-cosmic-muted">HXCO</span>

                {/* Earning animation overlay */}
                {isEarningAnimating && (
                  <div className="absolute inset-0 bg-cosmic-accent/10 flex items-center justify-center">
                    <span className="text-cosmic-accent text-xs font-bold animate-bounce">
                      +{hxcoEarnings - ((user?.hxcoBalance || 0) - hxcoEarnings)}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-cosmic-accent to-cosmic-secondary flex items-center justify-center text-cosmic-text font-bold shadow-lg shadow-cosmic-accent/20 hover:shadow-cosmic-accent/40 transition-shadow"
              >
                {user?.name?.charAt(0) || "U"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content with ads */}
      <div className="flex flex-1 w-full max-w-[1800px] mx-auto relative z-10">
        {/* Left ad space - responsive on all screens */}
        <div className="hidden sm:block w-[120px] lg:w-[160px] xl:w-[300px] flex-shrink-0 p-2">
          <div className="sticky top-4">
            <AdPlaceholder width="100%" height="600px" text="Ad Space (Left)" className="hidden sm:flex" />
          </div>
        </div>

        {/* Main content area */}
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

        {/* Right ad space - responsive on all screens */}
        <div className="hidden sm:block w-[120px] lg:w-[160px] xl:w-[300px] flex-shrink-0 p-2">
          <div className="sticky top-4">
            <AdPlaceholder width="100%" height="600px" text="Ad Space (Right)" className="hidden sm:flex" />
          </div>
        </div>
      </div>

      {/* Bottom ad space - visible on all screens but responsive */}
      <div className="w-full p-2 bg-cosmic-card/30 border-t border-cosmic-accent/10 mb-16">
        <AdPlaceholder width="100%" height="90px" text="Ad Space (Bottom)" className="flex" />
      </div>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-20">
        <div className="mx-auto max-w-md">
          <div className="mx-4 mb-4 bg-cosmic-card/80 backdrop-blur-xl border border-cosmic-accent/20 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(123,63,228,0.25)]">
            <div className="flex justify-around items-center h-16 px-2">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => handleTabChange(tab.name)}
                  className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 relative`}
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="relative">
                    <div className={`${activeTab === tab.name ? "text-cosmic-highlight" : "text-cosmic-muted"}`}>
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

      {/* Profile Modal */}
      {user && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          userData={user}
          onUpdate={handleUpdateUser}
          onLogout={handleLogout}
          onDelete={handleDeleteAccount}
        />
      )}
    </div>
  )
}