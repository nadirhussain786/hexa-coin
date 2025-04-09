import type { JSX } from "react"

interface AdPlaceholderProps {
  width?: string
  height?: string
  text?: string
  className?: string
}

export default function AdPlaceholder({
  width = "100%",
  height = "auto",
  text = "Advertisement",
  className = "",
}: AdPlaceholderProps): JSX.Element {
  return (
    <div
      className={`flex items-center justify-center border border-cosmic-accent/10 bg-cosmic-card/30 rounded-lg overflow-hidden shadow-inner ${className}`}
      style={{
        width,
        height: height === "auto" ? "auto" : height,
        minHeight: height === "auto" ? "100px" : "auto",
      }}
    >
      <div className="text-center p-4">
        <p className="text-xs text-cosmic-muted uppercase tracking-wider mb-2">{text}</p>
        <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-cosmic-accent/20 to-cosmic-highlight/20 flex items-center justify-center">
          <span className="text-cosmic-accent/50 text-xs">AD</span>
        </div>
      </div>
    </div>
  )
}
