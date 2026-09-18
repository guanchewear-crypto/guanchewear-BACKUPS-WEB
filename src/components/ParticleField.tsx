import { useEffect, useRef, type ReactNode } from 'react'

type Rgb = { r: number; g: number; b: number }

type Particle = {
  baseX: number
  baseY: number
  radius: number
  alpha: number
  amplitudeX: number
  amplitudeY: number
  speed: number
  phase: number
  layer: number
  twinkle: boolean
  twinkleSpeed: number
  twinkleAmount: number
  blur: number
  parallax: number
}

type AtmosphereGlow = {
  x: number
  y: number
  radius: number
  driftX: number
  driftY: number
  speed: number
  phase: number
  alpha: number
}

const GOLD_FALLBACK = '#D4A853'
const GOLD_LIGHT_FALLBACK = '#E8C06A'

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function hexToRgb(value: string): Rgb | null {
  const hex = value.trim().replace(/^#/, '')
  if (!/^[\da-f]{6}$/i.test(hex)) return null

  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  }
}

function getCssColor(variable: string, fallback: string): Rgb {
  const fromVariable = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue(variable))
  return fromVariable ?? hexToRgb(fallback)!
}

function getParticleCount(width: number) {
  if (width <= 360) return 34
  if (width <= 480) return 46
  if (width <= 767) return 64
  if (width <= 1023) return 92
  return clamp(Math.round(width / 11), 112, 176)
}

function createParticles(width: number, height: number): Particle[] {
  let seed = 0x475750
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
    return seed / 4294967296
  }

  return Array.from({ length: getParticleCount(width) }, () => {
    const layerRoll = random()
    const layer = layerRoll < 0.54 ? 0 : layerRoll < 0.87 ? 1 : 2
    const radius = layer === 0
      ? 0.5 + random() * 0.45
      : layer === 1
        ? 0.7 + random() * 0.7
        : 1 + random() * 1.2

    return {
      baseX: random() * width,
      baseY: random() * height,
      radius,
      alpha: layer === 0
        ? 0.16 + random() * 0.1
        : layer === 1
          ? 0.22 + random() * 0.13
          : 0.3 + random() * 0.18,
      amplitudeX: 10 + layer * 9 + random() * 18,
      amplitudeY: 7 + layer * 7 + random() * 15,
      speed: 0.00006 + layer * 0.00004 + random() * 0.00007,
      phase: random() * Math.PI * 2,
      layer,
      twinkle: random() < 0.14,
      twinkleSpeed: 0.00035 + random() * 0.00045,
      twinkleAmount: 0.18 + random() * 0.2,
      blur: random() < (layer === 0 ? 0.12 : layer === 1 ? 0.3 : 0.65) ? 0.7 + layer * 0.75 : 0,
      parallax: 0.8 + layer * 2 + random() * 2.4,
    }
  }).sort((left, right) => left.layer - right.layer)
}

interface ParticleFieldProps {
  children: ReactNode
}

/**
 * A cinematic canvas atmosphere that stays behind the landing content.
 * The stage begins at CollectionShowcase, so the hero remains untouched.
 */
export function ParticleField({ children }: ParticleFieldProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const stage = stageRef.current
    const field = fieldRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!stage || !field || !canvas || !context) return

    let viewportWidth = 0
    let viewportHeight = 0
    let devicePixelRatio = 1
    let particles: Particle[] = []
    let animationFrame = 0
    let visibilityFrame = 0
    let animationStart = 0
    let running = false
    let active = false
    let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let pointerTargetX = 0
    let pointerTargetY = 0
    let pointerX = 0
    let pointerY = 0
    const gold = getCssColor('--accent-gold', GOLD_FALLBACK)
    const goldLight = getCssColor('--accent-gold-light', GOLD_LIGHT_FALLBACK)
    const atmosphere: AtmosphereGlow[] = [
      { x: 0.16, y: 0.28, radius: 0.52, driftX: 0.12, driftY: 0.08, speed: 0.00007, phase: 0.4, alpha: 0.14 },
      { x: 0.78, y: 0.52, radius: 0.48, driftX: 0.1, driftY: 0.12, speed: 0.000055, phase: 2.1, alpha: 0.11 },
      { x: 0.44, y: 0.92, radius: 0.38, driftX: 0.16, driftY: 0.06, speed: 0.000085, phase: 4.6, alpha: 0.08 },
    ]

    const drawAtmosphere = (elapsed: number) => {
      context.save()
      context.globalCompositeOperation = 'screen'
      atmosphere.forEach((glow, index) => {
        const wave = elapsed * glow.speed + glow.phase
        const x = (glow.x + Math.sin(wave) * glow.driftX) * viewportWidth
        const y = (glow.y + Math.cos(wave * 0.73) * glow.driftY) * viewportHeight
        const radius = Math.min(viewportWidth, viewportHeight) * glow.radius
        const pulse = 0.78 + Math.sin(wave * 1.3 + index) * 0.22
        const gradient = context.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, `rgba(${gold.r}, ${gold.g}, ${gold.b}, ${glow.alpha * pulse})`)
        gradient.addColorStop(0.24, `rgba(${gold.r}, ${gold.g}, ${gold.b}, ${glow.alpha * 0.28 * pulse})`)
        gradient.addColorStop(1, `rgba(${gold.r}, ${gold.g}, ${gold.b}, 0)`)
        context.fillStyle = gradient
        context.fillRect(x - radius, y - radius, radius * 2, radius * 2)
      })
      context.restore()
    }

    const draw = (elapsed: number) => {
      context.setTransform(1, 0, 0, 1, 0, 0)
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
      context.globalCompositeOperation = 'source-over'

      drawAtmosphere(elapsed)

      if (!reducedMotion) {
        pointerX += (pointerTargetX - pointerX) * 0.035
        pointerY += (pointerTargetY - pointerY) * 0.035
      }

      particles.forEach((particle) => {
        const motionTime = elapsed * particle.speed
        const x = particle.baseX
          + Math.sin(motionTime + particle.phase) * particle.amplitudeX
          + Math.sin(motionTime * 0.37 + particle.phase * 1.7) * particle.amplitudeX * 0.28
          + pointerX * particle.parallax
        const y = particle.baseY
          + Math.cos(motionTime * 0.82 + particle.phase) * particle.amplitudeY
          + Math.sin(motionTime * 0.43 + particle.phase * 1.1) * particle.amplitudeY * 0.24
          + pointerY * particle.parallax
        const twinkle = particle.twinkle
          ? Math.sin(elapsed * particle.twinkleSpeed + particle.phase) * particle.twinkleAmount
          : 0
        const alpha = clamp(particle.alpha * (1 + twinkle), 0.08, 0.36)
        const color = particle.twinkle && particle.layer === 2 ? goldLight : gold

        context.beginPath()
        context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`
        if (particle.blur > 0) {
          context.shadowBlur = particle.blur * 2.2
          context.shadowColor = `rgba(${gold.r}, ${gold.g}, ${gold.b}, ${Math.min(alpha * 0.55, 0.16)})`
        }
        context.arc(x, y, particle.radius, 0, Math.PI * 2)
        context.fill()
        context.shadowBlur = 0
        context.shadowColor = 'transparent'
      })
    }

    const render = (timestamp: number) => {
      animationFrame = 0
      if (!running || !active || document.hidden) return
      if (animationStart === 0) animationStart = timestamp
      draw(timestamp - animationStart)
      animationFrame = requestAnimationFrame(render)
    }

    const start = () => {
      if (running || reducedMotion || document.hidden || !active) return
      running = true
      animationStart = 0
      animationFrame = requestAnimationFrame(render)
    }

    const stop = () => {
      running = false
      animationStart = 0
      if (animationFrame) cancelAnimationFrame(animationFrame)
      animationFrame = 0
    }

    const resize = () => {
      viewportWidth = window.innerWidth
      viewportHeight = window.innerHeight
      devicePixelRatio = Math.min(window.devicePixelRatio || 1, viewportWidth < 768 ? 1.25 : 1.5)
      canvas.width = Math.round(viewportWidth * devicePixelRatio)
      canvas.height = Math.round(viewportHeight * devicePixelRatio)
      particles = createParticles(viewportWidth, viewportHeight)
      draw(0)
    }

    const updateVisibility = () => {
      visibilityFrame = 0
      const bounds = stage.getBoundingClientRect()
      const fadeDistance = clamp(viewportHeight * 0.25, 180, 320)
      const fadeIn = clamp((viewportHeight - bounds.top) / fadeDistance, 0, 1)
      const fadeOut = clamp(bounds.bottom / fadeDistance, 0, 1)
      const opacity = Math.min(fadeIn, fadeOut)

      field.style.opacity = String(opacity)
      active = opacity > 0.01

      if (reducedMotion) {
        stop()
        if (active) draw(0)
      } else if (active && !document.hidden) {
        start()
      } else {
        stop()
      }
    }

    const scheduleVisibility = () => {
      if (visibilityFrame) return
      visibilityFrame = requestAnimationFrame(updateVisibility)
    }

    const handleResize = () => {
      resize()
      scheduleVisibility()
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (reducedMotion || viewportWidth === 0) return
      pointerTargetX = (event.clientX / viewportWidth - 0.5) * 2
      pointerTargetY = (event.clientY / viewportHeight - 0.5) * 2
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stop()
      } else if (active && !reducedMotion) {
        start()
      }
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches
      if (reducedMotion) {
        stop()
        if (active) draw(0)
      } else if (active && !document.hidden) {
        start()
      }
    }

    resize()
    updateVisibility()
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', scheduleVisibility, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const finePointerQuery = window.matchMedia('(pointer: fine)')
    if (finePointerQuery.matches) window.addEventListener('pointermove', handlePointerMove, { passive: true })

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', handleMotionChange)
    } else {
      motionQuery.addListener(handleMotionChange)
    }

    return () => {
      stop()
      if (visibilityFrame) cancelAnimationFrame(visibilityFrame)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', scheduleVisibility)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (finePointerQuery.matches) window.removeEventListener('pointermove', handlePointerMove)
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener('change', handleMotionChange)
      } else {
        motionQuery.removeListener(handleMotionChange)
      }
    }
  }, [])

  return (
    <div ref={stageRef} className="gw-particle-stage">
      <div ref={fieldRef} className="gw-particle-field" aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>
      {children}
    </div>
  )
}

export default ParticleField
