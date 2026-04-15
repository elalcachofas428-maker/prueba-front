import { Suspense, lazy, useRef, useEffect, useState, Component } from 'react'
import gsap from 'gsap'
import { MetalButton, LiquidButton } from '../ui/FancyButtons'
import SplitText from '../ui/SplitText'
import Logo from '../Logo'

import { InteractiveRobotSpline } from '../ui/interactive-3d-robot'

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

      {/* ── Left edge soft fade — prevents hard clip on the left ── */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '8%',
        height: '100%',
        background: 'linear-gradient(to right, #000 0%, transparent 100%)',
        zIndex: 2,
        pointerEvents: 'none',
      }} />


      {/* ── ROBOT — sin máscara, renderiza completo y limpio ── */}
      <div style={{
        position: 'absolute',
        top: '-2%',
        right: '-4%',
        width: '60%',
        height: '120%',
        zIndex: 1,
        mixBlendMode: 'screen',
      }}>
        <InteractiveRobotSpline
          scene="https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode"
          className="absolute inset-0 z-0 h-full w-full"
        />
      </div>

      {/* ── OVERLAY DERECHO — pinta #000 sobre el borde crudo del canvas ── */}
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

      {/* ── TEXTO ── */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        height: '100%',
        width: '55%',
        zIndex: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 0 0 5rem',
        gap: '1.5rem',
      }}>

        {/* Nombre de marca */}
        <HeroAnimatedBlock delay={0.1}>
          <div style={{
            fontSize: 'clamp(2.8rem, 5vw, 4.5rem)',
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}>LeadBook</div>
        </HeroAnimatedBlock>

        {/* Título — dos SplitText secuenciales */}
        <h1 style={{
          fontSize: 'clamp(2.4rem, 4.5vw, 4rem)',
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          lineHeight: 1.12,
          letterSpacing: '-0.04em',
          margin: 0,
          color: 'white',
        }}>
          <SplitText
            text="Convertí cualquier producto en "
            tag="span"
            splitType="chars"
            delay={25}
            duration={0.6}
            ease="power3.out"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            startDelay={0.2}
            threshold={0.1}
            rootMargin="-50px"
          />
          <SplitText
            text="contenido que atrae clientes"
            tag="span"
            splitType="words"
            delay={80}
            duration={0.8}
            ease="power3.out"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            startDelay={0.7}
            threshold={0.1}
            rootMargin="-50px"
            letterStyle={{
              background: 'linear-gradient(135deg, #00D4FF 0%, #7C3AED 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          />
        </h1>

        {/* Subtítulo */}
        <SplitText
          text="Automatizá tu marketing con IA. Crea materiales premium en segundos, sin complicaciones."
          tag="p"
          splitType="words"
          delay={30}
          duration={0.5}
          ease="power3.out"
          from={{ opacity: 0, y: 20 }}
          to={{ opacity: 1, y: 0 }}
          startDelay={1.1}
          threshold={0.1}
          rootMargin="-50px"
          style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.7,
            margin: 0,
            maxWidth: '420px',
            fontFamily: 'DM Sans, sans-serif',
          }}
        />

        {/* Botones — fade in con GSAP */}
        <HeroAnimatedBlock delay={1.5}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <MetalButton href="/register" variant="gradient">
              Empezar gratis
            </MetalButton>
            <LiquidButton onClick={() => onNavigate?.('como-funciona')}>
              Ver cómo funciona
            </LiquidButton>
          </div>
        </HeroAnimatedBlock>

        {/* Social proof — fade in con GSAP */}
        <HeroAnimatedBlock delay={1.9}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex' }}>
              {['A','M','C','S'].map((l, i) => (
                <div key={i} style={{
                  width: '30px', height: '30px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1f2937, #111827)',
                  border: '2px solid #000',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.65rem', fontWeight: 700,
                  color: '#00D4FF',
                  marginLeft: i > 0 ? '-8px' : '0',
                }}>{l}</div>
              ))}
            </div>
            <div>
              <p style={{
                fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)',
                margin: 0, textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontFamily: 'Manrope, sans-serif',
              }}>
                +500 negocios confían en nosotros
              </p>
              <div style={{ color: '#fbbf24', fontSize: '0.8rem', marginTop: '2px' }}>
                ★★★★★ <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: '4px' }}>4.9/5</span>
              </div>
            </div>
          </div>
        </HeroAnimatedBlock>

      </div>
    </section>
  )
}
