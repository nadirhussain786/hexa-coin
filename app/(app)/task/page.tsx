"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ListTodo } from "lucide-react";
import { staggerContainer, fadeUp } from "@/lib/animations";
import { getUserTasks } from "@/app/actions/getUserTasks";
import { completeTask } from "@/app/actions/completeTask";
import { useUser } from "@/contexts/user-context";
import TaskCard from "./components/TaskCard";
import type { TaskWithStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function TaskPage() {
  const { user, refreshBalance } = useUser();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<TaskWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    if (!user?.id) return;
    const result = await getUserTasks(user.id);
    if (result.success) setTasks(result.data);
    setIsLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleClaim = async (taskId: string) => {
    if (!user?.id) return;
    const result = await completeTask(user.id, taskId);
    if (result.success) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t))
      );
      await refreshBalance();
      const task = tasks.find((t) => t.id === taskId);
      toast({
        title: "Reward Claimed!",
        description: task ? `+${task.reward_hxco} HXCO added to your balance` : "Reward added",
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Could not complete task",
        variant: "destructive",
      });
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const oneTasks = tasks.filter((t) => t.task_type === "one_time");
  const dailyTasks = tasks.filter((t) => t.task_type === "daily");

  return (
    <motion.div
      className="container px-4 py-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cosmic-accent to-cosmic-highlight flex items-center justify-center">
          <ListTodo className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-cosmic-text">Tasks</h1>
          <p className="text-xs text-cosmic-muted">
            {isLoading ? "Loading..." : `${completedCount}/${tasks.length} completed`}
          </p>
        </div>
      </motion.div>

      {/* Progress bar */}
      {tasks.length > 0 && (
        <motion.div variants={fadeUp} className="mb-6">
          <div className="h-1.5 bg-cosmic-card rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / tasks.length) * 100}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>
        </motion.div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-cosmic-card/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Daily tasks */}
          {dailyTasks.length > 0 && (
            <motion.div variants={fadeUp}>
              <h2 className="text-xs font-semibold text-cosmic-muted uppercase tracking-wider mb-3">
                Daily Tasks
              </h2>
              <motion.div
                className="space-y-2"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {dailyTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onClaim={handleClaim} />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* One-time tasks */}
          {oneTasks.length > 0 && (
            <motion.div variants={fadeUp}>
              <h2 className="text-xs font-semibold text-cosmic-muted uppercase tracking-wider mb-3">
                One-Time Tasks
              </h2>
              <motion.div
                className="space-y-2"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {oneTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onClaim={handleClaim} />
                ))}
              </motion.div>
            </motion.div>
          )}

          {tasks.length === 0 && (
            <motion.div variants={fadeUp} className="text-center py-16">
              <ListTodo className="h-12 w-12 text-cosmic-accent/30 mx-auto mb-3" />
              <p className="text-cosmic-muted">No tasks available yet</p>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}
