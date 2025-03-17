"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, CheckCircle2, Star, Trophy, Sparkles, ChevronRight } from "lucide-react"
import Image from "next/image"

export default function RewardPage() {
  const rewards = [
    {
      id: 1,
      title: "Daily Bonus",
      description: "Claim your daily bonus of 200 points",
      points: 200,
      claimed: true,
      icon: Star,
      color: "from-cosmic-accent to-cosmic-highlight",
    },
    {
      id: 2,
      title: "Complete 5 Tasks",
      description: "Finish 5 tasks to earn this reward",
      points: 300,
      claimed: false,
      icon: Trophy,
      color: "from-cosmic-accent to-cosmic-highlight",
    },
    {
      id: 3,
      title: "Invite a Friend",
      description: "Get rewarded for every friend you invite",
      points: 500,
      claimed: false,
      icon: Sparkles,
      color: "from-cosmic-accent to-cosmic-highlight",
    },
    {
      id: 4,
      title: "Win a Tournament",
      description: "Win a tournament match to claim this reward",
      points: 1000,
      claimed: false,
      icon: Star,
      color: "from-cosmic-accent to-cosmic-highlight",
    },
  ]

  const premiumRewards = [
    { id: 1, name: "Cosmic Crown", image: "/placeholder.svg?height=100&width=100", cost: 2000 },
    { id: 2, name: "Nebula Aura", image: "/placeholder.svg?height=100&width=100", cost: 3500 },
    { id: 3, name: "Stellar Frame", image: "/placeholder.svg?height=100&width=100", cost: 1500 },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 max-w-full overflow-x-hidden">
      <header className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cosmic-accent to-cosmic-highlight bg-clip-text text-transparent">
          Cosmic Rewards
        </h1>
        <p className="text-cosmic-muted">Claim rewards and redeem exclusive items</p>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-cosmic-card border-none overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cosmic-accent/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cosmic-secondary/10 rounded-full blur-3xl -ml-16 -mb-16"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Your Balance</h2>
                <div className="flex items-baseline mt-1">
                  <span className="text-4xl font-bold bg-gradient-to-r from-cosmic-accent to-cosmic-secondary bg-clip-text text-transparent">
                    5,780
                  </span>
                  <span className="text-sm text-cosmic-muted ml-2">points</span>
                </div>
              </div>
              <div className="w-16 h-16 rounded-full bg-cosmic-bg/40 flex items-center justify-center shadow-[0_0_15px_rgba(123,63,228,0.2)]">
                <Gift className="h-8 w-8 text-cosmic-highlight" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button className="bg-gradient-to-r from-cosmic-accent to-cosmic-secondary hover:opacity-90 text-white rounded-full shadow-[0_0_10px_rgba(123,63,228,0.3)]">
                Redeem
              </Button>
              <Button className="bg-cosmic-bg border border-cosmic-accent/30 text-cosmic-highlight hover:bg-cosmic-bg/80 hover:border-cosmic-accent/50 rounded-full">
                Earn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Available Rewards</h2>
          <div className="text-xs text-cosmic-muted bg-cosmic-bg/40 px-2 py-1 rounded-full">Refreshes in 12:45:30</div>
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
          {rewards.map((reward) => (
            <motion.div key={reward.id} variants={item}>
              <Card className="bg-cosmic-card border-white/5 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-4 flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${reward.color} flex items-center justify-center`}
                  >
                    <reward.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{reward.title}</h3>
                    <p className="text-sm text-cosmic-muted truncate">{reward.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-cosmic-highlight font-bold">+{reward.points}</div>
                    <div className="text-xs text-cosmic-muted">points</div>
                    {reward.claimed ? (
                      <div className="flex items-center gap-1 text-green-500 text-xs mt-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Claimed
                      </div>
                    ) : (
                      <Button className="mt-1 h-7 text-xs bg-cosmic-bg border border-cosmic-accent/30 text-cosmic-highlight hover:bg-cosmic-bg/80 hover:border-cosmic-accent/50 rounded-full px-3">
                        Claim
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Premium Items</h2>
          <Button variant="link" className="text-cosmic-highlight p-0 h-auto text-sm flex items-center">
            View All <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
        >
          {premiumRewards.map((item) => (
            <motion.div key={item.id} variants={item}>
              <Card className="bg-cosmic-card border-white/5 backdrop-blur-sm overflow-hidden group">
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="relative w-16 h-16 mb-2 group-hover:scale-110 transition-transform duration-300">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-contain" />
                    <div className="absolute inset-0 bg-gradient-to-br from-cosmic-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                  </div>
                  <h3 className="text-sm font-medium text-center truncate">{item.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-cosmic-highlight text-xs">
                    <Star className="h-3 w-3" />
                    <span>{item.cost}</span>
                  </div>
                  <Button className="mt-2 w-full h-7 text-xs bg-cosmic-bg border border-cosmic-accent/30 text-cosmic-highlight hover:bg-cosmic-bg/80 hover:border-cosmic-accent/50 rounded-full">
                    Redeem
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

