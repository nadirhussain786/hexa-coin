"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Loader2, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getTasks } from "../actions/tasks/getTasks";
import { createTask } from "../actions/tasks/createTask";
import { updateTask } from "../actions/tasks/updateTask";
import { deleteTask } from "../actions/tasks/deleteTask";
import { staggerContainer, listItem } from "@/lib/animations";
import type { Task } from "@/types";

const EMPTY: Omit<Task, "id" | "created_at"> = {
  title: "",
  description: "",
  reward_hxco: 0,
  reward_ton: 0,
  task_type: "one_time",
  action_url: "",
  action_type: "none",
  icon: "Star",
  sort_order: 0,
  is_active: true,
};

export default function TaskManagement() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    const res = await getTasks();
    if (res.success) setTasks(res.data);
    setIsLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditingTask(null); setForm(EMPTY); setShowDialog(true); };
  const openEdit = (t: Task) => {
    setEditingTask(t);
    setForm({
      title: t.title, description: t.description ?? "",
      reward_hxco: t.reward_hxco, reward_ton: t.reward_ton,
      task_type: t.task_type, action_url: t.action_url ?? "",
      action_type: t.action_type, icon: t.icon, sort_order: t.sort_order, is_active: t.is_active,
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast({ title: "Title required", variant: "destructive" }); return; }
    setIsSaving(true);
    try {
      if (editingTask) {
        const res = await updateTask(editingTask.id, form);
        if (!res.success) throw new Error(res.error);
        setTasks((prev) => prev.map((t) => t.id === editingTask.id ? { ...t, ...form } : t));
        toast({ title: "Task updated" });
      } else {
        const res = await createTask(form);
        if (!res.success || !res.data) throw new Error(res.error);
        setTasks((prev) => [...prev, res.data!]);
        toast({ title: "Task created" });
      }
      setShowDialog(false);
    } catch (err) {
      toast({ title: "Error", description: String(err), variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this task?")) return;
    const res = await deleteTask(id);
    if (res.success) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "Task deleted" });
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    }
  };

  const toggleActive = async (t: Task) => {
    const res = await updateTask(t.id, { is_active: !t.is_active });
    if (res.success) {
      setTasks((prev) => prev.map((x) => x.id === t.id ? { ...x, is_active: !x.is_active } : x));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-cosmic-text">Task Management</h2>
        <Button onClick={openCreate} className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight text-white">
          <Plus className="h-4 w-4 mr-2" /> New Task
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-cosmic-card/40 animate-pulse" />)}
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16">
          <ListTodo className="h-12 w-12 text-cosmic-accent/30 mx-auto mb-3" />
          <p className="text-cosmic-muted">No tasks yet — create one above</p>
        </div>
      ) : (
        <motion.div className="space-y-2" variants={staggerContainer} initial="hidden" animate="visible">
          {tasks.map((t) => (
            <motion.div key={t.id} variants={listItem}>
              <Card className={`border ${t.is_active ? "border-cosmic-accent/20 bg-cosmic-card/60" : "border-cosmic-muted/10 bg-cosmic-card/30 opacity-60"} backdrop-blur-sm`}>
                <CardContent className="px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-cosmic-text">{t.title}</span>
                      <Badge className={`text-[10px] px-1.5 py-0 ${t.task_type === "daily" ? "bg-cosmic-accent/20 text-cosmic-accent border-cosmic-accent/30" : "bg-cosmic-tertiary/20 text-cosmic-tertiary border-cosmic-tertiary/30"} border`}>
                        {t.task_type}
                      </Badge>
                      {!t.is_active && <Badge className="text-[10px] px-1.5 py-0 bg-cosmic-muted/10 text-cosmic-muted border border-cosmic-muted/20">inactive</Badge>}
                    </div>
                    <div className="flex gap-3 mt-0.5 text-xs text-cosmic-muted">
                      {t.reward_hxco > 0 && <span className="text-cosmic-accent">+{t.reward_hxco} HXCO</span>}
                      {t.reward_ton > 0 && <span className="text-cosmic-tertiary">+{t.reward_ton} TON</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => toggleActive(t)} className="text-cosmic-muted hover:text-cosmic-text p-1.5 h-auto">
                      {t.is_active ? <ToggleRight className="h-4 w-4 text-cosmic-accent" /> : <ToggleLeft className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(t)} className="text-cosmic-muted hover:text-cosmic-text p-1.5 h-auto">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(t.id)} className="text-cosmic-secondary hover:text-cosmic-secondary/80 p-1.5 h-auto">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-cosmic-card border-cosmic-accent/20 max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
              {editingTask ? "Edit Task" : "Create Task"}
            </DialogTitle>
            <DialogDescription className="text-cosmic-muted">
              {editingTask ? "Update task details" : "Add a new task for users to complete"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-cosmic-text text-sm">Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-cosmic-bg border-cosmic-accent/20 text-cosmic-text" placeholder="Task title" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-cosmic-text text-sm">Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-cosmic-bg border-cosmic-accent/20 text-cosmic-text" placeholder="Optional description" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-cosmic-text text-sm">HXCO Reward</Label>
                <Input type="number" min="0" value={form.reward_hxco} onChange={(e) => setForm({ ...form, reward_hxco: parseInt(e.target.value) || 0 })} className="bg-cosmic-bg border-cosmic-accent/20 text-cosmic-text" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-cosmic-text text-sm">TON Reward</Label>
                <Input type="number" min="0" step="0.001" value={form.reward_ton} onChange={(e) => setForm({ ...form, reward_ton: parseFloat(e.target.value) || 0 })} className="bg-cosmic-bg border-cosmic-accent/20 text-cosmic-text" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-cosmic-text text-sm">Type</Label>
                <Select value={form.task_type} onValueChange={(v) => setForm({ ...form, task_type: v as "one_time" | "daily" })}>
                  <SelectTrigger className="bg-cosmic-bg border-cosmic-accent/20 text-cosmic-text">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cosmic-card border-cosmic-accent/20">
                    <SelectItem value="one_time">One Time</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-cosmic-text text-sm">Action Type</Label>
                <Select value={form.action_type} onValueChange={(v) => setForm({ ...form, action_type: v as Task["action_type"] })}>
                  <SelectTrigger className="bg-cosmic-bg border-cosmic-accent/20 text-cosmic-text">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-cosmic-card border-cosmic-accent/20">
                    <SelectItem value="link">Link</SelectItem>
                    <SelectItem value="telegram">Telegram</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-cosmic-text text-sm">Action URL</Label>
              <Input value={form.action_url} onChange={(e) => setForm({ ...form, action_url: e.target.value })} className="bg-cosmic-bg border-cosmic-accent/20 text-cosmic-text" placeholder="https://..." />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-cosmic-text text-sm">Icon</Label>
                <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="bg-cosmic-bg border-cosmic-accent/20 text-cosmic-text" placeholder="Star" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-cosmic-text text-sm">Sort Order</Label>
                <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="bg-cosmic-bg border-cosmic-accent/20 text-cosmic-text" />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDialog(false)} className="border-cosmic-accent/20 text-cosmic-muted">Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight text-white">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {editingTask ? "Save Changes" : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
