import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { testimonials } from '../data/testimonials'

export default function TestimonialsSection() {
  const [[active, direction], setActive] = useState([0, 1])
  const [paused, setPaused] = useState(false)
  const go = (step: number) => setActive(([index]) => [(index + step + testimonials.length) % testimonials.length, step])

  useEffect(() => {
    if (paused) return
    const timer = window.setInterval(() => go(1), 6500)
    return () => window.clearInterval(timer)
  }, [paused])

  const current = testimonials[active]
  return (
    <section className="overflow-hidden bg-bg-primary px-5 py-24 text-text-primary md:px-10 md:py-36" aria-labelledby="testimonials-title" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <div className="mx-auto max-w-7xl">
        <p className="label-section mb-5 text-gold">TESTIMONIOS</p>
        <h2 id="testimonials-title" className="heading-section max-w-5xl text-white md:text-7xl">Personas reales. Diseños reales.</h2>
        <div className="mt-16 flex gap-5 md:mt-24">
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            <motion.article key={active} custom={direction} variants={{ enter: (d: number) => ({ x: d * 160, opacity: 0 }), center: { x: 0, opacity: 1 }, exit: (d: number) => ({ x: d * -160, opacity: 0 }) }} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 180, damping: 24 }} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.18} onDragEnd={(_, info) => Math.abs(info.offset.x) > 70 && go(info.offset.x < 0 ? 1 : -1)} className="relative min-h-[390px] w-[92%] shrink-0 border border-gold/10 bg-bg-secondary p-7 md:min-h-[430px] md:w-[78%] md:p-12">
              <span aria-hidden="true" className="font-display absolute right-8 top-0 text-[130px] leading-none text-gold/20">"</span>
              <blockquote className="relative flex h-full flex-col justify-between">
                <p className="max-w-4xl text-2xl font-medium leading-tight tracking-[-.03em] md:text-5xl">
                  {current.text.split(' ').map((word, i) => <motion.span key={`${word}-${i}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .035 }} className="inline-block text-white">{word}&nbsp;</motion.span>)}
                </p>
                <footer className="mt-12"><strong className="text-sm tracking-[.18em] text-gold">{current.author.toUpperCase()}</strong><p className="mt-2 text-xs text-text-secondary">{current.location}</p></footer>
              </blockquote>
            </motion.article>
          </AnimatePresence>
          <div className="hidden w-[22%] shrink-0 border border-border-subtle bg-bg-tertiary p-8 opacity-40 md:block"><p className="text-xl leading-snug text-text-secondary">{testimonials[(active + 1) % testimonials.length].text}</p></div>
        </div>
        <div className="mt-8 flex items-center justify-between">
          <span className="text-xs tracking-[.2em] text-text-secondary">{String(active + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}</span>
          <div className="hidden gap-2 md:flex"><button onClick={() => go(-1)} aria-label="Testimonio anterior" className="border border-border-subtle p-4 transition-colors hover:border-gold/40 hover:text-gold"><ArrowLeft className="h-4 w-4" /></button><button onClick={() => go(1)} aria-label="Siguiente testimonio" className="border border-border-subtle p-4 transition-colors hover:border-gold/40 hover:text-gold"><ArrowRight className="h-4 w-4" /></button></div>
        </div>
      </div>
    </section>
  )
}
