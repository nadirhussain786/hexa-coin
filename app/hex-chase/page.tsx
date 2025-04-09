import React, { Suspense } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import HexChasePage from './components/HexChasePage'

const page = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
    <HexChasePage />
  </Suspense>
  )
}

export default page
