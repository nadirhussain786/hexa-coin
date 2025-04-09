"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Mail, AlertCircle, Shield } from "lucide-react"
import type { AdminCredentials } from "@/types"

// Define AdminData type
interface AdminData {
  id: string
  name: string
  email: string
  role: string
}

interface AdminLoginProps {
  onLogin: (admin: AdminData) => void
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [credentials, setCredentials] = useState<AdminCredentials>({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to authenticate admin
      // For demo purposes, we'll use a hardcoded admin credential
      if (credentials.email === "admin@luxurygame.app" && credentials.password === "admin123") {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const adminData: AdminData = {
          id: "admin1",
          name: "Admin User",
          email: credentials.email,
          role: "admin",
        }

        // Store admin session
        if (typeof window !== "undefined") {
          localStorage.setItem("adminSession", JSON.stringify(adminData))
        }

        onLogin(adminData)
      } else {
        setError("Invalid admin credentials")
      }
    } catch (_error) {
      setError("Failed to login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-md border border-cosmic-accent/30 bg-cosmic-card/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight flex items-center justify-center">
              <Shield className="h-8 w-8 text-cosmic-text" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
            Admin Login
          </CardTitle>
          <CardDescription className="text-center text-cosmic-muted">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-cosmic-secondary/10 border-cosmic-secondary/30">
              <AlertCircle className="h-4 w-4 text-cosmic-secondary" />
              <AlertDescription className="text-cosmic-secondary">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-cosmic-text">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cosmic-muted" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@luxurygame.app"
                  value={credentials.email}
                  onChange={handleChange}
                  className="pl-10 bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-cosmic-text">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cosmic-muted" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="pl-10 bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login to Dashboard"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-cosmic-muted">For demo: Email: admin@luxurygame.app | Password: admin123</p>
        </CardFooter>
      </Card>
    </div>
  )
}
