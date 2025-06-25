"use client"

import { useState, useEffect, useRef } from "react"

interface AdSystemState {
  adViewCount: number
  adViewsToday: number
  lastAdViewTime: number
  adCooldown: number
  showAdDialog: boolean
  adLoading: boolean
  showAdLimitMessage: boolean
}

interface AdSystemActions {
  watchAd: () => void
  setShowAdDialog: (show: boolean) => void
  setShowAdLimitMessage: (show: boolean) => void
  resetAdCount: () => void
}

export function useAdSystem(onAdComplete: () => void): AdSystemState & AdSystemActions {
  const [adViewCount, setAdViewCount] = useState<number>(0)
  const [adViewsToday, setAdViewsToday] = useState<number>(0)
  const [lastAdViewTime, setLastAdViewTime] = useState<number>(0)
  const [adCooldown, setAdCooldown] = useState<number>(0)
  const [showAdDialog, setShowAdDialog] = useState<boolean>(false)
  const [adLoading, setAdLoading] = useState<boolean>(false)
  const [showAdLimitMessage, setShowAdLimitMessage] = useState<boolean>(false)

  const adCooldownInterval = useRef<NodeJS.Timeout | null>(null)

  // Effect to handle ad cooldown timer
  useEffect(() => {
    if (adCooldown > 0) {
      adCooldownInterval.current = setInterval(() => {
        setAdCooldown((prev) => {
          if (prev <= 1) {
            if (adCooldownInterval.current) {
              clearInterval(adCooldownInterval.current)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (adCooldownInterval.current) {
        clearInterval(adCooldownInterval.current)
      }
    }
  }, [adCooldown])

  // Effect to reset ad views count at midnight
  useEffect(() => {
    const checkDate = (): void => {
      const now = new Date()
      const lastViewDate = new Date(lastAdViewTime)

      // If it's a new day, reset the ad views count
      if (
        now.getDate() !== lastViewDate.getDate() ||
        now.getMonth() !== lastViewDate.getMonth() ||
        now.getFullYear() !== lastViewDate.getFullYear()
      ) {
        setAdViewsToday(0)
      }
    }

    // Check when component mounts
    if (lastAdViewTime > 0) {
      checkDate()
    }

    // Set up interval to check every hour
    const interval = setInterval(checkDate, 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [lastAdViewTime])

  const watchAd = (): void => {
    // Check if user has reached the daily limit
    if (adViewsToday >= 2) {
      setShowAdLimitMessage(true)
      return
    }

    // Check if we're in the cooldown period
    if (adCooldown > 0) {
      return
    }

    setAdLoading(true)
    setShowAdDialog(true)

    // Simulate ad loading and viewing
    setTimeout(() => {
      setAdLoading(false)

      // After ad is "watched"
      setTimeout(() => {
        // Update ad view count and time
        setAdViewCount(adViewCount + 1)
        setAdViewsToday(adViewsToday + 1)
        setLastAdViewTime(Date.now())

        // Set cooldown for 7 seconds
        setAdCooldown(7)

        setShowAdDialog(false)

        // If user has watched 10 ads, open the hexagon
        if (adViewCount + 1 >= 10) {
          setAdViewCount(0)
          onAdComplete()
        }
      }, 2000)
    }, 1500)
  }

  const resetAdCount = (): void => {
    setAdViewCount(0)
  }

  return {
    adViewCount,
    adViewsToday,
    lastAdViewTime,
    adCooldown,
    showAdDialog,
    adLoading,
    showAdLimitMessage,
    watchAd,
    setShowAdDialog,
    setShowAdLimitMessage,
    resetAdCount,
  }
}
