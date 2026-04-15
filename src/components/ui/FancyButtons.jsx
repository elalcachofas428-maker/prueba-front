import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

/* ═══════════════════════════════════════════════
   COLOR VARIANTS — adapted to LeadBook palette
   ═══════════════════════════════════════════════ */
const metalColors = {
  cyan: {
    outer:  'linear-gradient(to bottom, #002A35, #00D4FF)',
    inner:  'linear-gradient(to bottom, #B0F5FF, #003540, #A0EEFF)',
    button: 'linear-gradient(to bottom, #00D4FF, #009ABB)',
    textShadow: '0 -1px 0 rgba(0, 60, 80, 1)',
    glowShadow: '0 4px 20px rgba(0, 212, 255, 0.35)',
    restShadow: '0 3px 12px rgba(0, 212, 255, 0.18)',
    pressedShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
  },
  violet: {
    outer:  'linear-gradient(to bottom, #1A0040, #7C3AED)',
    inner:  'linear-gradient(to bottom, #D4BBFF, #2D0066, #C4A8FF)',
    button: 'linear-gradient(to bottom, #7C3AED, #5B21B6)',
    textShadow: '0 -1px 0 rgba(40, 10, 100, 1)',
    glowShadow: '0 4px 20px rgba(124, 58, 237, 0.35)',
    restShadow: '0 3px 12px rgba(124, 58, 237, 0.18)',
    pressedShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
  },
  gradient: {
    outer:  'linear-gradient(135deg, #002A35, #3D1070)',
    inner:  'linear-gradient(135deg, #A0EEFF, #0A0E1A, #C4A8FF)',
    button: 'linear-gradient(135deg, #00D4FF, #7C3AED)',
    textShadow: '0 -1px 0 rgba(10, 30, 60, 1)',
    glowShadow: '0 4px 24px rgba(0, 212, 255, 0.30)',
    restShadow: '0 3px 14px rgba(0, 180, 220, 0.18)',
    pressedShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
  },
}

/* ═══════════════════════════════════════════════
   MetalButton
   Multi-layer metallic button with realistic 3D
   gradient layers + hover/press states.
   Pass `href` to render as <Link>, else <button>.
   ═══════════════════════════════════════════════ */
export function MetalButton({
  children,
  onClick,
  href,
  variant = 'gradient',
  style = {},
  ...rest
}) {
  const [isPressed, setIsPressed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const c = metalColors[variant] || metalColors.gradient
  const ease = 'all 250ms cubic-bezier(0.1, 0.4, 0.2, 1)'

  const Comp = href ? Link : 'button'
  const compProps = href ? { to: href } : {}

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        borderRadius: '10px',
        padding: '1.25px',
        background: c.outer,
        transform: isPressed
          ? 'translateY(2.5px) scale(0.99)'
          : 'translateY(0) scale(1)',
        boxShadow: isPressed
          ? c.pressedShadow
          : isHovered && !isTouch
            ? c.glowShadow
            : c.restShadow,
        transition: ease,
        transformOrigin: 'center center',
        willChange: 'transform',
        ...style,
      }}
    >
      {/* Inner metallic reflection layer */}
      <div style={{
        position: 'absolute',
        inset: '1px',
        borderRadius: '11px',
        background: c.inner,
        transition: ease,
        filter: isHovered && !isPressed && !isTouch
          ? 'brightness(1.08)' : 'none',
        pointerEvents: 'none',
      }} />

      {/* Button / Link surface */}
      <Comp
        {...compProps}
        onClick={onClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => { setIsPressed(false); setIsHovered(false) }}
        onMouseEnter={() => { if (!isTouch) setIsHovered(true) }}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        onTouchCancel={() => setIsPressed(false)}
        style={{
          position: 'relative',
          zIndex: 10,
          margin: '1px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '44px',
          padding: '0 28px',
          borderRadius: '8px',
          border: 'none',
          background: c.button,
          color: '#FFFFFF',
          textShadow: c.textShadow,
          fontSize: '0.8rem',
          fontWeight: 700,
          fontFamily: 'Manrope, sans-serif',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          cursor: 'pointer',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          transform: isPressed ? 'scale(0.97)' : 'scale(1)',
          transition: ease,
          filter: isHovered && !isPressed && !isTouch
            ? 'brightness(1.04)' : 'none',
          outline: 'none',
        }}
        {...rest}
      >
        {/* Shine flash on press */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          overflow: 'hidden',
          borderRadius: '8px',
          opacity: isPressed ? 0.25 : 0,
          transition: 'opacity 300ms ease',
          pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)',
          }} />
        </div>

        {/* Hover top-light glow */}
        {isHovered && !isPressed && !isTouch && (
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '8px',
            background: 'linear-gradient(to top, transparent, rgba(255,255,255,0.07))',
            pointerEvents: 'none',
          }} />
        )}

        {children}
      </Comp>
    </div>
  )
}


/* ═══════════════════════════════════════════════
   LiquidButton
   Glass / liquid bubble button with complex
   inset shadows + SVG displacement filter.
   ═══════════════════════════════════════════════ */
export function LiquidButton({
  children,
  onClick,
  style = {},
  ...rest
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false) }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onTouchCancel={() => setIsPressed(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        height: '46px',
        padding: '0 28px',
        borderRadius: '9999px',
        border: 'none',
        background: 'transparent',
        color: 'white',
        fontSize: '0.8rem',
        fontWeight: 600,
        fontFamily: 'Manrope, sans-serif',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transform: isPressed
          ? 'scale(0.97)'
          : isHovered
            ? 'scale(1.04)'
            : 'scale(1)',
        transition: 'transform 300ms cubic-bezier(0.1, 0.4, 0.2, 1)',
        outline: 'none',
        ...style,
      }}
      {...rest}
    >
      {/* Glass shadow overlay — creates the liquid bubble effect */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '9999px',
        boxShadow: [
          '0 0 8px rgba(0,0,0,0.03)',
          '0 2px 6px rgba(0,0,0,0.08)',
          'inset 3px 3px 0.5px -3.5px rgba(255,255,255,0.09)',
          'inset -3px -3px 0.5px -3.5px rgba(255,255,255,0.85)',
          'inset 1px 1px 1px -0.5px rgba(255,255,255,0.6)',
          'inset -1px -1px 1px -0.5px rgba(255,255,255,0.6)',
          'inset 0 0 6px 6px rgba(255,255,255,0.12)',
          'inset 0 0 2px 2px rgba(255,255,255,0.06)',
          '0 0 12px rgba(0,0,0,0.15)',
        ].join(', '),
        pointerEvents: 'none',
        transition: 'all 250ms ease',
      }} />

      {/* Glass distortion backdrop (SVG filter) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        borderRadius: '9999px',
        zIndex: -1,
        isolation: 'isolate',
        backdropFilter: 'url("#leadbook-glass-filter")',
        WebkitBackdropFilter: 'url("#leadbook-glass-filter")',
      }} />

      {/* Content */}
      <span style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
        {children}
      </span>

      {/* SVG Glass Filter Definition */}
      <GlassFilter />
    </button>
  )
}


/* ═══════════════════════════════════════════════
   GlassFilter SVG
   Hidden SVG providing the glass distortion
   filter used by LiquidButton's backdrop.
   ═══════════════════════════════════════════════ */
function GlassFilter() {
  return (
    <svg
      style={{
        position: 'absolute',
        width: 0,
        height: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <defs>
        <filter
          id="leadbook-glass-filter"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />
          <feGaussianBlur
            in="turbulence"
            stdDeviation="2"
            result="blurredNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur
            in="displaced"
            stdDeviation="4"
            result="finalBlur"
          />
          <feComposite
            in="finalBlur"
            in2="finalBlur"
            operator="over"
          />
        </filter>
      </defs>
    </svg>
  )
}
