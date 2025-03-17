"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, Trophy, Zap, Star, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TaskPage() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Complete daily mission",
      description: "Play 3 games today",
      completed: true,
      reward: 150,
      icon: Star,
      color: "from-cosmic-accent to-cosmic-highlight",
    },
    {
      id: 2,
      title: "Win a tournament match",
      description: "Participate and win in the weekly tournament",
      completed: false,
      reward: 300,
      icon: Trophy,
      color: "from-cosmic-accent to-cosmic-highlight",
    },
    {
      id: 3,
      title: "Invite 2 friends",
      description: "Send invites to friends to join the platform",
      completed: false,
      reward: 200,
      icon: Sparkles,
      color: "from-cosmic-accent to-cosmic-highlight",
    },
    {
      id: 4,
      title: "Reach level 10",
      description: "Continue playing to reach level 10",
      completed: false,
      reward: 500,
      icon: Zap,
      color: "from-cosmic-accent to-cosmic-highlight",
    },
    {
      id: 5,
      title: "Customize your avatar",
      description: "Visit the store and customize your character",
      completed: false,
      reward: 100,
      icon: Star,
      color: "from-cosmic-accent to-cosmic-highlight",
    },
  ])

  const toggleTask = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalTasks = tasks.length
  const progressPercentage = (completedTasks / totalTasks) * 100

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
          Cosmic Tasks
        </h1>
        <p className="text-cosmic-muted">Complete tasks to earn exclusive rewards</p>
      </header>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-cosmic-card border-none overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cosmic-highlight/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-white">Daily Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-cosmic-muted">
                  {completedTasks} of {totalTasks} completed
                </span>
                <span className="text-cosmic-highlight font-medium">{progressPercentage.toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-cosmic-bg/40 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cosmic-accent to-cosmic-secondary rounded-full shadow-[0_0_10px_rgba(123,63,228,0.4)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs text-cosmic-muted">Daily Reward</div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-cosmic-highlight" />
                  <span className="text-cosmic-highlight font-medium">+{completedTasks * 50}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Your Tasks</h2>
          <div className="text-xs text-cosmic-muted bg-cosmic-bg/40 px-2 py-1 rounded-full">Refreshes in 12:45:30</div>
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
          {tasks.map((task, index) => (
            <motion.div key={task.id} variants={item} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                className={`bg-cosmic-card border-white/5 backdrop-blur-sm overflow-hidden relative`}
                onClick={() => toggleTask(task.id)}
              >
                {task.completed && <div className="absolute inset-0 bg-green-500/10"></div>}
                <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b ${task.color}"></div>
                <CardContent className="p-4 flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${task.color} flex items-center justify-center`}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : (
                      <task.icon className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium truncate ${task.completed ? "text-green-400" : "text-white"}`}>
                      {task.title}
                    </h3>
                    <p className="text-sm text-cosmic-muted truncate">{task.description}</p>
                    <div className="flex items-center gap-1 mt-1 text-xs text-cosmic-muted">
                      <Clock className="h-3 w-3" />
                      <span>Expires in 23h 45m</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-cosmic-highlight font-bold">+{task.reward}</div>
                    <div className="text-xs text-cosmic-muted">points</div>
                    {!task.completed && (
                      <Button className="mt-2 h-7 text-xs bg-cosmic-bg border border-cosmic-accent/30 text-cosmic-highlight hover:bg-cosmic-bg/80 hover:border-cosmic-accent/50 rounded-full px-3">
                        Complete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

