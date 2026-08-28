import { useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Plus } from 'lucide-react'
import { faqData } from '../data/faq'

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const handleKeys = (event: KeyboardEvent, index: number) => {
    const keyMap: Record<string, number> = { ArrowDown: (index + 1) % faqData.length, ArrowUp: (index - 1 + faqData.length) % faqData.length, Home: 0, End: faqData.length - 1 }
    if (keyMap[event.key] !== undefined) { event.preventDefault(); buttons.current[keyMap[event.key]]?.focus() }
  }

  return (
    <section id="faq" className="relative scroll-mt-16 bg-bg-secondary px-5 py-24 text-text-primary md:px-10 md:py-36" aria-labelledby="faq-title">
      {/* Gold ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-1/4 h-[300px] w-[300px] rounded-full bg-gold/5 blur-[80px]" />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.85fr_1.15fr] lg:gap-24">
        <div>
          <p className="label-section mb-5 text-gold">PREGUNTAS</p>
          <h2 id="faq-title" className="heading-section text-4xl leading-[.92] tracking-[-.05em] text-white md:text-6xl">Antes de crear, resolvemos tus dudas.</h2>
          <a href="mailto:guanchewear@gmail.com" className="group mt-10 inline-flex items-center gap-3 text-xs font-bold tracking-[.18em] text-gold">¿TIENES OTRA DUDA? ESCRÍBENOS <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a>
        </div>
        <div>
          {faqData.map((item, index) => {
            const expanded = open === index
            const panelId = `faq-panel-${index}`
            return <div key={item.question} className="border-t border-gold/10 last:border-b">
              <h3><button ref={(node) => { buttons.current[index] = node }} type="button" aria-expanded={expanded} aria-controls={panelId} onClick={() => setOpen(expanded ? null : index)} onKeyDown={(e) => handleKeys(e, index)} className="flex w-full items-center justify-between gap-5 py-7 text-left text-base font-semibold md:text-xl"><span className="text-white">{item.question}</span><Plus className={`h-5 w-5 shrink-0 transition-transform duration-300 text-gold ${expanded ? 'rotate-45' : ''}`} /></button></h3>
              <AnimatePresence initial={false}>{expanded && <motion.div id={panelId} role="region" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .32, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden"><p className="max-w-2xl pb-7 pr-10 text-sm leading-7 text-text-secondary md:text-base">{item.answer}</p></motion.div>}</AnimatePresence>
            </div>
          })}
        </div>
      </div>
    </section>
  )
}
