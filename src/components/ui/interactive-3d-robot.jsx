import { lazy, Suspense } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

export function InteractiveRobotSpline({ scene, className }) {
  return (
    <Suspense fallback={null}>
      <Spline
        scene={scene}
        className={className}
        style={{ width: '100%', height: '100%' }}
      />
    </Suspense>
  )
}
