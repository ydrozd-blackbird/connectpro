"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Briefcase, Users, Zap, Lightbulb } from "lucide-react"
import { useActionState, useEffect, useRef } from "react"
import { joinWaitlist, type WaitlistFormState } from "@/app/actions/waitlist-actions"
import { toast } from "@/components/ui/use-toast" // Assuming you have use-toast from shadcn/ui
import { Toaster } from "@/components/ui/toaster" // And the Toaster component
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function ConnectProLandingPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const initialState: WaitlistFormState = { message: "", success: false }
  const [state, formAction, isPending] = useActionState(joinWaitlist, initialState)

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: "Success!",
          description: state.message,
        })
        formRef.current?.reset() // Reset form on success
      } else {
        toast({
          title: "Error",
          description: state.message || "An unexpected error occurred.",
          variant: "destructive",
        })
      }
    }
  }, [state])

  useEffect(() => {
    // Check if we're on the homepage with an auth fragment
    if (typeof window !== "undefined" && window.location.hash.includes("access_token")) {
      console.log("Auth fragment detected on homepage, processing...")
      const supabase = getSupabaseBrowserClient()

      // Set up a one-time listener for auth state change
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session) {
          console.log("Successfully signed in from homepage, redirecting to dashboard")
          window.location.href = "/dashboard"
        }
      })

      // Cleanup
      return () => {
        authListener?.unsubscribe()
      }
    }
  }, [])

  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-slate-50 to-stone-100 dark:from-slate-900 dark:to-stone-800 text-slate-900 dark:text-slate-50">
      <Toaster />
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <Briefcase className="h-6 w-6 text-green-600 dark:text-green-500" />
          <span className="ml-2 text-xl font-bold text-slate-800 dark:text-slate-100">ConnectPro</span>
        </Link>
        <nav className="ml-auto flex gap-2 sm:gap-4">
          <Button
            variant="ghost"
            asChild
            className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Link href="/signin" prefetch={false}>
              Sign In
            </Link>
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600 dark:text-slate-900"
            asChild
          >
            <Link href="#auth-form" prefetch={false}>
              Sign Up
            </Link>
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40" id="hero">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_minmax(auto,550px)] lg:gap-12 xl:gap-16 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-teal-500 to-emerald-600 dark:from-green-400 dark:via-teal-400 dark:to-emerald-500 py-2">
                  The Future of Professional Networking is Here.
                </h1>
                <p className="max-w-[600px] text-slate-600 md:text-xl dark:text-slate-400">
                  ConnectPro is revolutionizing how professionals connect, collaborate, and grow. Be the first to
                  experience a smarter, more intuitive professional network.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center space-y-6">
                <img
                  src="/placeholder.svg?width=500&height=300"
                  width="500"
                  height="300"
                  alt="Abstract representation of professional network connections"
                  className="mx-auto aspect-[16/9] overflow-hidden rounded-xl object-cover shadow-lg"
                />
                <div id="auth-form" className="w-full max-w-md mx-auto">
                  <Card className="shadow-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        Join the Waitlist!
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">
                        Get exclusive early access to ConnectPro.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <form ref={formRef} action={formAction} className="space-y-4">
                        <div>
                          <label htmlFor="email" className="sr-only">
                            Email
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 dark:text-white focus:ring-green-500"
                          />
                          {state?.errors?.email && (
                            <p className="text-xs text-red-500 dark:text-red-400 mt-1">{state.errors.email[0]}</p>
                          )}
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600 dark:text-slate-900"
                          disabled={isPending}
                          aria-disabled={isPending}
                        >
                          {isPending ? "Submitting..." : "Get Early Access"}
                        </Button>
                      </form>
                    </CardContent>
                    <CardFooter className="text-center text-xs text-slate-500 dark:text-slate-400 pt-4">
                      <p>We're building something amazing. Sign up to be notified!</p>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Teaser Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-slate-100 dark:bg-slate-800/60" id="features">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/50 dark:text-green-300">
                  Why ConnectPro?
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-800 dark:text-slate-100">
                  Elevate Your Professional Journey
                </h2>
                <p className="max-w-[900px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-slate-400">
                  Discover features designed to help you thrive in your career and industry.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-8 py-12">
              {[
                {
                  icon: <Users className="h-8 w-8 text-green-600 dark:text-green-500" />,
                  title: "Intelligent Connections",
                  description: "AI-powered recommendations to find the right people and opportunities.",
                },
                {
                  icon: <Zap className="h-8 w-8 text-green-600 dark:text-green-500" />,
                  title: "Dynamic Skill Hubs",
                  description: "Join communities focused on specific skills and industries to learn and share.",
                },
                {
                  icon: <Lightbulb className="h-8 w-8 text-green-600 dark:text-green-500" />,
                  title: "Project Marketplace",
                  description: "Discover freelance projects or find collaborators for your next big idea.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="grid gap-2 p-6 rounded-xl hover:shadow-xl transition-shadow bg-white dark:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  {feature.icon}
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{feature.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 border-t border-slate-200 dark:border-slate-800">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight text-slate-800 dark:text-slate-100">
                Ready to Redefine Your Network?
              </h2>
              <p className="mx-auto max-w-[600px] text-slate-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-slate-400">
                Don't miss out. Join the ConnectPro waitlist today and be part of the next wave in professional
                networking.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Button
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600 dark:text-slate-900"
                asChild
              >
                <Link href="#auth-form" prefetch={false}>
                  Sign Up for Early Access
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          &copy; {new Date().getFullYear()} ConnectPro. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4 text-slate-600 dark:text-slate-300"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4 text-slate-600 dark:text-slate-300"
            prefetch={false}
          >
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
