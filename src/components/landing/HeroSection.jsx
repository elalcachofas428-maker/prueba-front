import { Suspense, lazy, useRef, useEffect, useState, Component, useCallback } from 'react'
import gsap from 'gsap'
import { MetalButton, LiquidButton } from '../ui/FancyButtons'
import SplitText from '../ui/SplitText'
import Logo from '../Logo'

import { InteractiveRobotSpline } from '../ui/interactive-3d-robot'
import HoverLetters from '../ui/HoverLetters'
import { AnimatedText } from '../ui/AnimatedText'

/* ── TextGlowZone ──────────────────────────────────────
   Invisible container that tracks pointer position and
   applies a radial glow that clips to TEXT OUTLINES only.
   No card, no background, no border — just text glow.
   ────────────────────────────────────────────────────── */
const textGlowStyleId = 'text-glow-zone-styles'
if (typeof document !== 'undefined' && !document.getElementById(textGlowStyleId)) {
  const s = document.createElement('style')
  s.id = textGlowStyleId
  s.textContent = `
    .text-glow-zone .tgz-glow {
      --spot-size: 340px;
      --hue: calc(280 + (var(--xp, 0) * 120));
    }
    .text-glow-zone .tgz-glow,
    .text-glow-zone .tgz-glow * {
      -webkit-text-stroke: 1.5px transparent;
    }
    .text-glow-zone .tgz-glow {
      background-image:
        radial-gradient(
          var(--spot-size) var(--spot-size) at
          calc(var(--mx, 0) * 1px)
          calc(var(--my, 0) * 1px),
          hsl(var(--hue, 280) 100% 68% / 0.95),
          transparent 100%
        ),
        linear-gradient(rgba(255,255,255,0.12), rgba(255,255,255,0.12));
      -webkit-background-clip: text;
      background-clip: text;
    }
    .text-glow-zone .tgz-glow-subtle,
    .text-glow-zone .tgz-glow-subtle * {
      -webkit-text-stroke: 1px transparent;
    }
    .text-glow-zone .tgz-glow-subtle {
      background-image:
        radial-gradient(
          var(--spot-size) var(--spot-size) at
          calc(var(--mx, 0) * 1px)
          calc(var(--my, 0) * 1px),
          hsl(var(--hue, 280) 100% 68% / 0.7),
          transparent 100%
        ),
        linear-gradient(rgba(255,255,255,0.06), rgba(255,255,255,0.06));
      -webkit-background-clip: text;
      background-clip: text;
    }
  `
  document.head.appendChild(s)
}

function TextGlowZone({ children, style, className = '' }) {
  const ref = useRef(null)

  const handlePointer = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', (e.clientX - rect.left).toFixed(1))
    el.style.setProperty('--my', (e.clientY - rect.top).toFixed(1))
    el.style.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(3))
  }, [])

  useEffect(() => {
    document.addEventListener('pointermove', handlePointer)
    return () => document.removeEventListener('pointermove', handlePointer)
  }, [handlePointer])

  return (
    <div ref={ref} className={`text-glow-zone ${className}`} style={style}>
      {children}
    </div>
  )
}

/* ── inline keyframes (inyectadas una sola vez) ── */
const auroraStyleId = 'hero-aurora-keyframes'
if (typeof document !== 'undefined' && !document.getElementById(auroraStyleId)) {
  const style = document.createElement('style')
  style.id = auroraStyleId
  style.textContent = `
    @keyframes auroraFloat1 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      25%      { transform: translate(40px, -30px) scale(1.1); }
      50%      { transform: translate(-20px, 20px) scale(0.95); }
      75%      { transform: translate(30px, 40px) scale(1.05); }
    }
    @keyframes auroraFloat2 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33%      { transform: translate(-50px, 30px) scale(1.12); }
      66%      { transform: translate(30px, -40px) scale(0.92); }
    }
    @keyframes auroraFloat3 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      20%      { transform: translate(60px, 20px) scale(1.08); }
      50%      { transform: translate(-30px, -50px) scale(0.96); }
      80%      { transform: translate(20px, 30px) scale(1.04); }
    }
    @keyframes aurroraPulse {
      0%, 100% { opacity: 0.5; }
      50%      { opacity: 0.8; }
    }
    @keyframes waveDrift {
      0%   { transform: translateX(-30%) scaleY(1); }
      50%  { transform: translateX(-20%) scaleY(1.15); }
      100% { transform: translateX(-30%) scaleY(1); }
    }
  `
  document.head.appendChild(style)
}
/* ── Helper: fade-in-up block for non-text elements ── */
function HeroAnimatedBlock({ children, delay = 0 }) {
  const ref = useRef(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.set(el, { opacity: 0, y: 24 })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            delay,
          })
        }
      },
      { threshold: 0.1, rootMargin: '-50px' }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      gsap.killTweensOf(el)
    }
  }, [delay])

  return <div ref={ref}>{children}</div>
}

export default function HeroSection({ isActive, onNavigate, onSceneReady }) {
  const [animationKey, setAnimationKey] = useState(0);
  const [isFirstRun, setIsFirstRun] = useState(true);
  
  // Custom hook for landscape responsiveness + localStorage flag
  const [isMobileMode, setIsMobileMode] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-height: 500px) and (orientation: landscape)');
    const updateMode = () => {
      const isShort = mq.matches;
      const selectedDevice = localStorage.getItem('leadbook_device');
      setIsMobileMode(isShort || selectedDevice === 'mobile');
    };
    updateMode();
    mq.addEventListener('change', updateMode);
    return () => mq.removeEventListener('change', updateMode);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
      setIsFirstRun(false);
    }, 20000); // Repeat animations every 20 seconds
    return () => clearInterval(interval);
  }, []);

  // 40% faster means it takes 60% of the normal time (0.6 multiplier)
  const speedMult = isFirstRun ? 1 : 0.6;

  return (
    <section 
      style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
      background: '#000',
    }}>

      {/* ══════════════════════════════════════════
          AURORA / GLOW  BACKGROUND EFFECTS
          — sit behind everything (z-index 0)
          — positioned left-center so robot stays clean
          ══════════════════════════════════════════ */}

      {/* ── Orb 1: Violet grande, izquierda-centro ── */}
      <div style={{
        position: 'absolute',
        top: '5%',
        left: '2%',
        width: '55%',
        height: '80%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.38) 0%, rgba(96,1,209,0.18) 40%, transparent 70%)',
        filter: 'blur(60px)',
        zIndex: 0,
        pointerEvents: 'none',
        animation: 'auroraFloat1 12s ease-in-out infinite',
      }} />

      {/* ── Orb 2: Cyan, centro-izquierda ── */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '5%',
        width: '45%',
        height: '55%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.28) 0%, rgba(0,212,255,0.10) 45%, transparent 70%)',
        filter: 'blur(55px)',
        zIndex: 0,
        pointerEvents: 'none',
        animation: 'auroraFloat2 15s ease-in-out infinite',
      }} />

      {/* ── Orb 3: Violet más profundo, esquina inf-izq ── */}
      <div style={{
        position: 'absolute',
        bottom: '-5%',
        left: '5%',
        width: '50%',
        height: '60%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(96,1,209,0.32) 0%, rgba(124,58,237,0.14) 50%, transparent 70%)',
        filter: 'blur(70px)',
        zIndex: 0,
        pointerEvents: 'none',
        animation: 'auroraFloat3 18s ease-in-out infinite',
      }} />

      {/* ── Orb 4: Cyan tenue, arriba-centro ── */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '15%',
        width: '40%',
        height: '50%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.22) 0%, rgba(0,212,255,0.06) 50%, transparent 70%)',
        filter: 'blur(70px)',
        zIndex: 0,
        pointerEvents: 'none',
        animation: 'auroraFloat1 20s ease-in-out infinite reverse',
      }} />

      {/* ── Orb 5: Violet suave, derecha-centro (detrás del robot, muy difuso) ── */}
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '5%',
        width: '40%',
        height: '60%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, rgba(96,1,209,0.06) 40%, transparent 65%)',
        filter: 'blur(120px)',
        zIndex: 0,
        pointerEvents: 'none',
        animation: 'auroraFloat2 22s ease-in-out infinite reverse',
      }} />

      {/* ── Wave glow band — simula las ondas de la referencia ── */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '2%',
        width: '75%',
        height: '35%',
        background: `
          linear-gradient(
            90deg,
            transparent 0%,
            rgba(124,58,237,0.25) 15%,
            rgba(0,212,255,0.15) 45%,
            rgba(124,58,237,0.22) 75%,
            transparent 100%
          )
        `,
        filter: 'blur(35px)',
        zIndex: 0,
        pointerEvents: 'none',
        animation: 'waveDrift 10s ease-in-out infinite',
        borderRadius: '50%',
      }} />

      {/* ── Second wave band (offset) ── */}
      <div style={{
        position: 'absolute',
        top: '48%',
        left: '5%',
        width: '65%',
        height: '25%',
        background: `
          linear-gradient(
            90deg,
            transparent 0%,
            rgba(0,212,255,0.14) 25%,
            rgba(124,58,237,0.18) 55%,
            rgba(96,1,209,0.10) 80%,
            transparent 100%
          )
        `,
        filter: 'blur(40px)',
        zIndex: 0,
        pointerEvents: 'none',
        animation: 'waveDrift 14s ease-in-out infinite reverse',
        borderRadius: '50%',
      }} />

      {/* ── Subtle noise/grain texture overlay (from design system) ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.03,
        mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '128px 128px',
      }} />

      {/* ── Vignette edges — soft fade only at far edges ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: `
          radial-gradient(
            ellipse 90% 80% at 35% 50%,
            transparent 50%,
            rgba(0,0,0,0.30) 80%,
            rgba(0,0,0,0.6) 100%
          )
        `,
      }} />

      {/* ── Left edge soft fade — optimized for mobile/desktop ── */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: isMobileMode ? '14%' : '8%',
        height: '100%',
        background: isMobileMode 
          ? 'linear-gradient(to left, transparent 0%, #000 100%)' 
          : 'linear-gradient(to right, #000 0%, transparent 100%)',
        zIndex: isMobileMode ? 3 : 2,
        pointerEvents: 'none',
      }} />


      {/* ── ROBOT — flipped to left in mobile/landscape ── */}
      <div style={{
        position: 'absolute',
        top: isMobileMode ? '0%' : '-2%',
        left: isMobileMode ? '-10%' : 'auto',
        right: isMobileMode ? 'auto' : '-4%',
        width: isMobileMode ? '55%' : '60%',
        height: isMobileMode ? '105%' : '120%',
        zIndex: 1,
        mixBlendMode: 'screen',
        transform: isMobileMode ? 'scaleX(-1)' : 'none', // Flip the robot too? Optional, looks good.
      }}>
        <InteractiveRobotSpline
          scene="https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode"
          className="absolute inset-0 z-0 h-full w-full"
        />
      </div>

      {/* ── Right overlay — optimized for mobile/desktop ── */}
      {!isMobileMode && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '14%',
          height: '100%',
          background: 'linear-gradient(to right, transparent 0%, #000 100%)',
          zIndex: 3,
          pointerEvents: 'none',
        }} />
      )}

      {/* ── OVERLAY INFERIOR — gradiente suave que no corta el glow ── */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '55%',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.85) 70%, #000 100%)',
        zIndex: 3,
        pointerEvents: 'none',
      }} />

      {/* Watermark tapado - absoluto dentro del hero, no fixed */}
      <div style={{
        position: 'absolute',
        bottom: 0, right: 0,
        width: '220px', height: '52px',
        background: 'inherit',
        zIndex: 5,
        pointerEvents: 'none',
      }} />

      {/* ── TEXTO — flipped to right in mobile/landscape ── */}
      <TextGlowZone key={animationKey} style={{
        position: 'absolute',
        top: isMobileMode ? '5%' : '10%', 
        left: isMobileMode ? '45%' : '4%',
        height: isMobileMode ? '100%' : '80%',
        width: isMobileMode ? '52%' : '54%',
        zIndex: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: isMobileMode ? '1.5rem 3rem 1.5rem 1rem' : '3rem',
        gap: isMobileMode ? '0.6rem' : '1.5rem',
      }}>

        {/* Nombre de marca — Shiny animated gradient */}
        <HeroAnimatedBlock delay={0.1 * speedMult}>
          <div className="animated-shiny-text">
            <HoverLetters tag="div" style={{
              fontSize: isMobileMode ? '1.8rem' : 'clamp(2.8rem, 5vw, 4.5rem)',
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}>LeadBook</HoverLetters>
          </div>
        </HeroAnimatedBlock>

        {/* Título principal — Shiny animated gradient */}
        <HeroAnimatedBlock delay={0.4 * speedMult}>
          <h1 className="animated-shiny-text" style={{
            fontSize: isMobileMode ? '1.6rem' : 'clamp(2.4rem, 4.5vw, 4rem)',
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.04em',
            margin: 0,
          }}>
            <HoverLetters tag="span">Convertí cualquier producto en </HoverLetters>
            <HoverLetters tag="span">contenido que atrae clientes</HoverLetters>
          </h1>
        </HeroAnimatedBlock>

        {/* Subtítulo — glow sutil en contorno */}
        <div className="tgz-glow-subtle">
          <SplitText
            text="Automatizá tu marketing con IA. Crea materiales premium en segundos, sin complicaciones."
            tag="p"
            hoverJump
            splitType="words"
            delay={30 * speedMult}
            duration={0.5 * speedMult}
            ease="power3.out"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            startDelay={1.1 * speedMult}
            threshold={0.1}
            rootMargin="-50px"
            style={{
              fontSize: isMobileMode ? '0.75rem' : '1rem',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: isMobileMode ? 1.3 : 1.7,
              margin: 0,
              maxWidth: isMobileMode ? '100%' : '420px',
              fontFamily: 'DM Sans, sans-serif',
            }}
          />
        </div>

        {/* Botones — fade in con GSAP */}
        <HeroAnimatedBlock delay={1.5 * speedMult}>
          <div style={{ 
            display: 'flex', 
            gap: isMobileMode ? '0.5rem' : '1rem', 
            flexWrap: 'wrap', 
            alignItems: 'center',
            transform: isMobileMode ? 'scale(0.8)' : 'none',
            transformOrigin: 'left center'
          }}>
            <MetalButton href="/register" variant="gradient">
              Empezar gratis
            </MetalButton>
            <LiquidButton onClick={() => onNavigate?.('como-funciona')}>
              Ver cómo funciona
            </LiquidButton>
          </div>
        </HeroAnimatedBlock>

        {/* Social proof — glow sutil en contorno */}
        <div className="tgz-glow-subtle">
          <HeroAnimatedBlock delay={1.9 * speedMult}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: isMobileMode ? '6px' : '12px',
              transform: isMobileMode ? 'scale(0.8)' : 'none',
              transformOrigin: 'left center'
            }}>
              <div style={{ display: 'flex' }}>
                {['A','M','C','S'].map((l, i) => (
                  <div key={i} style={{
                    width: isMobileMode ? '22px' : '30px', 
                    height: isMobileMode ? '22px' : '30px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1f2937, #111827)',
                    border: '2px solid #000',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isMobileMode ? '0.5rem' : '0.65rem', 
                    fontWeight: 700,
                    color: '#00D4FF',
                    marginLeft: i > 0 ? '-8px' : '0',
                  }}>{l}</div>
                ))}
              </div>
              <div>
                <HoverLetters tag="p" style={{
                  fontSize: isMobileMode ? '0.55rem' : '0.7rem', 
                  color: 'rgba(255,255,255,0.4)',
                  margin: 0, textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontFamily: 'Manrope, sans-serif',
                }}>+500 negocios confían en nosotros</HoverLetters>
              </div>
            </div>
          </HeroAnimatedBlock>
        </div>

      </TextGlowZone>
    </section>
  )
}
