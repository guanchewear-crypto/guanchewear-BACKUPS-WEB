import { useEffect, useRef, useState } from 'react'

export function OriginSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

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

        <div className="relative aspect-[5/4] w-full" aria-label="Ruta ilustrada desde Canarias hasta Europa">
          <svg viewBox="0 0 760 600" className="size-full" role="img" aria-hidden="true">
            <defs>
              <radialGradient id="originGlow">
                <stop offset="0" stopColor="#D4A853" stopOpacity=".45" />
                <stop offset="1" stopColor="#B8912E" stopOpacity="0" />
              </radialGradient>
              <filter id="originBlur"><feGaussianBlur stdDeviation="12" /></filter>
            </defs>
            <circle cx="128" cy="480" r="90" fill="url(#originGlow)" filter="url(#originBlur)" />

            <g fill="#d9e6ee" fillOpacity=".17" stroke="#a9dfff" strokeOpacity=".2" strokeWidth="1">
              <path d="M420 82l48-24 72 11 26 29 60 12 31 38-10 43 34 28-18 52-48 24-22 48-53 8-24-32-45-9-29-46-37-19-16-62 27-42-7-38z" />
              <path d="M501 351l37 21 18 51-20 53-41 35-16-39 14-46-23-38z" />
            </g>
            <g fill="#8dd8ff">
              <path d="M73 484l28-7 14 7-19 8z" /><path d="M117 474l23-11 18 6-22 10z" />
              <path d="M157 458l16-8 22 4-18 10z" /><path d="M196 448l18-4 11 7-19 6z" />
              <path d="M225 463l12-5 11 5-10 7z" /><path d="M57 500l16-5 10 5-15 7z" />
            </g>

            {/* Gold route line with shimmer animation on draw */}
            <path d="M132 474 C 230 340, 320 245, 485 203 S 604 178, 620 159" fill="none" stroke="#D4A853" strokeWidth="2.5" strokeLinecap="round" pathLength="1" className="transition-[stroke-dashoffset] duration-[1800ms] ease-out motion-reduce:transition-none" style={{ strokeDasharray: 1, strokeDashoffset: visible ? 0 : 1 }} />
            {/* Glow layer behind route */}
            <path d="M132 474 C 230 340, 320 245, 485 203 S 604 178, 620 159" fill="none" stroke="#D4A853" strokeWidth="8" strokeOpacity=".12" filter="url(#originBlur)" pathLength="1" className="transition-[stroke-dashoffset] duration-[1800ms] ease-out motion-reduce:transition-none" style={{ strokeDasharray: 1, strokeDashoffset: visible ? 0 : 1 }} />
            {/* Shimmer overlay on route */}
            {visible && (
              <path d="M132 474 C 230 340, 320 245, 485 203 S 604 178, 620 159" fill="none" stroke="#E8C06A" strokeWidth="3" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset="0" className="transition-opacity duration-1000" style={{
                maskImage: 'linear-gradient(90deg, transparent 0%, white 40%, white 60%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, white 40%, white 60%, transparent 100%)',
              }} />
            )}

            {/* Canary Islands node with pulse animation */}
            <g className={`transition-opacity delay-700 duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
              {/* Outer pulse ring — continuously animating */}
              {visible && (
                <circle cx="132" cy="474" r="6" fill="none" stroke="#D4A853" strokeOpacity=".4">
                  <animate attributeName="r" values="6;22;6" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="strokeOpacity" values=".4;0;.4" dur="2.5s" repeatCount="indefinite" />
                </circle>
              )}
              <circle cx="132" cy="474" r="6" fill="#D4A853" />
              <circle cx="132" cy="474" r="15" fill="none" stroke="#D4A853" strokeOpacity=".35" />
            </g>

            {/* Europe node */}
            <g className={`transition-opacity delay-700 duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
              <circle cx="620" cy="159" r="6" fill="#fff" />
              <circle cx="620" cy="159" r="15" fill="none" stroke="#fff" strokeOpacity=".25" />
            </g>

            {/* Labels */}
            <g fill="#fff" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="700" letterSpacing="2">
              <text x="108" y="525">CANARIAS</text><text x="640" y="152">EUROPA</text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  )
}

export default OriginSection
