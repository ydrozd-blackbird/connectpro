"use server"

import { supabaseAdmin } from "@/lib/supabase/server"
import { z } from "zod" // For validation

const WaitlistSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
})

export interface WaitlistFormState {
  message: string
  success: boolean
  errors?: {
    email?: string[]
  }
}

export async function joinWaitlist(prevState: WaitlistFormState, formData: FormData): Promise<WaitlistFormState> {
  try {
    // Get the email from form data and handle potential null values
    const emailValue = formData.get("email")

    // Debug logging (remove in production)
    console.log("Form data received:", Object.fromEntries(formData.entries()))
    console.log("Email value:", emailValue)

    // Convert to string, handling null/undefined cases
    const email = emailValue ? emailValue.toString().trim() : ""

    // Validate the email
    const validatedFields = WaitlistSchema.safeParse({ email })

    if (!validatedFields.success) {
      console.log("Validation errors:", validatedFields.error.flatten().fieldErrors)
      return {
        message: "Please enter a valid email address.",
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    // Check if email already exists
    const { data: existingEntry, error: selectError } = await supabaseAdmin
      .from("waitlist_entries")
      .select("email")
      .eq("email", validatedFields.data.email)
      .maybeSingle()

    if (selectError) {
      console.error("Error checking existing email:", selectError)
      return { message: "Server error. Please try again later.", success: false }
    }

    if (existingEntry) {
      return { message: "This email is already on the waitlist!", success: true }
    }

    // Insert new email
    const { error: insertError } = await supabaseAdmin
      .from("waitlist_entries")
      .insert({ email: validatedFields.data.email })

    if (insertError) {
      console.error("Error inserting email:", insertError)
      if (insertError.code === "23505") {
        return { message: "This email is already on the waitlist.", success: true }
      }
      return { message: "Could not add to waitlist. Please try again.", success: false }
    }

    return { message: "Successfully joined the waitlist! We'll notify you when we launch.", success: true }
  } catch (error) {
    console.error("Unexpected error in joinWaitlist:", error)
    return { message: "An unexpected error occurred. Please try again.", success: false }
  }
}
