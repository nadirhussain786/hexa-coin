"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ListTodo, Trophy } from "lucide-react";
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

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const handleClaim = async (taskId: string) => {
    if (!user?.id) return;
    const result = await completeTask(user.id, taskId);
    if (result.success) {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t)));
      await refreshBalance();
      const task = tasks.find((t) => t.id === taskId);
      toast({
        title: "Reward Claimed! 🎉",
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
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const oneTasks = tasks.filter((t) => t.task_type === "one_time");
  const dailyTasks = tasks.filter((t) => t.task_type === "daily");

  return (
    <motion.div
      className="px-4 py-6 max-w-lg mx-auto"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg,#7C3AED,#A855F7)",
              boxShadow: "0 0 16px rgba(124,58,237,0.5)",
            }}
          >
            <ListTodo className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-cosmic-text">Tasks</h1>
            <p className="text-xs text-cosmic-muted">
              {isLoading ? "Loading…" : `${completedCount}/${totalCount} completed`}
            </p>
          </div>
        </div>

        {/* Progress badge */}
        {totalCount > 0 && (
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: progress === 100
                ? "linear-gradient(135deg,rgba(16,185,129,0.2),rgba(16,185,129,0.1))"
                : "rgba(124,58,237,0.15)",
              border: progress === 100
                ? "1px solid rgba(16,185,129,0.3)"
                : "1px solid rgba(124,58,237,0.25)",
            }}
          >
            <Trophy className="h-3 w-3 text-cosmic-accent" />
            <span className="text-xs font-bold text-cosmic-accent">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </motion.div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <motion.div variants={fadeUp} className="mb-6">
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
              style={{
                background: progress === 100
                  ? "linear-gradient(90deg,#10B981,#34D399)"
                  : "linear-gradient(90deg,#7C3AED,#A855F7)",
                boxShadow: progress === 100
                  ? "0 0 10px rgba(16,185,129,0.6)"
                  : "0 0 10px rgba(124,58,237,0.6)",
              }}
            />
          </div>
        </motion.div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-[68px] rounded-xl bg-shimmer"
              style={{
                background: "linear-gradient(135deg,rgba(26,20,56,0.6),rgba(17,13,42,0.4))",
                animation: `pulse 1.5s ease-in-out ${i * 0.12}s infinite`,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Daily tasks */}
          {dailyTasks.length > 0 && (
            <motion.div variants={fadeUp}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cosmic-accent/30 to-transparent" />
                <span className="text-[10px] font-bold text-cosmic-muted uppercase tracking-widest px-2">
                  Daily Tasks
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cosmic-accent/30 to-transparent" />
              </div>
              <motion.div className="space-y-2" variants={staggerContainer} initial="hidden" animate="visible">
                {dailyTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onClaim={handleClaim} />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* One-time tasks */}
          {oneTasks.length > 0 && (
            <motion.div variants={fadeUp}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cosmic-accent/30 to-transparent" />
                <span className="text-[10px] font-bold text-cosmic-muted uppercase tracking-widest px-2">
                  One-Time Tasks
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cosmic-accent/30 to-transparent" />
              </div>
              <motion.div className="space-y-2" variants={staggerContainer} initial="hidden" animate="visible">
                {oneTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onClaim={handleClaim} />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Empty state */}
          {tasks.length === 0 && (
            <motion.div variants={fadeUp} className="flex flex-col items-center py-16 gap-3">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}
              >
                <ListTodo className="h-8 w-8 text-cosmic-accent/50" />
              </div>
              <p className="text-cosmic-muted font-medium">No tasks available yet</p>
              <p className="text-xs text-cosmic-muted/60 text-center max-w-[200px]">
                Check back soon for new tasks and rewards
              </p>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}
