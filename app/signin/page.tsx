"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Briefcase, ArrowLeft } from 'lucide-react'
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Use NEXT_PUBLIC_SITE_URL directly for the redirect URL
      const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`

      console.log("=== SIGN IN DEBUG ===")
      console.log("SITE_URL:", process.env.NEXT_PUBLIC_SITE_URL)
      console.log("Redirect URL:", redirectUrl)
      console.log("===================")

      // Send magic link to any email address
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: redirectUrl,
          // This will create a new user if they don't exist
          shouldCreateUser: true,
        },
      })

      if (error) {
        throw error
      }

      toast({
        title: "Check your email",
        description: "We've sent you a magic link to sign in.",
      })

      // Redirect to check email page
      router.push("/signin/check-email")
    } catch (error) {
      console.error("Sign in error:", error)
      toast({
        title: "Error",
        description: "There was a problem sending the magic link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-slate-50 to-stone-100 dark:from-slate-900 dark:to-stone-800">
      <Toaster />
      <div className="container flex flex-col items-center justify-center min-h-screen py-12 mx-auto">
        <Link
          href="/"
          className="absolute top-8 left-8 flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>

        <div className="flex items-center mb-8">
          <Briefcase className="h-8 w-8 text-green-600 dark:text-green-500 mr-2" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">ConnectPro</h1>
        </div>

        <Card className="w-full max-w-md shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <CardDescription>Enter your email to receive a magic link</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white dark:bg-slate-700"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600 dark:text-slate-900"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Magic Link"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-center text-sm text-slate-600 dark:text-slate-400">
            <p>
              New to ConnectPro?{" "}
              <Link href="/#auth-form" className="text-green-600 hover:underline dark:text-green-500">
                Join the waitlist
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
