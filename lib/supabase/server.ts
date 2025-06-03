import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types" // We'll generate this later if needed, for now, it's a placeholder

// Ensure these environment variables are set in your Vercel project
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_URL")
}

if (!supabaseServiceRoleKey) {
  throw new Error("Missing environment variable SUPABASE_SERVICE_ROLE_KEY")
}

// Note: supabaseServiceRoleKey should NEVER be exposed to the client.
// This server client is intended for use in Server Actions and Route Handlers.
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    // It's generally recommended to disable auto-refreshing sessions for server-side clients
    // as they are typically used for one-off operations.
    autoRefreshToken: false,
    persistSession: false,
  },
})
