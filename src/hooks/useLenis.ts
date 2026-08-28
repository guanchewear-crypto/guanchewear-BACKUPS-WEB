import { useCallback, useEffect, useRef } from 'react'
import Lenis from 'lenis'

export interface UseLenisResult {
  lenis: React.RefObject<Lenis | null>
  start: () => void
  stop: () => void
  destroy: () => void
}

export function useLenis(enabled = true): UseLenisResult {
  const lenis = useRef<Lenis | null>(null)
  const animationFrame = useRef<number | null>(null)

  const destroy = useCallback(() => {
    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current)
      animationFrame.current = null
    }

    lenis.current?.destroy()
    lenis.current = null
  }, [])

  const start = useCallback(() => {
    lenis.current?.start()
  }, [])

  const stop = useCallback(() => {
    lenis.current?.stop()
  }, [])

  useEffect(() => {
    if (!enabled) {
      destroy()
      return
    }

    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    lenis.current = instance

    const raf = (time: number) => {
      instance.raf(time)
      animationFrame.current = requestAnimationFrame(raf)
    }

    animationFrame.current = requestAnimationFrame(raf)

    return destroy
  }, [destroy, enabled])

  return { lenis, start, stop, destroy }
}

export default useLenis
