import { useRef, type MouseEvent } from 'react'
import { MessageCircle, Recycle, Shield, Sparkles, type LucideIcon } from 'lucide-react'
import { valuesData } from '../data/collections'

const icons: Record<string, LucideIcon> = { MessageCircle, Recycle, Shield, Sparkles }

export default function ValuesSection() {
  return (
    <section className="bg-bg-primary px-5 py-24 text-text-primary md:px-10 md:py-36" aria-labelledby="values-title">
      <div className="mx-auto max-w-7xl">
        <p className="label-section mb-5 text-text-muted">NUESTROS PRINCIPIOS</p>
        <h2 id="values-title" className="heading-section mb-14 max-w-4xl text-white md:mb-20 md:text-7xl">
          Lo que no negociamos.
        </h2>
        <div className="grid md:grid-cols-2">
          {valuesData.map((value) => <ValueCard key={value.number} {...value} />)}
        </div>
      </div>
    </section>
  )
}

function ValueCard({ number, title, description, icon }: (typeof valuesData)[number]) {
  const card = useRef<HTMLDivElement>(null)
  const Icon = icons[icon] ?? Sparkles

  const track = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--x', `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty('--y', `${event.clientY - bounds.top}px`)
  }

  return (
    <div ref={card} onMouseMove={track} className="group relative overflow-hidden border border-gold/10 p-7 transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-[6px] hover:border-gold/30 hover:shadow-[0_18px_60px_rgba(212,168,83,.10)] md:p-11">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(420px circle at var(--x,50%) var(--y,50%), rgba(212,168,83,.13), transparent 45%)' }} />
      <div className="relative flex items-start justify-between">
        <span className="text-xs tracking-[.25em] text-text-muted">{number}</span>
        <Icon aria-hidden="true" className="h-6 w-6 stroke-[1.4] text-gold transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
      </div>
      <div className="relative mt-20 md:mt-28">
        <h3 className="text-xl font-bold tracking-[-.02em] text-white md:text-2xl">{title}</h3>
        <p className="mt-4 max-w-md text-sm leading-7 text-text-secondary md:text-base">{description}</p>
      </div>
    </div>
  )
}
