"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Briefcase, Mail, ArrowLeft } from "lucide-react"

export default function CheckEmailPage() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-gradient-to-br from-slate-50 to-stone-100 dark:from-slate-900 dark:to-stone-800">
      <div className="container flex flex-col items-center justify-center min-h-screen py-12 mx-auto">
        <Link
          href="/signin"
          className="absolute top-8 left-8 flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to sign in
        </Link>

        <div className="flex items-center mb-8">
          <Briefcase className="h-8 w-8 text-green-600 dark:text-green-500 mr-2" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">ConnectPro</h1>
        </div>

        <Card className="w-full max-w-md shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto my-4 bg-green-100 dark:bg-green-900/30 p-3 rounded-full w-16 h-16 flex items-center justify-center">
              <Mail className="h-8 w-8 text-green-600 dark:text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
            <CardDescription>We've sent you a magic link to sign in to your account.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Click the link in the email to sign in. If you don't see it, check your spam folder.
            </p>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
              <p className="text-xs text-blue-700 dark:text-blue-400">
                <strong>Note:</strong> The magic link will redirect you back to this application, not to localhost.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/signin">Back to sign in</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
