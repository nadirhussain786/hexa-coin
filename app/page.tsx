import { Suspense } from "react"
import LoadingSpinner from "./components/LoadingSpinner"
import HomePage from "./components/HomePage"
import { HexDashboardComponent } from "../components/HexDashboardComponent"

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HexDashboardComponent />
    </Suspense>
  )
}
  