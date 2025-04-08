import type { JSX } from "react"

export default function LoadingSpinner(): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-screen bg-cosmic-bg">
      <div className="w-16 h-16 rounded-full border-4 border-cosmic-accent/20 border-t-cosmic-accent animate-spin"></div>
    </div>
  )
}
