import { useEffect, useState, type RefObject } from 'react'

export interface MousePosition {
  x: number
  y: number
  xPercent: number
  yPercent: number
}

const initialPosition: MousePosition = {
  x: 0,
  y: 0,
  xPercent: 0,
  yPercent: 0,
}

const normalize = (position: number, size: number) =>
  size > 0 ? Math.max(-1, Math.min(1, (position / size) * 2 - 1)) : 0

export function useMousePosition<T extends HTMLElement = HTMLElement>(
  targetRef?: RefObject<T | null>,
): MousePosition {
  const [position, setPosition] = useState<MousePosition>(initialPosition)

  useEffect(() => {
    let animationFrame: number | null = null
    let clientX = 0
    let clientY = 0

    const updatePosition = () => {
      const target = targetRef?.current
      const rect = target?.getBoundingClientRect()
      const x = clientX - (rect?.left ?? 0)
      const y = clientY - (rect?.top ?? 0)
      const width = rect?.width ?? window.innerWidth
      const height = rect?.height ?? window.innerHeight

      setPosition({
        x,
        y,
        xPercent: normalize(x, width),
        yPercent: normalize(y, height),
      })

      animationFrame = null
    }

    const handleMouseMove = (event: MouseEvent) => {
      clientX = event.clientX
      clientY = event.clientY

      if (animationFrame === null) {
        animationFrame = requestAnimationFrame(updatePosition)
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationFrame !== null) cancelAnimationFrame(animationFrame)
    }
  }, [targetRef])

  return position
}

export default useMousePosition
