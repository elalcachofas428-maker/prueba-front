import { useEffect, useRef } from 'react'

/**
 * SpotlightText — wraps children in a container that tracks the cursor
 * and overlays a radial glow that illuminates text contours via
 * mix-blend-mode. No card, no box — just a light that follows the mouse
 * and makes the text edges glow.
 */
export default function SpotlightText({
  children,
  glowColor = 'mixed',
  spotSize = 400,
  intensity = 0.9,
  className = '',
  style = {},
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      el.style.setProperty('--spot-x', `${x}px`)
      el.style.setProperty('--spot-y', `${y}px`)
    }

    document.addEventListener('pointermove', onMove)
    return () => document.removeEventListener('pointermove', onMove)
  }, [])

  const buildGradient = (opacity) => {
    if (glowColor === 'mixed') {
      return `radial-gradient(
        ${spotSize}px ${spotSize}px at var(--spot-x, -999px) var(--spot-y, -999px),
        rgba(0,212,255,${opacity}) 0%,
        rgba(124,58,237,${opacity * 0.6}) 35%,
        transparent 65%
      )`
    }
    const colors = {
      cyan:   [`rgba(0,212,255,${opacity})`, `rgba(0,180,220,${opacity * 0.4})`],
      purple: [`rgba(124,58,237,${opacity})`, `rgba(100,40,200,${opacity * 0.4})`],
    }
    const [c1, c2] = colors[glowColor] || colors.cyan
    return `radial-gradient(
      ${spotSize}px ${spotSize}px at var(--spot-x, -999px) var(--spot-y, -999px),
      ${c1} 0%, ${c2} 40%, transparent 65%
    )`
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: 'relative',
        ...style,
      }}
    >
      {/* Actual content */}
      {children}

      {/* Spotlight overlay — screen blend makes it brighten/glow
          whatever is underneath (text, icons, etc.) without
          creating any visible box shape on the dark background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          pointerEvents: 'none',
          background: buildGradient(intensity),
          mixBlendMode: 'screen',
          borderRadius: 'inherit',
        }}
      />

      {/* Softer halo layer — adds a diffused glow behind */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '-30px',
          zIndex: 0,
          pointerEvents: 'none',
          background: buildGradient(intensity * 0.15),
          filter: 'blur(40px)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  )
}
