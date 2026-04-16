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
  hoverJump = false,
  colorCycle = false,
}) {
  const containerRef = useRef(null)
  const hasAnimated = useRef(false)
  const spansRef = useRef([])

  useEffect(() => {
    const container = containerRef.current
    if (!container || !text) return

    container.innerHTML = ''
    const animatable = []
    let jumpIndex = 0

    const createCharSpan = (char) => {
      const span = document.createElement('span')
      span.textContent = char
      span.style.display = 'inline-block'
      // Removing will-change as it often conflicts with -webkit-background-clip: text
      if (hoverJump || colorCycle) {
        span.style.setProperty('--jump-delay', `${jumpIndex * 0.045}s`)
        jumpIndex++
      }
      if (hoverJump) span.classList.add('split-hover-jump')
      if (colorCycle) span.classList.add('hero-color-cycle')
      
      // Force inherit to ensure background-clip transparency works
      span.style.color = 'inherit'
      
      if (letterStyle && Object.keys(letterStyle).length > 0) {
        Object.entries(letterStyle).forEach(([key, value]) => {
          span.style[key] = value
        })
      }
      gsap.set(span, from)
      animatable.push(span)
      return span
    }

    if (splitType === 'chars') {
      // ── Split by chars but group by word so line-break only between words ──
      const words = text.split(/(\s+)/)
      words.forEach((segment) => {
        if (segment === '') return
        if (/^\s+$/.test(segment)) {
          // Space between words
          const spacer = document.createElement('span')
          spacer.innerHTML = '&nbsp;'
          spacer.style.display = 'inline-block'
          spacer.style.width = '0.3em'
          container.appendChild(spacer)
          return
        }
        // Wrap each word's chars in a nowrap container
        const wordWrap = document.createElement('span')
        wordWrap.style.display = 'inline-block'
        wordWrap.style.whiteSpace = 'nowrap'
        segment.split('').forEach((char) => {
          wordWrap.appendChild(createCharSpan(char))
        })
        container.appendChild(wordWrap)
      })
    } else {
      // ── Split by words ──
      const items = text.split(/(\s+)/)
      items.forEach((item) => {
        if (/^\s+$/.test(item)) {
          const spacer = document.createElement('span')
          spacer.innerHTML = '&nbsp;'
          spacer.style.display = 'inline-block'
          container.appendChild(spacer)
          return
        }
        if (item === '') return
        container.appendChild(createCharSpan(item))
      })
    }

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
