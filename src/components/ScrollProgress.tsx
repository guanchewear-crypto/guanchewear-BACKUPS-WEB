import { useEffect, useState } from 'react'

export interface ScrollProgressProps { className?: string }

export function ScrollProgress({ className = '' }: ScrollProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const maximum = document.documentElement.scrollHeight - window.innerHeight
        setProgress(maximum > 0 ? Math.min(window.scrollY / maximum, 1) : 0)
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return <div aria-hidden="true" className={`fixed right-0 top-0 bottom-0 z-[199] w-px bg-[rgba(255,255,255,0.08)] ${className}`}><div className="w-full origin-top bg-white" style={{ height: `${progress * 100}%` }} /></div>
}

export default ScrollProgress
