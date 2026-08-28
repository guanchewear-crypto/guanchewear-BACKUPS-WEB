import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react'

export interface MagneticButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary'
}

const variants = { primary: 'bg-white text-black', secondary: 'border border-white bg-transparent text-white' }

export function MagneticButton({ children, href, onClick, className = '', variant = 'primary' }: MagneticButtonProps) {
  const innerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef(0)
  const current = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])
  const animate = () => {
    current.current.x += (target.current.x - current.current.x) * 0.16
    current.current.y += (target.current.y - current.current.y) * 0.16
    if (innerRef.current) innerRef.current.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`
    if (Math.abs(target.current.x - current.current.x) > 0.1 || Math.abs(target.current.y - current.current.y) > 0.1) frameRef.current = requestAnimationFrame(animate)
  }
  const start = () => { cancelAnimationFrame(frameRef.current); frameRef.current = requestAnimationFrame(animate) }
  const handleMove = (event: MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    target.current = { x: (event.clientX - rect.left - rect.width / 2) * 0.25, y: (event.clientY - rect.top - rect.height / 2) * 0.25 }
    start()
  }
  const handleLeave = () => { target.current = { x: 0, y: 0 }; start() }
  const sharedProps = { className: `inline-flex rounded-full ${className}`, onMouseMove: handleMove, onMouseLeave: handleLeave, onClick }
  const content = <div ref={innerRef} className={`flex h-full w-full items-center justify-center rounded-full px-7 py-3 transition-colors ${variants[variant]}`}>{children}</div>
  return href ? <a href={href} {...sharedProps}>{content}</a> : <button type="button" {...sharedProps}>{content}</button>
}

export default MagneticButton
