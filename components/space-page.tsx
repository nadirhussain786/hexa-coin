"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Sparkles, ChevronRight, Gem, Zap, Users } from "lucide-react"

export default function SpacePage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 max-w-full overflow-x-hidden">
      {/* Welcome section with card */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={fadeInUp} className="relative">
        <Card className="bg-cosmic-card border-none overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cosmic-accent/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cosmic-secondary/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

          <CardContent className="p-4 md:p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">Welcome back,</h2>
                <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cosmic-accent to-cosmic-secondary bg-clip-text text-transparent">
                  Cosmic Explorer
                </p>
                <p className="text-cosmic-muted text-sm">Your journey continues...</p>
              </div>
              <div className="relative">
                <div className="w-14 md:w-16 h-14 md:h-16 rounded-full bg-gradient-to-br from-cosmic-accent to-cosmic-secondary flex items-center justify-center shadow-[0_0_15px_rgba(123,63,228,0.4)]">
                  <span className="text-lg md:text-xl font-bold">8</span>
                </div>
                <div className="absolute -top-1 -right-1 bg-cosmic-bg rounded-full p-1 shadow-[0_0_10px_rgba(0,0,0,0.3)]">
                  <Star className="h-4 w-4 text-cosmic-tertiary" />
                </div>
                <p className="text-xs text-center mt-1 text-cosmic-muted">LEVEL</p>
              </div>
            </div>

            <div className="mt-4 md:mt-6 flex items-center justify-between">
              <Button className="bg-gradient-to-r from-cosmic-accent to-cosmic-secondary hover:opacity-90 text-white font-medium px-4 md:px-6 rounded-full shadow-[0_0_10px_rgba(123,63,228,0.3)]">
                Claim Daily
              </Button>
              <div className="flex items-center gap-1 text-cosmic-tertiary">
                <span className="text-sm font-medium">View Profile</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats section */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="grid grid-cols-3 gap-2 md:gap-4"
      >
        <Card className="bg-cosmic-card border-cosmic-accent/10 backdrop-blur-sm overflow-hidden relative group shadow-[0_5px_15px_rgba(0,0,0,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-br from-cosmic-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="p-3 md:p-4 flex flex-col items-center justify-center">
            <Trophy className="h-5 md:h-6 w-5 md:w-6 text-cosmic-highlight mb-1 md:mb-2" />
            <div className="text-lg md:text-xl font-bold">12</div>
            <div className="text-xs text-cosmic-muted">Trophies</div>
          </CardContent>
        </Card>

        <Card className="bg-cosmic-card border-cosmic-secondary/10 backdrop-blur-sm overflow-hidden relative group shadow-[0_5px_15px_rgba(0,0,0,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-br from-cosmic-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="p-3 md:p-4 flex flex-col items-center justify-center">
            <Gem className="h-5 md:h-6 w-5 md:w-6 text-cosmic-secondary mb-1 md:mb-2" />
            <div className="text-lg md:text-xl font-bold">28</div>
            <div className="text-xs text-cosmic-muted">Gems</div>
          </CardContent>
        </Card>

        <Card className="bg-cosmic-card border-cosmic-tertiary/10 backdrop-blur-sm overflow-hidden relative group shadow-[0_5px_15px_rgba(0,0,0,0.2)]">
          <div className="absolute inset-0 bg-gradient-to-br from-cosmic-tertiary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardContent className="p-3 md:p-4 flex flex-col items-center justify-center">
            <Zap className="h-5 md:h-6 w-5 md:w-6 text-cosmic-tertiary mb-1 md:mb-2" />
            <div className="text-lg md:text-xl font-bold">5</div>
            <div className="text-xs text-cosmic-muted">Streak</div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Premium card */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={fadeInUp} className="relative">
        <Card className="bg-cosmic-card border-none overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cosmic-accent/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute w-full h-full bg-[url('/placeholder.svg?height=200&width=400')] bg-no-repeat bg-right-top opacity-10"></div>
          </div>

          <CardHeader className="pb-2 relative z-10">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight p-1 rounded">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-lg bg-gradient-to-r from-cosmic-accent to-cosmic-highlight bg-clip-text text-transparent font-bold">
                COSMIC PREMIUM
              </CardTitle>
            </div>
            <CardDescription className="text-cosmic-muted">Unlock exclusive features and rewards</CardDescription>
          </CardHeader>

          <CardContent className="relative z-10">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="text-sm text-cosmic-muted">Premium Benefits</div>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-cosmic-highlight rounded-full"></div>
                    <span>Exclusive Games</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-cosmic-highlight rounded-full"></div>
                    <span>2x Rewards</span>
                  </li>
                </ul>
              </div>
              <Button className="bg-cosmic-bg border border-cosmic-accent/50 text-cosmic-highlight hover:bg-cosmic-bg/80 hover:border-cosmic-accent rounded-full px-4 md:px-6">
                Upgrade
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div custom={3} initial="hidden" animate="visible" variants={fadeInUp}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Recent Activity</h2>
          <Button variant="link" className="text-cosmic-highlight p-0 h-auto text-sm">
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {[
            {
              title: "Won Tournament Match",
              time: "2 hours ago",
              points: "+350",
              icon: Trophy,
              color: "text-cosmic-accent",
            },
            {
              title: "Completed Daily Challenge",
              time: "Yesterday",
              points: "+150",
              icon: Star,
              color: "text-cosmic-highlight",
            },
            { title: "Invited a Friend", time: "3 days ago", points: "+200", icon: Users, color: "text-cosmic-accent" },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="bg-cosmic-card border-white/5 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full bg-cosmic-bg/40 flex items-center justify-center ${activity.color}`}
                  >
                    <activity.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{activity.title}</div>
                    <div className="text-xs text-cosmic-muted">{activity.time}</div>
                  </div>
                  <div className="text-cosmic-highlight font-medium">{activity.points}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

