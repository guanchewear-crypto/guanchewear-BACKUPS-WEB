import type { Collection } from '../data/collections'

interface CollectionPanelProps {
  collection: Collection
  index: number
  total: number
  isActive: boolean
}

export function CollectionPanel({
  collection,
  index,
  total,
  isActive,
}: CollectionPanelProps) {
  const words = collection.text.split(' ')

  return (
    <article
      className="relative flex h-full w-full shrink-0 items-center overflow-hidden px-5 py-20 text-white md:px-12 lg:px-[7vw]"
      style={{
        background: `radial-gradient(circle at 68% 42%, ${collection.accent}40 0%, transparent 34%), #0A0A0A`,
      }}
      aria-label={`${collection.name}, colección ${index + 1} de ${total}`}
    >
      <span
        className="pointer-events-none absolute right-[3vw] top-8 text-[clamp(7rem,20vw,18rem)] font-black leading-none text-transparent opacity-20"
        style={{ WebkitTextStroke: `1px ${collection.accentLight}` }}
        aria-hidden="true"
      >
        {collection.number}
      </span>

      <div className="relative z-10 grid w-full items-center gap-8 md:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <div className="order-2 max-w-xl md:order-1">
          <div className="mb-6 flex items-center gap-3 text-[0.65rem] font-bold tracking-[0.22em]">
            <span style={{ color: collection.accentLight }}>COLECCIÓN {collection.number}</span>
            <span className="h-px w-10" style={{ backgroundColor: collection.accent }} />
            <span className="text-white/40">{String(total).padStart(2, '0')}</span>
          </div>
          <h2 className="max-w-2xl text-4xl font-black leading-[0.92] tracking-[-0.05em] text-white sm:text-5xl lg:text-7xl">
            {collection.name}
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-text-secondary lg:text-lg">
            {words.map((word, wordIndex) => (
              <span
                key={`${word}-${wordIndex}`}
                className="mr-[0.3em] inline-block transition-[opacity,transform] duration-500"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(0.75rem)',
                  transitionDelay: `${Math.min(wordIndex * 22, 330)}ms`,
                }}
              >
                {word}
              </span>
            ))}
          </p>
          <div className="mt-7 flex flex-wrap gap-2">
            {collection.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border px-3 py-1.5 text-[0.6rem] font-bold tracking-[0.18em]"
                style={{ borderColor: `${collection.accentLight}70`, color: collection.accentLight }}
              >
                {tag}
              </span>
            ))}
          </div>
          <a
            href="#crear-diseno"
            className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full px-6 text-xs font-black tracking-[0.16em] text-text-contrast transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{ backgroundColor: collection.accent }}
          >
            CREAR ALGO ÚNICO
          </a>
        </div>

        <div className="order-1 flex min-h-0 items-center justify-center md:order-2">
          <div
            className="relative aspect-[4/5] h-[42vh] max-h-[680px] min-h-72 w-full max-w-xl overflow-hidden rounded-[2rem] border border-gold/10 md:h-[72vh]"
            style={{ backgroundColor: `${collection.accent}15` }}
          >
            <div className="absolute inset-10 rounded-full blur-3xl" style={{ backgroundColor: `${collection.accent}20` }} />
            <img
              src={collection.image}
              alt={`Prenda de la colección ${collection.name}`}
              className="relative size-full object-contain p-4 transition duration-700 ease-out"
              style={{ transform: isActive ? 'scale(1)' : 'scale(.94)', opacity: isActive ? 1 : 0.65 }}
            />
          </div>
        </div>
      </div>
    </article>
  )
}

export default CollectionPanel
