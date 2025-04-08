"use client"

import { Share2, Copy, CheckCircle2, Wallet } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import type { UserBalance } from "@/types"
import type { UserData } from "@/types"

export default function InvitePage(): JSX.Element {
  const [copied, setCopied] = useState<boolean>(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [userBalance, setUserBalance] = useState<UserBalance>({ ton: 0, hxco: 0 })

  const referralCode: string = "LUXHEX2024"
  const referralLink: string = `https://luxurygame.app/invite/${referralCode}`

  // Check if user is logged in on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser) as UserData
          setUser(userData)
          setIsLoggedIn(true)
          setUserBalance({
            ton: 0, // Default to 0 TON
            hxco: userData.hxcoBalance || 0,
          })
        } catch (err: unknown) {
          // Invalid stored data
          console.error("Error parsing user data:", err instanceof Error ? err.message : String(err))
        }
      }
    }
  }, [])

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Calculate referral progress
  const referralCount = user?.referrals || 0
  const maxReferrals = 10
  const referralProgress = Math.min((referralCount / maxReferrals) * 100, 100)
  const tonEarned = Math.min(referralCount * 0.01, 0.1)

  return (
    <div className="container py-4 sm:py-8 px-4 sm:px-6">
      <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight flex items-center justify-center mb-4">
          <Share2 className="h-8 w-8 text-cosmic-text" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight mb-2">
          Invite Friends & Earn TON
        </h1>
        <p className="text-cosmic-muted max-w-md text-sm sm:text-base">
          Share your referral link with friends and earn 0.01 TON for each friend who joins (up to 0.10 TON)
        </p>
      </div>

      {/* Balance Card */}
      <Card className="mb-6 sm:mb-8 border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm">
        <CardHeader className="px-4 sm:px-6 pb-2 sm:pb-4">
          <CardTitle className="text-cosmic-text text-lg sm:text-xl">Your Balance</CardTitle>
          <CardDescription className="text-cosmic-muted text-sm">Current earnings from referrals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cosmic-tertiary to-cosmic-tertiary flex items-center justify-center">
                <Wallet className="h-5 w-5 text-cosmic-text" />
              </div>
              <div>
                <p className="text-sm text-cosmic-muted">TON Earned</p>
                <p className="font-bold text-cosmic-tertiary">{tonEarned.toFixed(2)} TON</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight flex items-center justify-center">
                <span className="text-sm font-bold text-cosmic-text">HX</span>
              </div>
              <div>
                <p className="text-sm text-cosmic-muted">HXCO Balance</p>
                <p className="font-bold text-cosmic-accent">{userBalance.hxco} HXCO</p>
              </div>
            </div>
          </div>

          {/* Referral Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-cosmic-muted">Referral Progress</span>
              <span className="text-cosmic-accent">
                {referralCount}/{maxReferrals}
              </span>
            </div>
            <Progress value={referralProgress} className="h-2" />
            <p className="text-xs text-cosmic-muted">
              {referralCount >= maxReferrals
                ? "You've reached the maximum referral bonus!"
                : `Invite ${maxReferrals - referralCount} more friends to earn maximum TON`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Referral Link Card */}
      <Card className="mb-6 sm:mb-8 border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm">
        <CardHeader className="px-4 sm:px-6 pb-2 sm:pb-4">
          <CardTitle className="text-cosmic-text text-lg sm:text-xl">Your Referral Link</CardTitle>
          <CardDescription className="text-cosmic-muted text-sm">
            Share this link with your friends to earn rewards
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={referralLink}
              readOnly
              className="bg-cosmic-bg border-cosmic-accent/20 text-cosmic-muted mb-2 sm:mb-0"
            />
            <Button
              onClick={copyToClipboard}
              className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text sm:w-auto"
            >
              {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 px-4 sm:px-6 pt-0 pb-4 sm:pb-6">
          <Button
            variant="outline"
            className="border-cosmic-accent/20 text-cosmic-muted hover:bg-cosmic-accent/10 hover:text-cosmic-text w-full sm:w-auto"
            onClick={() =>
              window.open(
                "https://twitter.com/intent/tweet?text=" +
                  encodeURIComponent(`Join me on Luxury Game App and earn crypto rewards! ${referralLink}`),
                "_blank",
              )
            }
          >
            Share on Twitter
          </Button>
          <Button
            variant="outline"
            className="border-cosmic-accent/20 text-cosmic-muted hover:bg-cosmic-accent/10 hover:text-cosmic-text w-full sm:w-auto"
            onClick={() =>
              window.open(
                `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("Join me on Luxury Game App and earn crypto rewards!")}`,
                "_blank",
              )
            }
          >
            Share on Telegram
          </Button>
        </CardFooter>
      </Card>

      {/* How It Works Card - Added for mobile */}
      <Card className="border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm">
        <CardHeader className="px-4 sm:px-6 pb-2 sm:pb-4">
          <CardTitle className="text-cosmic-text text-lg sm:text-xl">How It Works</CardTitle>
          <CardDescription className="text-cosmic-muted text-sm">
            Follow these steps to earn TON through referrals
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cosmic-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cosmic-accent">1</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-cosmic-text">Share Your Link</h3>
                <p className="text-xs text-cosmic-muted">Copy your unique referral link and share it with friends</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cosmic-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cosmic-accent">2</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-cosmic-text">Friends Sign Up</h3>
                <p className="text-xs text-cosmic-muted">When your friends sign up using your link, you get credit</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cosmic-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cosmic-accent">3</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-cosmic-text">Earn Rewards</h3>
                <p className="text-xs text-cosmic-muted">
                  Earn 0.01 TON for each friend who joins, up to 0.10 TON total
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cosmic-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-cosmic-accent">4</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-cosmic-text">Withdraw TON</h3>
                <p className="text-xs text-cosmic-muted">
                  Once you have 10 referrals, you can withdraw your earned TON
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
