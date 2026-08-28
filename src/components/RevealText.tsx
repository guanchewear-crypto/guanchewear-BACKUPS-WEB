import type { CSSProperties, ElementType } from 'react'

export interface RevealTextProps {
  children: string
  delay?: number
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export function RevealText({ children, delay = 0, className = '', as = 'span' }: RevealTextProps) {
  const Component: ElementType = as
  const words = children.trim().split(/\s+/)
  return <Component className={className} aria-label={children}>{words.map((word, index) => <span key={`${word}-${index}`} className="inline-block overflow-hidden align-bottom" aria-hidden="true"><span className="inline-block animate-[reveal-word_0.7s_cubic-bezier(0.22,1,0.36,1)_both] motion-reduce:animate-none" style={{ animationDelay: `${delay + index * 0.04}s`, '--reveal-from': 'inset(100% 0 0 0)' } as CSSProperties}>{word}</span>{index < words.length - 1 && '\u00a0'}</span>)}</Component>
}

export default RevealText
