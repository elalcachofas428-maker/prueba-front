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

  return (
    <Tag className={className} style={style}>
      {text.split('').map((char, i) => {
        if (char === ' ') {
          return <span key={i} style={{ display: 'inline-block', width: '0.28em' }}>&nbsp;</span>
        }
        const cls = ['split-hover-jump', colorCycle ? 'hero-color-cycle' : '']
          .filter(Boolean).join(' ')
        return (
          <span key={i} className={cls} style={{ '--jump-delay': `${i * 0.045}s` }}>
            {char}
          </span>
        )
      })}
    </Tag>
  )
}
