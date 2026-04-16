/**
 * HoverLetters — Splits text into individual char spans,
 * each with the `.split-hover-jump` CSS class for the
 * per-letter bounce animation on hover.
 *
 * Props:
 *  - colorCycle  boolean  Also adds `.hero-color-cycle` for brand color animation
 */
export default function HoverLetters({
  children,
  tag: Tag = 'span',
  className = '',
  style = {},
  colorCycle = false,
}) {
  const text = String(children)
  const words = text.split(/(\s+)/)
  let charIndex = 0

  return (
    <Tag className={className} style={style}>
      {words.map((segment, wi) => {
        if (segment === '') return null
        if (/^\s+$/.test(segment)) {
          charIndex += segment.length
          return <span key={`sp-${wi}`} style={{ display: 'inline-block', width: '0.28em' }}>&nbsp;</span>
        }
        const wordChars = segment.split('').map((char, ci) => {
          const i = charIndex + ci
          const cls = ['split-hover-jump', colorCycle ? 'hero-color-cycle' : '']
            .filter(Boolean).join(' ')
          return (
            <span key={i} className={cls} style={{ '--jump-delay': `${i * 0.045}s` }}>
              {char}
            </span>
          )
        })
        charIndex += segment.length
        return (
          <span key={`w-${wi}`} style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            {wordChars}
          </span>
        )
      })}
    </Tag>
  )
}
