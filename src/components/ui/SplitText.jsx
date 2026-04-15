import { useRef, useEffect } from 'react'
import gsap from 'gsap'

/**
 * SplitText — Anima texto dividido en chars o words con GSAP.
 *
 * Props:
 *  - text           string       Texto a animar
 *  - className      string       Clases CSS del contenedor
 *  - style          object       Estilos inline del contenedor
 *  - letterStyle    object       Estilos aplicados a cada char/word span
 *  - delay          number       ms entre cada item (stagger)
 *  - duration       number       duración de cada animación (s)
 *  - ease           string       GSAP ease
 *  - splitType      'chars'|'words'
 *  - from           object       Estado inicial de GSAP
 *  - to             object       Estado final de GSAP
 *  - threshold      number       IntersectionObserver threshold
 *  - rootMargin     string       IntersectionObserver rootMargin
 *  - textAlign      string
 *  - startDelay     number       Delay adicional antes de iniciar (s)
 *  - tag            string       Elemento HTML contenedor
 *  - onLetterAnimationComplete  callback al terminar
 */
export default function SplitText({
  text = '',
  className = '',
  style = {},
  letterStyle = {},
  delay = 50,
  duration = 0.6,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-50px',
  textAlign = 'left',
  startDelay = 0,
  tag: Tag = 'div',
  onLetterAnimationComplete,
}) {
  const containerRef = useRef(null)
  const hasAnimated = useRef(false)
  const spansRef = useRef([])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !text) return

    // ── Split into items ──
    const items = splitType === 'chars'
      ? text.split('')
      : text.split(/(\s+)/)

    container.innerHTML = ''
    const animatable = []

    items.forEach((item) => {
      // Whitespace — render as inline space
      if (/^\s+$/.test(item)) {
        const spacer = document.createElement('span')
        spacer.innerHTML = '&nbsp;'
        spacer.style.display = 'inline-block'
        // For chars mode, preserve space width
        if (splitType === 'chars') {
          spacer.style.width = '0.3em'
        }
        container.appendChild(spacer)
        return
      }

      // Empty string (edge case from split)
      if (item === '') return

      const span = document.createElement('span')
      span.textContent = item
      span.style.display = 'inline-block'
      span.style.willChange = 'transform, opacity'

      // Apply per-letter/word custom styles (e.g. gradient)
      if (letterStyle && Object.keys(letterStyle).length > 0) {
        Object.entries(letterStyle).forEach(([key, value]) => {
          span.style[key] = value
        })
      }

      // Set initial hidden state
      gsap.set(span, from)

      container.appendChild(span)
      animatable.push(span)
    })

    spansRef.current = animatable

    // ── IntersectionObserver — trigger animation on scroll-into-view ──
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true

          gsap.to(animatable, {
            ...to,
            duration,
            ease,
            delay: startDelay,
            stagger: delay / 1000,
            onComplete: () => {
              onLetterAnimationComplete?.()
            },
          })
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(container)

    return () => {
      observer.disconnect()
      gsap.killTweensOf(animatable)
    }
  }, [text])

  return (
    <Tag
      ref={containerRef}
      className={className}
      style={{ textAlign, ...style }}
    >
      {text}
    </Tag>
  )
}
