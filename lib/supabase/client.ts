"use client"

import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// These environment variables are exposed to the browser
// They must be prefixed with NEXT_PUBLIC_
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_URL")
}

if (!supabaseAnonKey) {
  throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

// Create a singleton instance for client-side usage
let clientInstance: ReturnType<typeof createClientInstance> | null = null

function createClientInstance() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })
}

export function getSupabaseBrowserClient() {
  if (!clientInstance) {
    clientInstance = createClientInstance()
  }
  return clientInstance
}
