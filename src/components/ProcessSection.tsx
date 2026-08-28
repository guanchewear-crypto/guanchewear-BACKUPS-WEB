import { useEffect, useRef, useState } from 'react'
import { Lightbulb, Palette, Truck, type LucideIcon } from 'lucide-react'
import { processSteps } from '../data/collections'

const icons: Record<string, LucideIcon> = { Lightbulb, Palette, Truck }

export function ProcessSection() {
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
    }, { threshold: 0.2 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="como-funciona" ref={sectionRef} className="scroll-mt-20 bg-bg-secondary px-5 py-24 text-text-primary sm:px-8 lg:px-[7vw] lg:py-36" aria-labelledby="process-title">
      <div className="mx-auto max-w-7xl">
        <p className="label-section text-gold">NUESTRO MÉTODO</p>
        <h2 id="process-title" className="heading-section mt-5 max-w-4xl text-white sm:text-6xl lg:text-7xl">
          Tú imaginas. Nosotros lo hacemos posible.
        </h2>

        <div className="relative mt-20 grid gap-14 md:grid-cols-3 md:gap-8">
          {/* Gold connector line */}
          <div className="absolute bottom-0 left-0 right-0 md:left-1/2 md:top-0 md:h-full md:w-px md:-translate-x-1/2 md:border-0">
            <div className="h-px bg-gold/20 md:h-full md:w-px">
              <div className={`h-full w-full origin-top bg-gradient-to-b from-transparent via-gold to-transparent transition-transform duration-1000 md:origin-left md:scale-x-0 md:bg-gradient-to-r ${visible ? 'scale-y-100 md:scale-x-100' : 'scale-y-0 md:scale-x-0'}`} />
            </div>
          </div>

          {processSteps.map((step, index) => {
            const Icon = icons[step.icon] ?? Lightbulb
            return (
              <article
                key={step.number}
                className={`relative pl-16 transition-all duration-700 md:pl-0 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-7 opacity-0'}`}
                style={{ transitionDelay: `${index * 180 + 150}ms` }}
              >
                <div className="absolute left-0 top-0 flex size-11 items-center justify-center rounded-full border border-gold/30 bg-bg-secondary shadow-[0_0_20px_rgba(212,168,83,0.1)] md:relative md:size-14">
                  <span className={`absolute inset-0 origin-bottom rounded-full bg-gradient-to-b from-gold to-gold-dark transition-transform duration-500 ${visible ? 'scale-y-100' : 'scale-y-0'}`} />
                  <Icon className={`relative z-10 size-5 transition-colors duration-500 ${visible ? 'text-bg-secondary' : 'text-gold'}`} strokeWidth={1.5} />
                </div>
                <p className="mt-0 text-xs font-black tracking-[0.2em] text-gold md:mt-8">{step.number}</p>
                <h3 className="mt-3 text-2xl font-black tracking-[-0.025em] text-white">{step.title}</h3>
                <p className="mt-4 max-w-sm leading-relaxed text-text-secondary">{step.description}</p>
              </article>
            )
          })}
        </div>
        <a href="#crear-diseno" className="mt-20 inline-flex min-h-14 items-center rounded-full bg-gold px-8 text-xs font-black tracking-[0.18em] text-text-contrast shadow-[0_0_30px_rgba(212,168,83,0.2)] transition-all hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-[0_0_40px_rgba(212,168,83,0.35)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
          EMPEZAR MI DISEÑO
        </a>
      </div>
    </section>
  )
}

export default ProcessSection
