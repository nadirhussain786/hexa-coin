import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

interface AdDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  adLoading: boolean
}

export function AdDialog({ open, onOpenChange, adLoading }: AdDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="shadow-xl max-w-sm mx-auto bg-cosmic-card border-cosmic-accent/20">
        <div className="flex flex-col items-center justify-center py-6">
          {adLoading ? (
            <>
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cosmic-accent to-cosmic-highlight flex items-center justify-center mb-6 animate-pulse">
                <span className="text-2xl font-bold text-cosmic-text">Ad</span>
              </div>
              <DialogTitle className="text-xl text-center mb-2">Loading Advertisement...</DialogTitle>
              <DialogDescription className="text-cosmic-muted text-center max-w-xs">
                Please wait while we load your advertisement.
              </DialogDescription>
            </>
          ) : (
            <>
              <div className="w-full h-40 bg-cosmic-bg rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight">
                    Advertisement
                  </span>
                  <p className="text-cosmic-muted mt-2">This is a simulated advertisement</p>
                </div>
              </div>
              <DialogDescription className="text-cosmic-muted text-center max-w-xs">
                Watch this ad to earn progress toward opening a hexagon. You need to watch 10 ads to open one hexagon
                for free.
              </DialogDescription>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
