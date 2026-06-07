"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Twitter, MessageCircle, Users, Hexagon, Grid, Calendar, Zap,
  Bell, Star, CheckCircle2, ExternalLink, Diamond, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { listItem } from "@/lib/animations";
import type { TaskWithStatus } from "@/types";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Twitter, MessageCircle, Users, Hexagon, Grid, Calendar, Zap, Bell, Star, Diamond,
};

interface TaskCardProps {
  task: TaskWithStatus;
  onClaim: (taskId: string) => Promise<void>;
}

export default function TaskCard({ task, onClaim }: TaskCardProps) {
  const [claiming, setClaiming] = useState(false);
  const IconComponent = ICONS[task.icon] ?? Star;
  const done = task.completed;

  const handleAction = async () => {
    if (task.action_url && !done) {
      window.open(task.action_url, "_blank");
      return;
    }
    if (!done) {
      setClaiming(true);
      try { await onClaim(task.id); } finally { setClaiming(false); }
    }
  };

  return (
    <motion.div variants={listItem}>
      <motion.div
        whileTap={{ scale: 0.985 }}
        className="relative rounded-xl overflow-hidden"
        style={
          done
            ? {
                background: "linear-gradient(135deg,rgba(16,185,129,0.1),rgba(17,13,42,0.6))",
                border: "1px solid rgba(16,185,129,0.22)",
              }
            : {
                background: "linear-gradient(135deg,rgba(26,20,56,0.8),rgba(17,13,42,0.65))",
                border: "1px solid rgba(124,58,237,0.2)",
              }
        }
      >
        {/* Shimmer for uncompleted */}
        {!done && <div className="absolute inset-0 shimmer-card pointer-events-none" />}

        <div className="relative flex items-center gap-3.5 px-4 py-3.5">
          {/* Icon */}
          <div
            className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
            style={
              done
                ? { background: "rgba(16,185,129,0.18)" }
                : {
                    background: "linear-gradient(135deg,rgba(124,58,237,0.25),rgba(168,85,247,0.12))",
                    boxShadow: "0 0 12px rgba(124,58,237,0.2)",
                  }
            }
          >
            {done ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            ) : (
              <IconComponent className="h-5 w-5 text-cosmic-accent" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-sm font-bold text-cosmic-text truncate">{task.title}</p>
              {task.task_type === "daily" && !done && (
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                  style={{
                    background: "rgba(124,58,237,0.2)",
                    color: "#A855F7",
                    border: "1px solid rgba(124,58,237,0.3)",
                  }}
                >
                  Daily
                </span>
              )}
            </div>
            {task.description && (
              <p className="text-xs text-cosmic-muted mt-0.5 line-clamp-1">{task.description}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              {task.reward_hxco > 0 && (
                <span className="text-xs font-extrabold text-gradient-gold">
                  +{task.reward_hxco} HXCO
                </span>
              )}
              {task.reward_ton > 0 && (
                <span className="text-xs font-extrabold text-gradient-cyan">
                  +{task.reward_ton} TON
                </span>
              )}
            </div>
          </div>

          {/* Action */}
          {done ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <Button
              size="sm"
              onClick={handleAction}
              disabled={claiming}
              className="flex-shrink-0 h-8 text-xs px-3 rounded-lg font-bold text-white border-0"
              style={{
                background: "linear-gradient(135deg,#7C3AED,#A855F7)",
                boxShadow: "0 0 12px rgba(124,58,237,0.35)",
                minWidth: "58px",
              }}
            >
              {claiming ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : task.action_url ? (
                <span className="flex items-center gap-1">
                  Go <ExternalLink className="h-3 w-3" />
                </span>
              ) : (
                "Claim"
              )}
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
