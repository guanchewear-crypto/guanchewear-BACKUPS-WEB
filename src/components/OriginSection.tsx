import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { EUROPE_LANDING, ORIGIN_VIEWBOX, ROUTE_PATH, TENERIFE, canaryIslands, europePath } from '../data/originMap'

export function OriginSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.3 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const drawIn = {
    strokeDasharray: 1,
    strokeDashoffset: visible ? 0 : 1,
  }

  return (
    <section id="historia" ref={sectionRef} className="relative isolate scroll-mt-16 overflow-hidden bg-bg-secondary px-5 py-28 text-white sm:px-8 lg:px-[7vw] lg:py-44" aria-labelledby="origin-title">
      <div className="absolute left-[-15%] top-[20%] -z-10 size-[55vw] min-h-96 min-w-96 rounded-full bg-gold/10 blur-[120px]" />
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.78fr_1.22fr]">
        <div>
          <p className="label-section text-gold">NUESTRO ORIGEN</p>
          <h2 id="origin-title" className="heading-section mt-5 text-5xl leading-[0.88] tracking-[-0.055em] text-white sm:text-7xl lg:text-[clamp(4.5rem,7vw,7rem)]">
            DE CANARIAS PARA TODA EUROPA.
          </h2>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
            GuancheWear nace en las Islas Canarias con una idea sencilla: convertir lo que te representa en una prenda que sea solo tuya. Diseñamos desde las islas y producimos cada encargo en Europa, cuidando la historia que hay detrás de cada pieza.
          </p>
        </div>

        <div className="relative aspect-[5/4] w-full">
          <svg viewBox={ORIGIN_VIEWBOX} className="size-full" aria-label="Mapa con la silueta real de Canarias y de Europa, y la ruta que sale de Tenerife">
            <desc>Ruta ilustrada desde Canarias, saliendo de Tenerife, hasta Europa</desc>
            <defs>
              <radialGradient id="originGlow">
                <stop offset="0" stopColor="#D4A853" stopOpacity=".45" />
                <stop offset="1" stopColor="#B8912E" stopOpacity="0" />
              </radialGradient>
              <filter id="originBlur"><feGaussianBlur stdDeviation="12" /></filter>
            </defs>

            {/* Glow sits on Tenerife, where the route is born */}
            <circle cx={TENERIFE.x} cy={TENERIFE.y} r="90" fill="url(#originGlow)" filter="url(#originBlur)" />

            {/* Europe: real silhouette, every ring kept so seas read as holes */}
            <g fill="#d9e6ee" fillOpacity=".17" stroke="#a9dfff" strokeOpacity=".2" strokeWidth="1">
              <path d={europePath} fillRule="evenodd" />
            </g>

            {/* Canary Islands: real polygons, in their real arrangement */}
            <g fill="#8dd8ff">
              {canaryIslands.map((island) => (
                <path key={island.name} d={island.path} />
              ))}
            </g>

            {/* Gold route line with shimmer animation on draw */}
            <path id="origin-route" d={ROUTE_PATH} fill="none" stroke="#D4A853" strokeWidth="2.5" strokeLinecap="round" pathLength="1" className="transition-[stroke-dashoffset] duration-[1800ms] ease-out motion-reduce:transition-none" style={drawIn} />
            {/* Glow layer behind route */}
            <path d={ROUTE_PATH} fill="none" stroke="#D4A853" strokeWidth="8" strokeOpacity=".12" filter="url(#originBlur)" pathLength="1" className="transition-[stroke-dashoffset] duration-[1800ms] ease-out motion-reduce:transition-none" style={drawIn} />
            {/* Shimmer overlay on route */}
            {visible && (
              <path d={ROUTE_PATH} fill="none" stroke="#E8C06A" strokeWidth="3" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset="0" className="transition-opacity duration-1000" style={{
                maskImage: 'linear-gradient(90deg, transparent 0%, white 40%, white 60%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, white 40%, white 60%, transparent 100%)',
              }} />
            )}

            {/* Luminous point travelling from Tenerife to Europe */}
            {visible && !reduceMotion && (
              <g aria-hidden="true">
                <animateMotion dur="3.4s" repeatCount="indefinite" begin="1.4s">
                  <mpath href="#origin-route" />
                </animateMotion>
                <circle r="7" fill="#D4A853" opacity=".28" />
                <circle r="3.2" fill="#F2DCA0" />
              </g>
            )}

            {/* Tenerife node with pulse animation */}
            <g className={`transition-opacity delay-700 duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
              {/* Outer pulse ring — continuously animating */}
              {visible && (
                <circle cx={TENERIFE.x} cy={TENERIFE.y} r="6" fill="none" stroke="#D4A853" strokeOpacity=".4">
                  <animate attributeName="r" values="6;22;6" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="strokeOpacity" values=".4;0;.4" dur="2.5s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx={TENERIFE.x} cy={TENERIFE.y} r="6" fill="#D4A853" />
              <circle cx={TENERIFE.x} cy={TENERIFE.y} r="15" fill="none" stroke="#D4A853" strokeOpacity=".35" />
            </g>

            {/* Europe node */}
            <g className={`transition-opacity delay-700 duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
              <circle cx={EUROPE_LANDING.x} cy={EUROPE_LANDING.y} r="6" fill="#fff" />
              <circle cx={EUROPE_LANDING.x} cy={EUROPE_LANDING.y} r="15" fill="none" stroke="#fff" strokeOpacity=".25" />
            </g>

            {/* Labels */}
            <g fill="#fff" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="700" letterSpacing="2">
              <text x="44" y="584">CANARIAS</text><text x="566" y="226">EUROPA</text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  )
}

export default OriginSection
