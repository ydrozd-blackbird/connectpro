export function getBaseUrl(): string {
  // In production, use the VERCEL_URL or a custom domain
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  }

  // Fallback to a custom site URL if set
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  // For development
  if (typeof window !== "undefined") {
    return window.location.origin
  }

  // Server-side fallback for development
  return "http://localhost:3000"
}
