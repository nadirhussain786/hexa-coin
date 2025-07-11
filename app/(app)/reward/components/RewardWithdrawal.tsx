"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  ArrowDownToLine,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Wallet,
  AlertTriangle,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  WithdrawalHistory,
  WithdrawalFormData,
  WithdrawalStatus,
  UserBalance,
  UserData,
} from "@/types";

// Sample withdrawal history data
const sampleWithdrawalHistory: WithdrawalHistory[] = [
  {
    id: "w1",
    date: "2025-03-24 14:32",
    amount: 500,
    currency: "HXCO",
    status: "Completed",
    txHash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
    address: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  },
  {
    id: "w2",
    date: "2025-03-22 09:15",
    amount: 0.5,
    currency: "TON",
    status: "Completed",
    txHash: "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
    address: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  },
  {
    id: "w3",
    date: "2025-03-20 18:45",
    amount: 250,
    currency: "HXCO",
    status: "Pending",
    address: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  },
  {
    id: "w4",
    date: "2025-03-15 11:22",
    amount: 0.25,
    currency: "TON",
    status: "Failed",
    address: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  },
];

// Minimum withdrawal amounts
const MIN_WITHDRAWAL = {
  HXCO: 100,
  TON: 0.1,
};

interface RewardWithdrawalProps {
  userBalance: UserBalance;
}

export default function RewardWithdrawal({
  userBalance,
}: RewardWithdrawalProps): JSX.Element {
  const [withdrawalHistory, setWithdrawalHistory] = useState<
    WithdrawalHistory[]
  >(sampleWithdrawalHistory);
  const [formData, setFormData] = useState<WithdrawalFormData>({
    amount: 0,
    currency: "HXCO",
    address: "",
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [withdrawalError, setWithdrawalError] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<string[]>([
    "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b",
  ]);
  const [withdrawAll, setWithdrawAll] = useState<boolean>(false);
  const [referralCount, setReferralCount] = useState<number>(5); // Example: user has 5 referrals
  const [lastWithdrawalDate, setLastWithdrawalDate] = useState<string | null>(
    null
  );
  const [daysUntilNextWithdrawal, setDaysUntilNextWithdrawal] =
    useState<number>(0);
  const [canWithdraw, setCanWithdraw] = useState<boolean>(true);
  const [user, setUser] = useState<UserData | null>(null);

  // Get user data and last withdrawal date on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser) as UserData;
          setUser(userData);
          setReferralCount(userData.referrals || 0);

          // Find the most recent completed withdrawal
          const completedWithdrawals = withdrawalHistory
            .filter((w) => w.status === "Completed")
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );

          if (completedWithdrawals.length > 0) {
            const lastWithdrawal = completedWithdrawals[0];
            setLastWithdrawalDate(lastWithdrawal.date);

            // Calculate days until next withdrawal
            const lastDate = new Date(lastWithdrawal.date);
            const currentDate = new Date();
            const diffTime = currentDate.getTime() - lastDate.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            if (diffDays < 15) {
              setDaysUntilNextWithdrawal(Math.ceil(15 - diffDays));
              setCanWithdraw(false);
            } else {
              setDaysUntilNextWithdrawal(0);
              setCanWithdraw(true);
            }
          }
        } catch (err: unknown) {
          // Invalid stored data
          console.error(
            "Error parsing user data:",
            err instanceof Error ? err.message : String(err)
          );
        }
      }
    }
  }, [withdrawalHistory]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "amount" ? Number.parseFloat(value) || 0 : value,
    });
    setWithdrawalError(null);
    setWithdrawAll(false);
  };

  // Handle currency selection
  const handleCurrencyChange = (value: string): void => {
    setFormData({
      ...formData,
      currency: value as "HXCO" | "TON",
      amount: 0, // Reset amount when currency changes
    });
    setWithdrawalError(null);
    setWithdrawAll(false);
  };

  // Handle withdraw all
  const handleWithdrawAll = (): void => {
    const maxAmount =
      formData.currency === "HXCO" ? userBalance.hxco : userBalance.ton;
    setFormData({
      ...formData,
      amount: maxAmount,
    });
    setWithdrawAll(true);
    setWithdrawalError(null);
  };

  // Validate withdrawal form
  const validateForm = (): boolean => {
    // Check if user can withdraw (15-day cooldown)
    if (!canWithdraw) {
      setWithdrawalError(
        `You need to wait ${daysUntilNextWithdrawal} more days before your next withdrawal`
      );
      return false;
    }

    // Check if amount is greater than 0
    if (formData.amount <= 0) {
      setWithdrawalError("Please enter a valid amount");
      return false;
    }

    // Check if amount is greater than minimum withdrawal
    if (formData.amount < MIN_WITHDRAWAL[formData.currency]) {
      setWithdrawalError(
        `Minimum withdrawal amount is ${MIN_WITHDRAWAL[formData.currency]} ${formData.currency}`
      );
      return false;
    }

    // Check if user has enough balance
    if (
      (formData.currency === "HXCO" && formData.amount > userBalance.hxco) ||
      (formData.currency === "TON" && formData.amount > userBalance.ton)
    ) {
      setWithdrawalError("Insufficient balance");
      return false;
    }

    // Check if address is provided
    if (!formData.address.trim()) {
      setWithdrawalError("Please enter a valid wallet address");
      return false;
    }

    // Check if user has enough referrals for TON withdrawal
    if (formData.currency === "TON" && referralCount < 10) {
      setWithdrawalError("You need at least 10 referrals to withdraw TON");
      return false;
    }

    return true;
  };

  // Handle withdrawal submission
  const handleWithdrawalSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    if (validateForm()) {
      setShowConfirmDialog(true);
    }
  };

  // Process withdrawal after confirmation
  const processWithdrawal = (): void => {
    // Close confirmation dialog
    setShowConfirmDialog(false);

    // In a real app, this would call an API to process the withdrawal
    const newWithdrawal: WithdrawalHistory = {
      id: `w${Date.now()}`,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      amount: formData.amount,
      currency: formData.currency,
      status: "Pending",
      address: formData.address,
    };

    // Add to history
    setWithdrawalHistory([newWithdrawal, ...withdrawalHistory]);

    // Save address if it's new
    if (!savedAddresses.includes(formData.address)) {
      setSavedAddresses([...savedAddresses, formData.address]);
    }

    // Update user balance (in a real app, this would be handled by the backend)
    if (formData.currency === "HXCO") {
      userBalance.hxco -= formData.amount;
    } else {
      userBalance.ton -= formData.amount;
    }

    // Show success dialog
    setShowSuccessDialog(true);

    // Reset form
    setFormData({
      amount: 0,
      currency: "HXCO",
      address: "",
    });
    setWithdrawAll(false);
  };

  // Get status icon based on withdrawal status
  const getStatusIcon = (status: WithdrawalStatus): React.JSX.Element => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-cosmic-tertiary" />;
      case "Processing":
        return <Clock className="h-4 w-4 text-cosmic-accent" />;
      case "Failed":
        return <XCircle className="h-4 w-4 text-cosmic-secondary" />;
      default:
        return <></>;
    }
  };

  // Format address for display (truncate middle)
  const formatAddress = (address: string): string => {
    if (address.length <= 12) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
  };

  // Update the grid layout to be more responsive
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
      {/* Withdrawal Form */}
      <Card className="lg:col-span-1 border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm h-fit">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-cosmic-text text-lg sm:text-xl">
            Withdraw Your Funds
          </CardTitle>
          <CardDescription className="text-cosmic-muted">
            Transfer your earnings to your wallet
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleWithdrawalSubmit}>
            <div className="space-y-4 sm:space-y-6">
              {/* Cooldown Alert */}
              {!canWithdraw && (
                <Alert className="bg-cosmic-secondary/10 border-cosmic-secondary/30">
                  <Clock className="h-4 w-4 text-cosmic-secondary" />
                  <AlertTitle className="text-cosmic-secondary text-sm">
                    Withdrawal Cooldown
                  </AlertTitle>
                  <AlertDescription className="text-cosmic-secondary/80 text-xs sm:text-sm">
                    You need to wait {daysUntilNextWithdrawal} more days before
                    your next withdrawal. Last withdrawal was on{" "}
                    {lastWithdrawalDate}.
                  </AlertDescription>
                </Alert>
              )}

              {/* Referral Status */}
              <Alert
                className={`${referralCount >= 10 ? "bg-green-500/10 border-green-500/30" : "bg-cosmic-secondary/10 border-cosmic-secondary/30"}`}
              >
                <Users
                  className={`h-4 w-4 ${referralCount >= 10 ? "text-green-500" : "text-cosmic-secondary"}`}
                />
                <AlertTitle
                  className={`${referralCount >= 10 ? "text-green-500" : "text-cosmic-secondary"} text-sm`}
                >
                  Referral Status
                </AlertTitle>
                <AlertDescription
                  className={`${referralCount >= 10 ? "text-green-500/80" : "text-cosmic-secondary/80"} text-xs sm:text-sm`}
                >
                  {referralCount >= 10
                    ? `You have ${referralCount} referrals. You can withdraw TON.`
                    : `You have ${referralCount}/10 referrals. Invite more friends to withdraw TON.`}
                </AlertDescription>
              </Alert>

              {/* Currency Selection */}
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-cosmic-text text-sm">
                  Select Currency
                </Label>
                <RadioGroup
                  value={formData.currency}
                  onValueChange={handleCurrencyChange}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="HXCO"
                      id="hxco"
                      className="border-cosmic-accent text-cosmic-accent"
                    />
                    <Label
                      htmlFor="hxco"
                      className={`${formData.currency === "HXCO" ? "text-cosmic-accent" : "text-cosmic-muted"} text-sm`}
                    >
                      HXCO
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="TON"
                      id="ton"
                      className="border-cosmic-tertiary text-cosmic-tertiary"
                    />
                    <Label
                      htmlFor="ton"
                      className={`${formData.currency === "TON" ? "text-cosmic-tertiary" : "text-cosmic-muted"} text-sm`}
                    >
                      TON{" "}
                      {referralCount < 10 && (
                        <span className="text-xs text-cosmic-secondary">
                          (10 referrals needed)
                        </span>
                      )}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Amount Input */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="amount" className="text-cosmic-text text-sm">
                    Amount
                  </Label>
                  <span className="text-xs text-cosmic-muted">
                    Available:{" "}
                    {formData.currency === "HXCO"
                      ? userBalance.hxco
                      : userBalance.ton.toFixed(2)}{" "}
                    {formData.currency}
                  </span>
                </div>
                <div className="relative">
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step={formData.currency === "HXCO" ? "1" : "0.01"}
                    min="0"
                    value={formData.amount || ""}
                    onChange={handleInputChange}
                    className="bg-cosmic-bg border-cosmic-accent/20 text-cosmic-text pr-16"
                    placeholder={`Min: ${MIN_WITHDRAWAL[formData.currency]}`}
                    disabled={!canWithdraw}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-cosmic-muted">
                      {formData.currency}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-cosmic-muted">
                    Min: {MIN_WITHDRAWAL[formData.currency]} {formData.currency}
                  </span>
                  <button
                    type="button"
                    className={`${withdrawAll ? "text-cosmic-highlight" : "text-cosmic-accent hover:text-cosmic-highlight"} ${!canWithdraw ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handleWithdrawAll}
                    disabled={!canWithdraw}
                  >
                    Withdraw All
                  </button>
                </div>
              </div>

              {/* Wallet Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-cosmic-text text-sm">
                  Wallet Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="bg-cosmic-bg border-cosmic-accent/20 text-cosmic-text"
                  placeholder="Enter your wallet address"
                  disabled={!canWithdraw}
                />

                {/* Saved Addresses */}
                {savedAddresses.length > 0 && (
                  <div className="mt-2">
                    <Label className="text-xs text-cosmic-muted mb-1 block">
                      Saved Addresses
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {savedAddresses.map((address, index) => (
                        <button
                          key={index}
                          type="button"
                          className={`text-xs px-2 py-1 rounded-full bg-cosmic-accent/10 text-cosmic-accent hover:bg-cosmic-accent/20 transition-colors ${!canWithdraw ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() =>
                            canWithdraw && setFormData({ ...formData, address })
                          }
                          disabled={!canWithdraw}
                        >
                          {formatAddress(address)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {withdrawalError && (
                <Alert
                  variant="destructive"
                  className="border-cosmic-secondary/30 bg-cosmic-secondary/10"
                >
                  <AlertTriangle className="h-4 w-4 text-cosmic-secondary" />
                  <AlertTitle className="text-cosmic-secondary text-sm">
                    Error
                  </AlertTitle>
                  <AlertDescription className="text-cosmic-secondary/80 text-xs sm:text-sm">
                    {withdrawalError}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-6 bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text"
              disabled={!canWithdraw}
            >
              {!canWithdraw
                ? `Wait ${daysUntilNextWithdrawal} Days`
                : "Withdraw Funds"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Withdrawal History */}
      <Card className="lg:col-span-2 border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-cosmic-text text-lg sm:text-xl">
            Withdrawal History
          </CardTitle>
          <CardDescription className="text-cosmic-muted">
            View all your previous withdrawal transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          {withdrawalHistory.length > 0 ? (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <Table>
                  <TableCaption>Your recent withdrawals</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-cosmic-muted">Date</TableHead>
                      <TableHead className="text-cosmic-muted">
                        Amount
                      </TableHead>
                      <TableHead className="text-cosmic-muted">
                        Status
                      </TableHead>
                      <TableHead className="text-cosmic-muted">
                        Address
                      </TableHead>
                      <TableHead className="text-cosmic-muted">
                        Transaction
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawalHistory.map((withdrawal) => (
                      <TableRow key={withdrawal.id}>
                        <TableCell className="text-cosmic-muted text-xs sm:text-sm">
                          {withdrawal.date}
                        </TableCell>
                        <TableCell
                          className={`font-medium text-xs sm:text-sm ${
                            withdrawal.currency === "HXCO"
                              ? "text-cosmic-accent"
                              : "text-cosmic-tertiary"
                          }`}
                        >
                          {withdrawal.amount} {withdrawal.currency}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(withdrawal.status)}
                            <span
                              className={`text-xs sm:text-sm ${
                                withdrawal.status === "Completed"
                                  ? "text-green-500"
                                  : withdrawal.status === "Pending"
                                    ? "text-cosmic-tertiary"
                                    : withdrawal.status === "Processing"
                                      ? "text-cosmic-accent"
                                      : "text-cosmic-secondary"
                              }`}
                            >
                              {withdrawal.status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-cosmic-muted text-xs">
                          {formatAddress(withdrawal.address)}
                        </TableCell>
                        <TableCell>
                          {withdrawal.txHash ? (
                            <a
                              href={`https://explorer.ton.org/transaction/${withdrawal.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-cosmic-accent hover:text-cosmic-highlight"
                            >
                              <span className="text-xs">View</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-cosmic-muted text-xs">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <ArrowDownToLine className="h-12 w-12 text-cosmic-accent/20 mx-auto mb-4" />
              <p className="text-cosmic-muted">No withdrawal history yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Card - Only visible on mobile as a third card, on desktop it's in a sidebar */}
      <Card className="lg:hidden border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm h-fit">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-cosmic-text text-lg">
            Withdrawal Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div>
            <h3 className="text-sm font-medium text-cosmic-text mb-1">
              Processing Time
            </h3>
            <p className="text-xs text-cosmic-muted">
              Withdrawals are typically processed within 24 hours.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-cosmic-text mb-1">
              Minimum Withdrawal
            </h3>
            <div className="space-y-1">
              <p className="text-xs flex justify-between">
                <span className="text-cosmic-muted">HXCO</span>
                <span className="text-cosmic-accent">
                  {MIN_WITHDRAWAL.HXCO} HXCO
                </span>
              </p>
              <p className="text-xs flex justify-between">
                <span className="text-cosmic-muted">TON</span>
                <span className="text-cosmic-tertiary">
                  {MIN_WITHDRAWAL.TON} TON
                </span>
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-cosmic-text mb-1">
              Withdrawal Cooldown
            </h3>
            <p className="text-xs text-cosmic-muted">
              You can only make one withdrawal every 15 days. This helps us
              manage processing fees and ensure security.
            </p>
          </div>
          <Alert className="bg-cosmic-accent/5 border-cosmic-accent/20">
            <Wallet className="h-4 w-4 text-cosmic-accent" />
            <AlertTitle className="text-cosmic-text text-sm">
              Double-check your address
            </AlertTitle>
            <AlertDescription className="text-cosmic-muted text-xs">
              Make sure you enter the correct wallet address. Transactions
              cannot be reversed.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Desktop Information Card - Only visible on desktop as a sidebar */}
      <Card className="hidden lg:block lg:col-span-1 border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm h-fit">
        <CardHeader>
          <CardTitle className="text-cosmic-text">Withdrawal Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-cosmic-text mb-1">
              Processing Time
            </h3>
            <p className="text-xs text-cosmic-muted">
              Withdrawals are typically processed within 24 hours.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-cosmic-text mb-1">
              Minimum Withdrawal
            </h3>
            <div className="space-y-1">
              <p className="text-xs flex justify-between">
                <span className="text-cosmic-muted">HXCO</span>
                <span className="text-cosmic-accent">
                  {MIN_WITHDRAWAL.HXCO} HXCO
                </span>
              </p>
              <p className="text-xs flex justify-between">
                <span className="text-cosmic-muted">TON</span>
                <span className="text-cosmic-tertiary">
                  {MIN_WITHDRAWAL.TON} TON
                </span>
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-cosmic-text mb-1">
              Withdrawal Cooldown
            </h3>
            <p className="text-xs text-cosmic-muted">
              You can only make one withdrawal every 15 days. This helps us
              manage processing fees and ensure security.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-cosmic-text mb-1">
              TON Referral Bonus
            </h3>
            <p className="text-xs text-cosmic-muted">
              Invite friends to earn 0.01 TON per referral (up to 10 referrals).
              You need at least 10 referrals to withdraw TON.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-cosmic-text mb-1">Fees</h3>
            <p className="text-xs text-cosmic-muted">
              No withdrawal fees are charged by our platform. Network fees may
              apply.
            </p>
          </div>
          <Alert className="bg-cosmic-accent/5 border-cosmic-accent/20">
            <Wallet className="h-4 w-4 text-cosmic-accent" />
            <AlertTitle className="text-cosmic-text text-sm">
              Double-check your address
            </AlertTitle>
            <AlertDescription className="text-cosmic-muted text-xs">
              Make sure you enter the correct wallet address. Transactions
              cannot be reversed.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="shadow-xl max-w-sm mx-auto bg-cosmic-card border-cosmic-accent/20">
          <DialogHeader>
            <DialogTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
              Confirm Withdrawal
            </DialogTitle>
            <DialogDescription className="text-cosmic-muted">
              Please review your withdrawal details
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex justify-between">
              <span className="text-cosmic-muted">Amount:</span>
              <span className="font-medium text-cosmic-text">
                {formData.amount} {formData.currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-cosmic-muted">To Address:</span>
              <span className="font-medium text-cosmic-text text-xs">
                {formatAddress(formData.address)}
              </span>
            </div>
            <Alert className="bg-cosmic-accent/5 border-cosmic-accent/20">
              <AlertTriangle className="h-4 w-4 text-cosmic-accent" />
              <AlertDescription className="text-cosmic-muted text-xs">
                This action cannot be undone. Please ensure all details are
                correct.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="border-cosmic-accent/20 text-cosmic-muted hover:bg-cosmic-accent/10 hover:text-cosmic-text"
            >
              Cancel
            </Button>
            <Button
              onClick={processWithdrawal}
              className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text"
            >
              Confirm Withdrawal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="shadow-xl max-w-sm mx-auto bg-cosmic-card border-cosmic-accent/20">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight flex items-center justify-center mb-6 shadow-lg">
              <CheckCircle2 className="h-10 w-10 text-cosmic-text" />
            </div>
            <DialogTitle className="text-xl text-center bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight mb-2">
              Withdrawal Initiated
            </DialogTitle>
            <DialogDescription className="text-cosmic-muted text-center max-w-xs">
              Your withdrawal request has been submitted and is being processed.
              You can track its status in the withdrawal history.
            </DialogDescription>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="w-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
