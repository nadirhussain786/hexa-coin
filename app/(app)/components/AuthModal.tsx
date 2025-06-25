"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Lock, User, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

// Replace any with proper UserData type
interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (userData: UserData) => void
  redirectToHome?: boolean
}

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

export default function AuthModal({ isOpen, onClose, onSuccess, redirectToHome = false }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<string>("signin")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Sign in form state
  const [signInEmail, setSignInEmail] = useState<string>("")
  const [signInPassword, setSignInPassword] = useState<string>("")

  // Sign up form state
  const [signUpName, setSignUpName] = useState<string>("")
  const [signUpEmail, setSignUpEmail] = useState<string>("")
  const [signUpPassword, setSignUpPassword] = useState<string>("")
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState<string>("")

  // In the handleSignIn and handleSignUp functions, use UserData type
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to authenticate
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful authentication
      const userData: UserData = {
        id: "user123",
        name: "John Doe",
        email: signInEmail,
        hxcoBalance: 1250,
        ptsBalance: 5000,
        tonBalance: 0,
        referrals: 8,
        role: "user",
        avatar: null,
      }

      onSuccess(userData)
      onClose()

      // Redirect to hex page after successful authentication
      router.push("/hex")
    } catch (err: unknown) {
      setError("Invalid email or password. Please try again.")
      console.error("Sign in error:", err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (signUpPassword !== signUpConfirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would be an API call to register
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock successful registration
      const userData: UserData = {
        id: "user456",
        name: signUpName,
        email: signUpEmail,
        hxcoBalance: 100, // New users get 100 HXCO
        ptsBalance: 1000, // New users get 1000 PTS
        tonBalance: 0,
        referrals: 0,
        role: "user",
        avatar: null,
      }

      onSuccess(userData)
      onClose()

      // Redirect to hex page after successful registration
      router.push("/hex")
    } catch (err: unknown) {
      setError("Failed to create account. Please try again.")
      console.error("Sign up error:", err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-cosmic-accent/30 bg-cosmic-card/95 backdrop-blur-xl shadow-2xl w-[95%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
            {activeTab === "signin" ? "Sign In" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-cosmic-muted">
            {activeTab === "signin"
              ? "Sign in to your account to continue"
              : "Create a new account to start earning rewards"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Sign In Form */}
          <TabsContent value="signin">
            {error && (
              <Alert variant="destructive" className="mb-4 bg-cosmic-secondary/10 border-cosmic-secondary/30">
                <AlertCircle className="h-4 w-4 text-cosmic-secondary" />
                <AlertDescription className="text-cosmic-secondary">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-cosmic-text text-sm">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cosmic-muted" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="pl-10 bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center flex-wrap gap-1">
                  <Label htmlFor="password" className="text-cosmic-text text-sm">
                    Password
                  </Label>
                  <button type="button" className="text-xs text-cosmic-accent hover:text-cosmic-highlight">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cosmic-muted" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="pl-10 bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text text-sm"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          {/* Sign Up Form */}
          <TabsContent value="signup">
            {error && (
              <Alert variant="destructive" className="mb-4 bg-cosmic-secondary/10 border-cosmic-secondary/30">
                <AlertCircle className="h-4 w-4 text-cosmic-secondary" />
                <AlertDescription className="text-cosmic-secondary">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-cosmic-text text-sm">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cosmic-muted" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="pl-10 bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-cosmic-text text-sm">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cosmic-muted" />
                  <Input
                    id="signup-email"
                    name="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="pl-10 bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-cosmic-text text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cosmic-muted" />
                  <Input
                    id="signup-password"
                    name="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="pl-10 bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-cosmic-text text-sm">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cosmic-muted" />
                  <Input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    placeholder="Confirm your password"
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    className="pl-10 bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text text-sm"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center sm:space-x-2 mt-4">
          <div className="text-xs text-cosmic-muted text-center">
            By continuing, you agree to our{" "}
            <a href="#" className="text-cosmic-accent hover:text-cosmic-highlight">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-cosmic-accent hover:text-cosmic-highlight">
              Privacy Policy
            </a>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
