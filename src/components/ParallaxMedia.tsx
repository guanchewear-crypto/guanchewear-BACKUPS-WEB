import { useRef, type ReactNode } from 'react'
import { useLenis } from 'lenis/react'

export interface ParallaxMediaProps { children: ReactNode; speed?: number; className?: string }

export function ParallaxMedia({ children, speed = 0.5, className = '' }: ParallaxMediaProps) {
  const ref = useRef<HTMLDivElement>(null)
  useLenis(() => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const distance = rect.top + rect.height / 2 - window.innerHeight / 2
    ref.current.style.transform = `translate3d(0, ${distance * speed}px, 0)`
  }, [speed])
  return <div ref={ref} className={`will-change-transform ${className}`}>{children}</div>
}

export default ParallaxMedia
