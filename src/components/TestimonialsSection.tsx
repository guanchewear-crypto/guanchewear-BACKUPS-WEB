import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Star } from 'lucide-react'
import { testimonials } from '../data/testimonials'

export default function TestimonialsSection() {
  const [[active, direction], setActive] = useState([0, 1])
  const [paused, setPaused] = useState(false)
  const go = (step: number) => setActive(([index]) => [(index + step + testimonials.length) % testimonials.length, step])

  useEffect(() => {
    if (paused) return
    const timer = window.setInterval(() => go(1), 7000)
    return () => window.clearInterval(timer)
  }, [paused])

  const current = testimonials[active]
  return (
    <section className="relative overflow-hidden bg-bg-primary px-5 py-24 text-text-primary md:px-10 md:py-36" aria-labelledby="testimonials-title" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      {/* Gold ambient glow behind testimonials */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-gold/5 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <p className="label-section mb-5 text-gold">TESTIMONIOS</p>
        <h2 id="testimonials-title" className="heading-section max-w-5xl text-white md:text-7xl">Personas reales. Diseños reales.</h2>
        <div className="mt-16 flex gap-5 md:mt-24">
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            <motion.article
              key={active}
              custom={direction}
              variants={{
                enter: (d: number) => ({ x: d * 160, opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit: (d: number) => ({ x: d * -160, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 180, damping: 24 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => Math.abs(info.offset.x) > 70 && go(info.offset.x < 0 ? 1 : -1)}
              className="group relative min-h-[390px] w-[92%] shrink-0 border border-gold/10 bg-bg-secondary/80 p-7 backdrop-blur-sm md:min-h-[430px] md:w-[78%] md:p-12"
              style={{
                background: 'rgba(17,17,17,0.8)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              {/* Large gold quote icon */}
              <div className="absolute -right-2 -top-4 text-gold/15 group-hover:text-gold/25 transition-colors duration-500">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" className="font-display opacity-50">
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C9.591 11.69 11 13.196 11 15c0 1.933-1.567 3.5-3.5 3.5-1.275 0-2.434-.57-3.067-1.179zm11 0C14.553 16.227 14 15 14 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311C20.591 11.69 22 13.196 22 15c0 1.933-1.567 3.5-3.5 3.5-1.275 0-2.434-.57-3.067-1.179z" />
                </svg>
              </div>

              <blockquote className="relative flex h-full flex-col justify-between">
                {/* Gold stars rating */}
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>

                <p className="max-w-4xl text-2xl font-medium leading-tight tracking-[-.03em] md:text-5xl">
                  {current.text.split(' ').map((word, i) => (
                    <motion.span
                      key={`${word}-${i}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * .055, duration: 0.5 }}
                      className="inline-block text-white"
                    >
                      {word}&nbsp;
                    </motion.span>
                  ))}
                </p>
                <footer className="mt-12 flex items-center gap-4">
                  {/* Avatar circle with initials */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/20 border border-gold/30 text-gold font-bold text-sm">
                    {current.author.charAt(0)}
                  </div>
                  <div>
                    <strong className="text-sm tracking-[.18em] text-gold">{current.author.toUpperCase()}</strong>
                    <p className="mt-1 text-xs text-text-secondary">{current.location}</p>
                  </div>
                </footer>
              </blockquote>
            </motion.article>
          </AnimatePresence>
          <div className="hidden w-[22%] shrink-0 border border-gold/10 bg-bg-secondary/80 p-8 backdrop-blur-sm opacity-50 md:block">
            <p className="text-xl leading-snug text-text-secondary">{testimonials[(active + 1) % testimonials.length].text}</p>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between">
          <span className="text-xs tracking-[.2em] text-text-secondary">{String(active + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}</span>
          <div className="hidden gap-2 md:flex">
            <button onClick={() => go(-1)} aria-label="Testimonio anterior" className="border border-gold/20 p-4 transition-all hover:border-gold/40 hover:text-gold hover:shadow-[0_0_15px_rgba(212,168,83,0.15)]">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button onClick={() => go(1)} aria-label="Siguiente testimonio" className="border border-gold/20 p-4 transition-all hover:border-gold/40 hover:text-gold hover:shadow-[0_0_15px_rgba(212,168,83,0.15)]">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
