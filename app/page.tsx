import { Suspense } from "react"
import LoadingSpinner from "./components/LoadingSpinner"
import HomePage from "./components/HomePage"

export default function Home() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HomePage />
    </Suspense>
  )
}
  