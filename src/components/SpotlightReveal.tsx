import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

type SpotlightRevealProps = { mainImage: string; hiddenImage: string }
const SPOTLIGHT_RADIUS = 280

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update(); media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])
  return matches
}

function DesktopSpotlight({ mainImage, hiddenImage }: SpotlightRevealProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursor = useRef({ x: 0, y: 0, tx: 0, ty: 0, clientX: 0, clientY: 0, active: false, blocked: false })
  const idleTimer = useRef<number | undefined>(undefined)
  const [showHint, setShowHint] = useState(false)
  const reduceMotion = useReducedMotion()

  const restartIdle = useCallback(() => {
    setShowHint(false); window.clearTimeout(idleTimer.current)
    idleTimer.current = window.setTimeout(() => {
      if (cursor.current.active && !cursor.current.blocked) setShowHint(true)
    }, 1500)
  }, [])

  useEffect(() => () => window.clearTimeout(idleTimer.current), [])

  // The hero stacks a full-bleed content layer on top of this component, so a
  // listener bound to our own node would only ever fire in the leftover margins.
  // Track the pointer on the window and test it against our own box instead.
  useEffect(() => {
    // Always read cursor.current fresh: the draw effect below mutates this ref,
    // and a captured alias would silently write into an orphaned object.
    const insideWrap = (pointer: typeof cursor.current) => {
      const wrap = wrapRef.current
      if (!wrap) return null
      const rect = wrap.getBoundingClientRect()
      const inside =
        pointer.clientX >= rect.left && pointer.clientX <= rect.right &&
        pointer.clientY >= rect.top && pointer.clientY <= rect.bottom
      return inside ? rect : null
    }

    const onPointerMove = (event: PointerEvent) => {
      const pointer = cursor.current
      pointer.clientX = event.clientX
      pointer.clientY = event.clientY
      const rect = insideWrap(pointer)
      pointer.active = Boolean(rect)

      if (!rect) {
        setShowHint(false)
        window.clearTimeout(idleTimer.current)
        return
      }

      pointer.tx = event.clientX - rect.left
      pointer.ty = event.clientY - rect.top
      if (!pointer.x && !pointer.y) { pointer.x = pointer.tx; pointer.y = pointer.ty }

      pointer.blocked = Boolean((event.target as HTMLElement | null)?.closest?.('a,button'))
      if (pointer.blocked) setShowHint(false)
      else restartIdle()
    }

    const onScroll = () => {
      const pointer = cursor.current
      if (pointer.active && !insideWrap(pointer)) {
        pointer.active = false
        setShowHint(false)
        window.clearTimeout(idleTimer.current)
      }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [restartIdle])
  useEffect(() => {
    const wrap = wrapRef.current; const canvas = canvasRef.current; const ctx = canvas?.getContext('2d')
    if (!wrap || !canvas || !ctx) return
    const image = new Image(); image.src = hiddenImage
    let frame = 0; let width = 0; let height = 0
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      // offsetWidth/Height are the layout box. getBoundingClientRect() would
      // report the size mid entrance-transform and bake that inflated size in.
      width = wrap.offsetWidth || 1; height = wrap.offsetHeight || 1
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const p = cursor.current
      if (!p.x && !p.y) { p.x = p.tx = width / 2; p.y = p.ty = height / 2 }
    }
    const draw = () => {
      const p = cursor.current; const lerp = reduceMotion ? 1 : .09
      p.x += (p.tx - p.x) * lerp; p.y += (p.ty - p.y) * lerp; ctx.clearRect(0, 0, width, height)
      if (p.active && image.complete && image.naturalWidth) {
        const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
        const w = image.naturalWidth * scale; const h = image.naturalHeight * scale
        ctx.save(); ctx.drawImage(image, (width - w) / 2, (height - h) / 2, w, h); ctx.globalCompositeOperation = 'destination-in'
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, SPOTLIGHT_RADIUS)
        gradient.addColorStop(0, '#fff'); gradient.addColorStop(.68, 'rgba(255,255,255,.88)'); gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height); ctx.restore()
      }
      frame = requestAnimationFrame(draw)
    }
    const observer = new ResizeObserver(resize); observer.observe(wrap); resize(); frame = requestAnimationFrame(draw)
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [hiddenImage, reduceMotion])

  return <div ref={wrapRef} className="pointer-events-none absolute inset-0">
    <img src={mainImage} alt="Camiseta Monaco Riviera" className="h-full w-full object-cover" draggable={false} />
    <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />
    <span className={`pointer-events-none absolute left-1/2 top-[72%] -translate-x-1/2 text-[9px] tracking-[.28em] text-white transition-opacity duration-500 ${showHint ? 'opacity-70' : 'opacity-0'}`}>DESCUBRIR OTRA HISTORIA</span>
  </div>
}

function MobileSlider({ mainImage, hiddenImage }: SpotlightRevealProps) {
  const wrapRef = useRef<HTMLDivElement>(null); const dividerRef = useRef<HTMLDivElement>(null); const revealRef = useRef<HTMLDivElement>(null)
  const interacting = useRef(false); const stopped = useRef(false); const reduceMotion = useReducedMotion()
  const paint = useCallback((value: number) => {
    const p = Math.max(5, Math.min(95, value)); if (dividerRef.current) dividerRef.current.style.left = `${p}%`
    if (revealRef.current) revealRef.current.style.clipPath = `inset(0 ${100 - p}% 0 0)`
  }, [])
  useEffect(() => {
    paint(62); if (reduceMotion) return
    let frame = 0; const start = performance.now(); const animate = (time: number) => { if (!stopped.current && !interacting.current) paint(62 + Math.sin((time - start) / 2800) * 7); frame = requestAnimationFrame(animate) }
    frame = requestAnimationFrame(animate); return () => cancelAnimationFrame(frame)
  }, [paint, reduceMotion])
  const update = (x: number) => { const rect = wrapRef.current?.getBoundingClientRect(); if (rect) paint(((x - rect.left) / rect.width) * 100) }
  return <div ref={wrapRef} className="absolute inset-0 touch-none select-none overflow-hidden" onPointerDown={(e) => { interacting.current = true; stopped.current = true; e.currentTarget.setPointerCapture(e.pointerId); update(e.clientX) }} onPointerMove={(e) => interacting.current && update(e.clientX)} onPointerUp={() => { interacting.current = false }} onPointerCancel={() => { interacting.current = false }}>
    <img src={hiddenImage} alt="Camiseta Monaco Lifestyle" className="h-full w-full object-cover" draggable={false} />
    <div ref={revealRef} className="absolute inset-0" style={{ clipPath: 'inset(0 38% 0 0)' }}><img src={mainImage} alt="Camiseta Monaco Riviera" className="h-full w-full object-cover" draggable={false} /></div>
    <div ref={dividerRef} className="pointer-events-none absolute inset-y-0 left-[62%] w-px bg-white/80"><span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-black/35 text-lg backdrop-blur-md">↔</span></div>
    <span className="pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] tracking-[.28em] text-white/75">DESLIZA PARA REVELAR</span>
  </div>
}

export function SpotlightReveal(props: SpotlightRevealProps) {
  return useMediaQuery('(max-width: 767px), (hover: none)') ? <MobileSlider {...props} /> : <DesktopSpotlight {...props} />
}
