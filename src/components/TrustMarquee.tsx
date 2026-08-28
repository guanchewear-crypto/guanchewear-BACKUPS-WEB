interface TrustMarqueeProps {
  items: string[]
}

export function TrustMarquee({ items }: TrustMarqueeProps) {
  if (items.length === 0) return null

  const Row = ({ hidden = false }: { hidden?: boolean }) => (
    <div
      className="flex shrink-0 items-center"
      aria-hidden={hidden || undefined}
    >
      {items.map((item, index) => (
        <div key={`${item}-${index}`} className="flex shrink-0 items-center">
          <span className="px-5 text-xs font-semibold tracking-[0.24em] text-gold/75 sm:px-8 sm:text-sm">
            {item}
          </span>
          <span className="size-1.5 shrink-0 rounded-full bg-gold shadow-[0_0_6px_#D4A853]" />
        </div>
      ))}
    </div>
  )

  return (
    <div
      className="group overflow-hidden border-y border-gold/10 bg-bg-secondary py-5"
      role="region"
      aria-label="Valores de GuancheWear"
    >
      <style>{`
        @keyframes guanchewear-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .guanchewear-marquee { animation: guanchewear-marquee 40s linear infinite; }
        @media (hover: hover) { .group:hover .guanchewear-marquee { animation-play-state: paused; } }
        @media (prefers-reduced-motion: reduce) { .guanchewear-marquee { animation: none; } }
      `}</style>
      <div className="guanchewear-marquee flex w-max will-change-transform">
        <Row />
        <Row hidden />
      </div>
    </div>
  )
}

export default TrustMarquee
