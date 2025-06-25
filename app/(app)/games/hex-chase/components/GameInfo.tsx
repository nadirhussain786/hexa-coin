import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface GameInfoProps {
  hexagonCount: number
}

export function GameInfo({ hexagonCount }: GameInfoProps) {
  return (
    <>
      <Alert className="mb-6 border border-cosmic-secondary/30 shadow-lg bg-cosmic-card/50">
        <AlertCircle className="h-4 w-4 text-cosmic-secondary" />
        <AlertTitle className="text-cosmic-text">Opening costs 0.2 TON</AlertTitle>
        <AlertDescription className="text-cosmic-muted">
          Each hexagon costs 0.2 TON to open. Click on a hexagon to reveal your reward!
        </AlertDescription>
      </Alert>

      <div className="text-center mb-2 text-cosmic-muted text-sm">
        <span className="font-semibold text-cosmic-text">{hexagonCount}</span> hexagons in one big hexagon
      </div>
    </>
  )
}
