"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Twitter, MessageCircle, Users, Hexagon, Grid, Calendar, Zap,
  Bell, Star, CheckCircle2, ExternalLink, Diamond, Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listItem } from "@/lib/animations";
import type { TaskWithStatus } from "@/types";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Twitter, MessageCircle, Users, Hexagon, Grid, Calendar, Zap,
  Bell, Star, Diamond,
};

interface TaskCardProps {
  task: TaskWithStatus;
  onClaim: (taskId: string) => Promise<void>;
}

export default function TaskCard({ task, onClaim }: TaskCardProps) {
  const [claiming, setClaiming] = useState(false);

  const IconComponent = ICONS[task.icon] ?? Star;

  const handleAction = async () => {
    if (task.action_url && !task.completed) {
      window.open(task.action_url, "_blank");
      return;
    }
    if (!task.completed) {
      setClaiming(true);
      try {
        await onClaim(task.id);
      } finally {
        setClaiming(false);
      }
    }
  };

  return (
    <motion.div variants={listItem}>
      <Card
        className={`border transition-all duration-200 ${
          task.completed
            ? "border-green-500/20 bg-green-500/5"
            : "border-cosmic-accent/20 bg-cosmic-card/60 hover:border-cosmic-accent/40"
        } backdrop-blur-sm`}
      >
        <CardContent className="p-4 flex items-center gap-4">
          {/* Icon */}
          <div
            className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
              task.completed
                ? "bg-green-500/20"
                : "bg-gradient-to-br from-cosmic-accent/20 to-cosmic-highlight/10"
            }`}
          >
            {task.completed ? (
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            ) : (
              <IconComponent className="h-5 w-5 text-cosmic-accent" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-cosmic-text truncate">{task.title}</p>
              {task.task_type === "daily" && (
                <Badge className="text-[10px] px-1.5 py-0 bg-cosmic-accent/20 text-cosmic-accent border-cosmic-accent/30">
                  Daily
                </Badge>
              )}
            </div>
            {task.description && (
              <p className="text-xs text-cosmic-muted mt-0.5 line-clamp-1">{task.description}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              {task.reward_hxco > 0 && (
                <span className="text-xs font-semibold text-cosmic-accent">
                  +{task.reward_hxco} HXCO
                </span>
              )}
              {task.reward_ton > 0 && (
                <span className="text-xs font-semibold text-cosmic-tertiary">
                  +{task.reward_ton} TON
                </span>
              )}
            </div>
          </div>

          {/* Action */}
          {task.completed ? (
            <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
          ) : (
            <Button
              size="sm"
              onClick={handleAction}
              disabled={claiming}
              className="flex-shrink-0 bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:opacity-90 text-white text-xs px-3 py-1.5 rounded-lg"
            >
              {claiming ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : task.action_url ? (
                <>
                  Go <ExternalLink className="h-3 w-3 ml-1" />
                </>
              ) : (
                "Claim"
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
