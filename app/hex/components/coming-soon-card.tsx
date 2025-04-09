import { Clock, CalendarClock } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ComingSoonCard(){
  return (
    <div className="container py-12 flex flex-col items-center justify-center">
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cosmic-accent/20 to-cosmic-highlight/20 flex items-center justify-center mb-6">
        <CalendarClock className="h-10 w-10 text-cosmic-accent" />
      </div>

      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cosmic-accent to-cosmic-highlight mb-4 text-center">
        Coming Soon
      </h1>

      <p className="text-cosmic-muted max-w-md text-center mb-8">
        We're working hard to bring you this exciting new feature. Stay tuned for updates!
      </p>

      <Card className="max-w-md w-full border border-cosmic-accent/20 bg-cosmic-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-cosmic-text text-center">Get Notified</CardTitle>
          <CardDescription className="text-cosmic-muted text-center">
            We'll let you know when this feature is available
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="flex items-center gap-2 text-cosmic-muted">
            <Clock className="h-5 w-5 text-cosmic-accent" />
            <span>Estimated launch: 2 weeks</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button className="bg-gradient-to-r from-cosmic-accent to-cosmic-highlight hover:from-cosmic-accent hover:to-cosmic-highlight text-cosmic-text">
            Notify Me
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
