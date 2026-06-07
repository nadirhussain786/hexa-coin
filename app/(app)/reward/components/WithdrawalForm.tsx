"use client";

import { useState } from "react";
import { Loader2, Wallet, AlertTriangle, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { createWithdrawal } from "@/app/admin/actions/withdrawls/createWithdrawal";
import type { UserBalance, WithdrawalFormData } from "@/types";
import { useToast } from "@/hooks/use-toast";

const MIN = { HXCO: 100, TON: 0.1 };

interface Props {
  userId: string;
  balance: UserBalance;
  referralCount: number;
  lastWithdrawalDate: string | null;
  onSuccess: () => void;
}

export default function WithdrawalForm({ userId, balance, referralCount, lastWithdrawalDate, onSuccess }: Props) {
  const { toast } = useToast();
  const [form, setForm] = useState<WithdrawalFormData>({ amount: 0, currency: "HXCO", address: "" });
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 15-day cooldown check
  const daysUntilNext = (() => {
    if (!lastWithdrawalDate) return 0;
    const diff = (Date.now() - new Date(lastWithdrawalDate).getTime()) / (1000 * 60 * 60 * 24);
    return diff < 15 ? Math.ceil(15 - diff) : 0;
  })();
  const canWithdraw = daysUntilNext === 0;

  const available = form.currency === "HXCO"
    ? Number(balance.balance_hxco)
    : Number(balance.balance_ton);

  const validate = () => {
    if (!canWithdraw) { setError(`Wait ${daysUntilNext} more days`); return false; }
    if (form.amount <= 0) { setError("Enter a valid amount"); return false; }
    if (form.amount < MIN[form.currency]) { setError(`Minimum ${MIN[form.currency]} ${form.currency}`); return false; }
    if (form.amount > available) { setError("Insufficient balance"); return false; }
    if (!form.address.trim()) { setError("Enter wallet address"); return false; }
    if (form.currency === "TON" && referralCount < 10) { setError("Need 10 referrals to withdraw TON"); return false; }
    setError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setShowConfirm(true);
  };

  const processWithdrawal = async () => {
    setShowConfirm(false);
    setIsSubmitting(true);
    try {
      const result = await createWithdrawal(userId, form.amount, form.address, form.currency);
      if (result.success) {
        toast({ title: "Withdrawal submitted", description: "Your request is being processed" });
        setForm({ amount: 0, currency: "HXCO", address: "" });
        onSuccess();
      } else {
        toast({ title: "Error", description: result.error || "Failed", variant: "destructive" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="border border-cosmic-accent/20 bg-cosmic-card/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-cosmic-text">Withdraw Funds</CardTitle>
          <CardDescription className="text-cosmic-muted">Transfer earnings to your wallet</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {!canWithdraw && (
              <Alert className="bg-cosmic-secondary/10 border-cosmic-secondary/30">
                <Clock className="h-4 w-4 text-cosmic-secondary" />
                <AlertTitle className="text-cosmic-secondary text-sm">Cooldown Active</AlertTitle>
                <AlertDescription className="text-cosmic-secondary/80 text-xs">
                  Wait {daysUntilNext} more days before your next withdrawal.
                </AlertDescription>
              </Alert>
            )}

            <Alert className={referralCount >= 10 ? "bg-green-500/10 border-green-500/30" : "bg-cosmic-secondary/10 border-cosmic-secondary/30"}>
              <Users className={`h-4 w-4 ${referralCount >= 10 ? "text-green-400" : "text-cosmic-secondary"}`} />
              <AlertTitle className={`text-sm ${referralCount >= 10 ? "text-green-400" : "text-cosmic-secondary"}`}>
                Referral Status
              </AlertTitle>
              <AlertDescription className={`text-xs ${referralCount >= 10 ? "text-green-400/80" : "text-cosmic-secondary/80"}`}>
                {referralCount >= 10
                  ? `${referralCount} referrals — TON withdrawal unlocked`
                  : `${referralCount}/10 referrals — need more to withdraw TON`}
              </AlertDescription>
            </Alert>

            {/* Currency */}
            <div className="space-y-2">
              <Label className="text-cosmic-text text-sm">Currency</Label>
              <RadioGroup
                value={form.currency}
                onValueChange={(v) => setForm({ ...form, currency: v as "HXCO" | "TON", amount: 0 })}
                className="flex gap-4"
              >
                {(["HXCO", "TON"] as const).map((c) => (
                  <div key={c} className="flex items-center gap-2">
                    <RadioGroupItem value={c} id={c} className="border-cosmic-accent" />
                    <Label htmlFor={c} className={`text-sm ${form.currency === c ? "text-cosmic-accent" : "text-cosmic-muted"}`}>{c}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-cosmic-text text-sm">Amount</Label>
                <span className="text-xs text-cosmic-muted">Available: {available.toFixed(form.currency === "HXCO" ? 0 : 4)} {form.currency}</span>
              </div>
              <div className="relative">
                <Input
                  type="number"
                  step={form.currency === "HXCO" ? "1" : "0.001"}
                  min="0"
                  value={form.amount || ""}
                  onChange={(e) => { setForm({ ...form, amount: parseFloat(e.target.value) || 0 }); setError(null); }}
                  className="bg-cosmic-bg border-cosmic-accent/20 text-cosmic-text pr-16"
                  placeholder={`Min: ${MIN[form.currency]}`}
                  disabled={!canWithdraw}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-cosmic-muted text-sm">{form.currency}</span>
                </div>
              </div>
              <button type="button" className="text-xs text-cosmic-accent hover:text-cosmic-highlight" onClick={() => setForm({ ...form, amount: available })}>
                Withdraw All
              </button>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label className="text-cosmic-text text-sm">Wallet Address</Label>
              <Input
                value={form.address}
                onChange={(e) => { setForm({ ...form, address: e.target.value }); setError(null); }}
                className="bg-cosmic-bg border-cosmic-accent/20 text-cosmic-text"
                placeholder="Your TON wallet address"
                disabled={!canWithdraw}
              />
            </div>

            {error && (
              <Alert variant="destructive" className="border-cosmic-secondary/30 bg-cosmic-secondary/10">
                <AlertTriangle className="h-4 w-4 text-cosmic-secondary" />
                <AlertDescription className="text-cosmic-secondary text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:opacity-90 text-white py-5"
              disabled={!canWithdraw || isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {!canWithdraw ? `Wait ${daysUntilNext} Days` : "Withdraw Funds"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Confirm dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="bg-cosmic-card border-cosmic-accent/20 max-w-sm">
          <DialogHeader>
            <DialogTitle className="bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
              Confirm Withdrawal
            </DialogTitle>
            <DialogDescription className="text-cosmic-muted">Review your withdrawal details</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <div className="flex justify-between text-sm">
              <span className="text-cosmic-muted">Amount</span>
              <span className="font-semibold text-cosmic-text">{form.amount} {form.currency}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-cosmic-muted">Address</span>
              <span className="font-mono text-cosmic-text text-xs">{form.address.slice(0, 8)}...{form.address.slice(-6)}</span>
            </div>
            <Alert className="bg-cosmic-accent/5 border-cosmic-accent/20">
              <Wallet className="h-4 w-4 text-cosmic-accent" />
              <AlertDescription className="text-cosmic-muted text-xs">Transactions cannot be reversed. Verify the address.</AlertDescription>
            </Alert>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)} className="border-cosmic-accent/20 text-cosmic-muted">Cancel</Button>
            <Button onClick={processWithdrawal} className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight text-white">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
