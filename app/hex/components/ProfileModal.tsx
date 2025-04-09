"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  User,
  Mail,
  Lock,
  AlertCircle,
  LogOut,
  Trash2,
  Save,
  Users,
  Wallet,
  Award,
  LayoutDashboard,
} from "lucide-react"

interface UserData {
    id: string
    name: string
    email: string
    hxcoBalance: number
    ptsBalance: number
    tonBalance: number
    referrals: number
    role: string
    avatar: string | null
  }

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  userData: UserData
  onUpdate: (userData: UserData) => void
  onLogout: () => void
  onDelete: () => void
}

export default function ProfileModal({ isOpen, onClose, userData, onUpdate, onLogout, onDelete }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<string>("profile")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Profile form state
  const [name, setName] = useState<string>(userData?.name || "")
  const [email, setEmail] = useState<string>(userData?.email || "")

  // Password form state
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")

  // Delete account state
  const [confirmDelete, setConfirmDelete] = useState<string>("")

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to update profile
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user data
      const updatedUserData = {
        ...userData,
        name,
        email,
      }

      onUpdate(updatedUserData)
      setSuccess("Profile updated successfully")
    } catch (err) {
      setError("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would be an API call to update password
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess("Password updated successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setError("Failed to update password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirmDelete !== "DELETE") {
      setError("Please type DELETE to confirm account deletion")
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would be an API call to delete account
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      onDelete()
      onClose()
    } catch (err) {
      setError("Failed to delete account. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl border-cosmic-accent/30 bg-cosmic-card/95 backdrop-blur-xl shadow-2xl w-[95%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
            Your Profile
          </DialogTitle>
          <DialogDescription className="text-cosmic-muted">
            Manage your account settings and view your rewards
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="stats">Stats & Rewards</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            {error && (
              <Alert variant="destructive" className="mb-4 bg-cosmic-secondary/10 border-cosmic-secondary/30">
                <AlertCircle className="h-4 w-4 text-cosmic-secondary" />
                <AlertDescription className="text-cosmic-secondary">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 bg-green-500/10 border-green-500/30">
                <AlertCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-500">{success}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight flex items-center justify-center text-4xl font-bold text-cosmic-text">
                    {userData?.name?.charAt(0) || "U"}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-cosmic-accent/20 text-cosmic-muted hover:bg-cosmic-accent/10 hover:text-cosmic-text"
                  >
                    Change Avatar
                  </Button>
                </div>
              </div>

              <div className="md:col-span-2">
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-name" className="text-cosmic-text">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cosmic-muted" />
                      <Input
                        id="profile-name"
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-email" className="text-cosmic-text">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cosmic-muted" />
                      <Input
                        id="profile-email"
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text"
                        required
                      />
                    </div>
                  </div>

                  {userData?.role === "admin" && (
                    <Button
                      type="button"
                      variant="outline"
                      className="border-cosmic-accent/20 text-cosmic-muted hover:bg-cosmic-accent/10 hover:text-cosmic-text"
                      onClick={() => {
                        onClose()
                        window.location.href = "/admin"
                      }}
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </Button>
                  )}

                  <div className="flex justify-between pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-cosmic-accent/20 text-cosmic-muted hover:bg-cosmic-accent/10 hover:text-cosmic-text"
                      onClick={onLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>

                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text"
                      disabled={isLoading}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <h3 className="text-lg font-medium text-cosmic-text mb-4">Change Password</h3>

                {error && (
                  <Alert variant="destructive" className="mb-4 bg-cosmic-secondary/10 border-cosmic-secondary/30">
                    <AlertCircle className="h-4 w-4 text-cosmic-secondary" />
                    <AlertDescription className="text-cosmic-secondary">{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="mb-4 bg-green-500/10 border-green-500/30">
                    <AlertCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-500">{success}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password" className="text-cosmic-text">
                      Current Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cosmic-muted" />
                      <Input
                        id="current-password"
                        type="password"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="pl-10 bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-cosmic-text">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cosmic-muted" />
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10 bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-new-password" className="text-cosmic-text">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cosmic-muted" />
                      <Input
                        id="confirm-new-password"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 bg-cosmic-bg/50 border-cosmic-accent/20 text-cosmic-text"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </div>

              <div className="border-t border-cosmic-accent/10 pt-6">
                <h3 className="text-lg font-medium text-cosmic-secondary mb-4">Danger Zone</h3>
                <p className="text-cosmic-muted mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="confirm-delete" className="text-cosmic-secondary">
                      Type DELETE to confirm
                    </Label>
                    <Input
                      id="confirm-delete"
                      type="text"
                      placeholder="DELETE"
                      value={confirmDelete}
                      onChange={(e) => setConfirmDelete(e.target.value)}
                      className="bg-cosmic-bg/50 border-cosmic-secondary/20 text-cosmic-secondary"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="destructive"
                    className="bg-cosmic-secondary/20 hover:bg-cosmic-secondary/30 text-cosmic-secondary"
                    disabled={isLoading || confirmDelete !== "DELETE"}
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isLoading ? "Deleting..." : "Delete Account"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Stats & Rewards Tab */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-cosmic-text">
                    <Wallet className="h-5 w-5 mr-2 text-cosmic-accent" />
                    Balance
                  </CardTitle>
                  <CardDescription className="text-cosmic-muted">Your current earnings and points</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-cosmic-muted">HXCO Tokens:</span>
                      <span className="text-xl font-bold text-cosmic-accent">{userData?.hxcoBalance || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-cosmic-muted">Points:</span>
                      <span className="text-xl font-bold text-cosmic-highlight">{userData?.ptsBalance || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-cosmic-muted">TON Balance:</span>
                      <span className="text-xl font-bold text-cosmic-tertiary">0.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-cosmic-text">
                    <Users className="h-5 w-5 mr-2 text-cosmic-accent" />
                    Referrals
                  </CardTitle>
                  <CardDescription className="text-cosmic-muted">Your referral program status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-cosmic-muted">Total Referrals:</span>
                      <span className="text-xl font-bold text-cosmic-accent">{userData?.referrals || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-cosmic-muted">Referral Status:</span>
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${userData?.referrals >= 10 ? "bg-green-500/20 text-green-500" : "bg-cosmic-secondary/20 text-cosmic-secondary"}`}
                      >
                        {userData?.referrals >= 10 ? "Eligible for TON" : `${userData?.referrals}/10 needed`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-cosmic-muted">Earned from Referrals:</span>
                      <span className="text-cosmic-tertiary">
                        {userData?.referrals >= 10 ? "0.10 TON" : "0.00 TON"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-cosmic-text">
                    <Award className="h-5 w-5 mr-2 text-cosmic-accent" />
                    Achievements
                  </CardTitle>
                  <CardDescription className="text-cosmic-muted">Your progress and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-cosmic-bg/50 border border-cosmic-accent/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-cosmic-text">Hex Master</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-cosmic-accent/20 text-cosmic-accent">
                          In Progress
                        </span>
                      </div>
                      <p className="text-xs text-cosmic-muted mb-2">Open 50 hexagons in Hex Chase</p>
                      <div className="w-full bg-cosmic-bg h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight h-full"
                          style={{ width: "15%" }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-cosmic-muted">7/50</span>
                        <span className="text-xs text-cosmic-accent">Reward: 500 HXCO</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-cosmic-bg/50 border border-cosmic-accent/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-cosmic-text">Social Butterfly</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-cosmic-accent/20 text-cosmic-accent">
                          In Progress
                        </span>
                      </div>
                      <p className="text-xs text-cosmic-muted mb-2">Invite 20 friends to join</p>
                      <div className="w-full bg-cosmic-bg h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight h-full"
                          style={{ width: `${(userData?.referrals / 20) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-cosmic-muted">{userData?.referrals || 0}/20</span>
                        <span className="text-xs text-cosmic-accent">Reward: 0.5 TON</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-cosmic-bg/50 border border-cosmic-accent/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-cosmic-text">Daily Streak</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-cosmic-accent/20 text-cosmic-accent">
                          In Progress
                        </span>
                      </div>
                      <p className="text-xs text-cosmic-muted mb-2">Log in for 7 consecutive days</p>
                      <div className="w-full bg-cosmic-bg h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight h-full"
                          style={{ width: "42%" }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-cosmic-muted">3/7</span>
                        <span className="text-xs text-cosmic-accent">Reward: 100 HXCO</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-cosmic-bg/50 border border-cosmic-accent/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-cosmic-text">Ad Watcher</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-500">
                          Completed
                        </span>
                      </div>
                      <p className="text-xs text-cosmic-muted mb-2">Watch 10 ads in a single day</p>
                      <div className="w-full bg-cosmic-bg h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-400 h-full"
                          style={{ width: "100%" }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-cosmic-muted">10/10</span>
                        <span className="text-xs text-green-500">Claimed: 50 HXCO</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
