"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Briefcase, LogOut, CheckCircle, Clock } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [isOnWaitlist, setIsOnWaitlist] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        router.push("/signin")
        return
      }

      setUser(user)

      // Check if user is on waitlist
      if (user.email) {
        const { data: waitlistEntry } = await supabase
          .from("waitlist_entries")
          .select("email")
          .eq("email", user.email)
          .maybeSingle()

        setIsOnWaitlist(!!waitlistEntry)
      }

      setLoading(false)
    }

    getUser()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    })
    router.push("/")
  }

  const handleJoinWaitlist = async () => {
    if (!user?.email) return

    try {
      const { error } = await supabase.from("waitlist_entries").insert({ email: user.email })

      if (error) {
        if (error.code === "23505") {
          // Already exists
          setIsOnWaitlist(true)
          toast({
            title: "Already on waitlist",
            description: "You're already on our waitlist!",
          })
        } else {
          throw error
        }
      } else {
        setIsOnWaitlist(true)
        toast({
          title: "Added to waitlist",
          description: "You've been added to our waitlist!",
        })
      }
    } catch (error) {
      console.error("Error joining waitlist:", error)
      toast({
        title: "Error",
        description: "There was a problem adding you to the waitlist.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-slate-50 to-stone-100 dark:from-slate-900 dark:to-stone-800">
      <Toaster />
      <header className="px-4 lg:px-6 h-16 flex items-center sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <Briefcase className="h-6 w-6 text-green-600 dark:text-green-500" />
          <span className="ml-2 text-xl font-bold text-slate-800 dark:text-slate-100">ConnectPro</span>
        </Link>
        <nav className="ml-auto flex gap-2 sm:gap-4">
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </nav>
      </header>

      <main className="flex-1 container py-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to ConnectPro!</CardTitle>
            <CardDescription>You're signed in as {user?.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isOnWaitlist ? (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500" />
                  <h3 className="font-medium text-green-800 dark:text-green-400">You're on the waitlist!</h3>
                </div>
                <p className="text-sm text-green-700 dark:text-green-500">
                  Thank you for joining our waitlist! You'll be among the first to experience ConnectPro when we launch.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  <h3 className="font-medium text-blue-800 dark:text-blue-400">Join our waitlist</h3>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-500 mb-3">
                  Get early access to ConnectPro when we launch. Join thousands of professionals already on our
                  waitlist.
                </p>
                <Button
                  onClick={handleJoinWaitlist}
                  className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Join Waitlist
                </Button>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What's Coming</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Smart Networking</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    AI-powered recommendations to connect with the right professionals in your industry.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Project Collaboration</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Find collaborators and showcase your work in our integrated project marketplace.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Skill Communities</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Join specialized communities based on your skills and interests.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Career Insights</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Get personalized insights and recommendations for your career growth.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
