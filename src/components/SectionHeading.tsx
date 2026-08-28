import type { ReactNode } from 'react'

export interface SectionHeadingProps {
  subtitle?: string
  title: string
  highlightedWord?: string
  description?: string
  className?: string
  align?: 'left' | 'center'
}

function formatTitle(title: string, highlightedWord?: string): ReactNode {
  if (!highlightedWord) return title
  const start = title.toLocaleLowerCase().indexOf(highlightedWord.toLocaleLowerCase())
  if (start < 0) return title
  return <>{title.slice(0, start)}<em className="font-serif font-normal italic">{title.slice(start, start + highlightedWord.length)}</em>{title.slice(start + highlightedWord.length)}</>
}

export function SectionHeading({ subtitle, title, highlightedWord, description, className = '', align = 'left' }: SectionHeadingProps) {
  const centered = align === 'center'
  return <div className={`${centered ? 'mx-auto text-center' : 'text-left'} ${className}`}>
    {subtitle && <p className="mb-4 text-xs uppercase tracking-widest text-muted">{subtitle}</p>}
    <h2 className="font-sans text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">{formatTitle(title, highlightedWord)}</h2>
    {description && <p className={`mt-5 max-w-2xl text-muted ${centered ? 'mx-auto' : ''}`}>{description}</p>}
  </div>
}

export default SectionHeading
