"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function AuthCallbackPage() {
  const router = useRouter()
  // Initialize Supabase client. It will automatically look for session info in the URL fragment.
  const supabase = getSupabaseBrowserClient()
  const [message, setMessage] = useState("Processing authentication...")
  const [errorOccurred, setErrorOccurred] = useState(false) // To prevent multiple error toasts/redirects

  useEffect(() => {
    // This effect should run only once when the component mounts.
    let subscribed = true // Flag to prevent updates if component unmounts early
    let timeoutId: NodeJS.Timeout | null = null

    // onAuthStateChange listens for when Supabase client processes the URL fragment
    // and establishes a session.
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!subscribed) return // Don't do anything if the component has unmounted

      console.log("AuthCallbackPage - Auth event:", event, "Session exists:", !!session)

      if (event === "SIGNED_IN" && session) {
        toast({
          title: "Signed In",
          description: "You have been successfully signed in. Redirecting...",
        })
        // Successfully signed in, session is established.
        router.replace("/dashboard") // Use replace to avoid this page in browser history
      } else if (event === "INITIAL_SESSION" && session) {
        // This event might fire if a session already exists (e.g., user is already logged in and hits callback)
        // Or if Supabase client initializes with a session from the fragment.
        console.log("AuthCallbackPage - Initial session found, redirecting.")
        router.replace("/dashboard")
      }
      // Other events like TOKEN_REFRESHED, USER_UPDATED, PASSWORD_RECOVERY can be handled if needed.
      // SIGNED_OUT event on this page might indicate an issue or expired token from fragment.
      else if (event === "SIGNED_OUT" && !session && !errorOccurred) {
        console.log("AuthCallbackPage - Received SIGNED_OUT event.")
        setMessage("Your session may have expired or is invalid. Please try signing in again.")
        toast({
          title: "Session Error",
          description: "Please try signing in again.",
          variant: "destructive",
        })
        setErrorOccurred(true)
        router.replace("/signin")
      }
    })

    // Fallback timeout: If no SIGNED_IN event occurs after a reasonable period,
    // assume something went wrong with processing the fragment or the fragment was invalid/missing.
    timeoutId = setTimeout(() => {
      if (subscribed && !errorOccurred) {
        // Check errorOccurred to avoid overriding an existing error message
        // Check current session status directly as a last resort
        supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
          if (!currentSession && subscribed) {
            // Check subscribed again in async callback
            console.log("AuthCallbackPage - Authentication timeout, no session established.")
            setMessage("Authentication timed out. Please try signing in again.")
            toast({
              title: "Authentication Timeout",
              description: "Please try signing in again.",
              variant: "destructive",
            })
            setErrorOccurred(true)
            router.replace("/signin")
          } else if (currentSession && subscribed) {
            // If a session exists but the event wasn't caught or page didn't redirect.
            console.log("AuthCallbackPage - Timeout: Session exists, ensuring redirect.")
            router.replace("/dashboard")
          }
        })
      }
    }, 7000) // 7 seconds timeout

    // Cleanup function: Unsubscribe the listener and clear timeout when the component unmounts.
    return () => {
      subscribed = false
      authListener?.unsubscribe()
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array ensures this effect runs only once on mount.

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 dark:from-slate-900 dark:to-stone-800 text-slate-900 dark:text-slate-50">
      <Toaster />
      <div className="flex flex-col items-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
        <Loader2 className="w-12 h-12 mb-4 text-green-600 dark:text-green-500 animate-spin" />
        <p className="text-lg font-medium">{message}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Please wait while we securely sign you in.</p>
      </div>
    </div>
  )
}
