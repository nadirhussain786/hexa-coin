"use client"

import { useState, useEffect } from "react"
import { Sparkles, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import LoadingSpinner from "./LoadingSpinner"
import HexChaseCard from "./HexChaseCard"
import AuthModal from "./AuthModal"

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

export default function HomePage(){
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  // Check if user is logged in on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setIsLoggedIn(true)
        // If user is already logged in, redirect to hex dashboard
        router.push("/hex")
      }
      setIsLoading(false)
    }
  }, [router])

  // Update the handleAuthSuccess function to use UserData type
  const handleAuthSuccess = (userData: UserData): void => {
    // Store user data in localStorage and cookie
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userData))
      document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=2592000` // 30 days
    }

    // Redirect to hex dashboard after successful authentication
    router.push("/hex")
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
            <Button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text"
              size="sm"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Main content - only show game card */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <HexChaseCard />
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={handleAuthSuccess} />
    </div>
  )
}
