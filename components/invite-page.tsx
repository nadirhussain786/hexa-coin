"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, CheckCircle2, Users, Sparkles, Mail } from "lucide-react"
import Image from "next/image"

export default function InvitePage() {
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState("")
  const [inviteSent, setInviteSent] = useState(false)
  const [activeTab, setActiveTab] = useState("invite")

  const inviteLink = "https://cosmic-odyssey.app/invite/user123"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sendInvite = () => {
    if (email) {
      setInviteSent(true)
      setEmail("")
      setTimeout(() => setInviteSent(false), 3000)
    }
  }

  const friends = [
    { id: 1, name: "Alex Johnson", status: "Active", avatar: "/placeholder.svg?height=40&width=40", level: 12 },
    { id: 2, name: "Jamie Smith", status: "Offline", avatar: "/placeholder.svg?height=40&width=40", level: 8 },
    { id: 3, name: "Taylor Wilson", status: "In Game", avatar: "/placeholder.svg?height=40&width=40", level: 15 },
  ]

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
          Cosmic Network
        </h1>
        <p className="text-cosmic-muted">Connect with friends and earn rewards</p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-cosmic-bg/40 p-1 rounded-full">
          <TabsTrigger
            value="invite"
            className={`rounded-full flex-1 ${activeTab === "invite" ? "bg-gradient-to-r from-cosmic-accent to-cosmic-secondary text-white shadow-[0_0_10px_rgba(123,63,228,0.3)]" : "text-cosmic-muted"}`}
          >
            Invite
          </TabsTrigger>
          <TabsTrigger
            value="friends"
            className={`rounded-full flex-1 ${activeTab === "friends" ? "bg-gradient-to-r from-cosmic-accent to-cosmic-secondary text-white shadow-[0_0_10px_rgba(123,63,228,0.3)]" : "text-cosmic-muted"}`}
          >
            Friends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invite" className="mt-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-cosmic-card border-none overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cosmic-accent/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <CardHeader className="pb-2 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight p-1 rounded">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-lg text-white">Cosmic Referral Program</CardTitle>
                </div>
                <CardDescription className="text-cosmic-muted">
                  Invite friends and earn 500 points for each friend who joins
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-6">
                  <div className="relative">
                    <Input
                      value={inviteLink}
                      readOnly
                      className="pr-24 bg-cosmic-bg/40 border-white/10 text-cosmic-muted rounded-full"
                    />
                    <Button
                      className="absolute right-1 top-1 h-8 bg-cosmic-accent hover:bg-cosmic-highlight text-white text-xs rounded-full"
                      onClick={copyToClipboard}
                    >
                      {copied ? <CheckCircle2 className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                      {copied ? "Copied" : "Copy Link"}
                    </Button>
                  </div>

                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Enter friend's email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pr-24 bg-cosmic-bg/40 border-white/10 text-cosmic-muted rounded-full"
                    />
                    <Button
                      className="absolute right-1 top-1 h-8 bg-cosmic-accent hover:bg-cosmic-highlight text-white text-xs rounded-full"
                      onClick={sendInvite}
                      disabled={!email || inviteSent}
                    >
                      {inviteSent ? <CheckCircle2 className="h-4 w-4 mr-1" /> : <Mail className="h-4 w-4 mr-1" />}
                      {inviteSent ? "Sent" : "Send Invite"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      className="border-white/10 bg-cosmic-bg/40 hover:bg-cosmic-bg/60 text-white rounded-full"
                    >
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/10 bg-cosmic-bg/40 hover:bg-cosmic-bg/60 text-white rounded-full"
                    >
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                      Tweet
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/10 bg-cosmic-bg/40 hover:bg-cosmic-bg/60 text-white rounded-full"
                    >
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 448 512">
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                      </svg>
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-cosmic-card border-white/5 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Referral Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-cosmic-bg/40 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-cosmic-highlight">8</div>
                    <div className="text-xs text-cosmic-muted">Invites Sent</div>
                  </div>
                  <div className="bg-cosmic-bg/40 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-cosmic-highlight">3</div>
                    <div className="text-xs text-cosmic-muted">Joined</div>
                  </div>
                  <div className="bg-cosmic-bg/40 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-cosmic-highlight">1,500</div>
                    <div className="text-xs text-cosmic-muted">Points Earned</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="friends" className="mt-6">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
            {friends.map((friend) => (
              <motion.div key={friend.id} variants={item}>
                <Card className="bg-cosmic-card border-white/5 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Image
                          src={friend.avatar || "/placeholder.svg"}
                          alt={friend.name}
                          width={50}
                          height={50}
                          className="rounded-full object-cover"
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-cosmic-card ${
                            friend.status === "Active"
                              ? "bg-green-500"
                              : friend.status === "In Game"
                                ? "bg-cosmic-accent"
                                : "bg-gray-500"
                          }`}
                        ></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <h3 className="font-medium truncate">{friend.name}</h3>
                          {friend.level >= 10 && (
                            <div className="ml-2 bg-cosmic-bg/40 rounded-full px-2 py-0.5 text-xs flex items-center">
                              <Sparkles className="h-3 w-3 text-cosmic-highlight mr-1" />
                              <span className="text-cosmic-highlight">Lvl {friend.level}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-cosmic-muted">{friend.status}</p>
                      </div>
                      <Button className="bg-cosmic-bg border border-cosmic-accent/30 text-cosmic-highlight hover:bg-cosmic-bg/80 hover:border-cosmic-accent/50 rounded-full h-8 px-3 text-xs">
                        Invite to Game
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <Button className="w-full bg-cosmic-bg/40 border border-white/10 text-white hover:bg-cosmic-bg/60 rounded-full">
              <Users className="h-4 w-4 mr-2" />
              Find More Friends
            </Button>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

