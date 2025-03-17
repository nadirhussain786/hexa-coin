interface AdPlaceholderProps {
  width: string
  height: string
  text?: string
}

export default function AdPlaceholder({ width, height, text = "Advertisement" }: AdPlaceholderProps) {
  return (
    <div
      className="bg-cosmic-card/30 border border-cosmic-accent/10 rounded-lg flex items-center justify-center"
      style={{ width, height }}
    >
      <div className="text-center p-4">
        <div className="text-cosmic-muted text-sm font-medium">{text}</div>
        <div className="text-xs text-cosmic-muted/60 mt-1">Google Ad will appear here</div>
      </div>
    </div>
  )
}

