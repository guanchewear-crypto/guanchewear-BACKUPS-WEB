import { ArrowDown, ArrowRight } from 'lucide-react'
import { MagneticButton } from './MagneticButton'
import { SpotlightReveal } from './SpotlightReveal'

const trustItems = ['DISEÑOS ÚNICOS', 'PRODUCCIÓN EUROPEA', 'ENVÍO 2-4 DÍAS', 'ATENCIÓN PERSONAL']

export function Hero() {
  return (
    <section id="inicio" className="relative min-h-[100svh] overflow-hidden bg-bg-primary text-white" aria-labelledby="hero-title">
      <div className="gw-image-enter absolute inset-0">
        <SpotlightReveal mainImage="/garments/monaco-riviera.svg" hiddenImage="/garments/monaco-lifestyle.svg" />
      </div>

      {/* Overlay with gold glow */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.48),rgba(0,0,0,.08)_36%,rgba(0,0,0,.18)_60%,rgba(0,0,0,.8))]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[30%] rounded-full bg-gold/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col items-center px-5 pb-7 pt-28 text-center sm:px-8 sm:pt-32 lg:px-10">
        <div className="my-auto flex max-w-4xl flex-col items-center">
          {/* Brand label */}
          <p className="gw-text-enter gw-delay-2 mb-5 flex items-center gap-3 text-[9px] tracking-[.28em] text-gold/70 sm:text-[10px]">
            <span className="hidden h-px w-5 bg-gold/40 sm:inline-block" />
            GUANCHEWEAR CANARY ISLANDS / EUROPE
            <span className="hidden h-px w-5 bg-gold/40 sm:inline-block" />
          </p>

          {/* Hero Title with RevealText */}
          <h1 id="hero-title" className="gw-text-enter gw-delay-3 text-[clamp(3.4rem,9vw,8.5rem)] leading-[.82] tracking-[-.065em]">
            <span className="block font-display font-normal italic text-white">
              <span className="reveal-word"><span className="inline-block overflow-hidden"><span className="inline-block animate-[reveal-word_0.7s_cubic-bezier(0.22,1,0.36,1)_both]" style={{ '--reveal-from': 'inset(100% 0 0 0)' } as React.CSSProperties}>Tu idea.</span></span></span>
            </span>
            <span className="block font-sans font-extrabold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent transition-[background-position] duration-600" style={{ backgroundSize: '200% auto' }} onMouseEnter={e => (e.target as HTMLElement).style.backgroundPosition = 'right center'} onMouseLeave={e => (e.target as HTMLElement).style.backgroundPosition = 'left center'}>
              <span className="reveal-word"><span className="inline-block overflow-hidden"><span className="inline-block animate-[reveal-word_0.7s_cubic-bezier(0.22,1,0.36,1)_0.15s_both]" style={{ '--reveal-from': 'inset(100% 0 0 0)' } as React.CSSProperties}>Tu diseño.</span></span></span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="gw-text-enter gw-delay-4 mt-7 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
            Describe lo que imaginas y lo convertimos en una prenda creada para representarte.
          </p>

          {/* Tagline with gold shimmer */}
          <p className="gw-text-enter gw-delay-5 mt-3 text-[9px] uppercase leading-4 tracking-[.16em] text-text-muted sm:text-[10px]">
            Diseños únicos. <span className="text-gold/60">Producción europea.</span> Envíos a toda Europa.
          </p>

          {/* CTA Buttons with Magnetic effect */}
          <div className="gw-text-enter gw-delay-6 mt-8 flex w-full max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <MagneticButton href="#crear-diseno" variant="primary">
              <span className="flex items-center gap-2 text-[10px] font-black tracking-[.13em]">
                CREAR MI DISEÑO <ArrowRight size={14} />
              </span>
            </MagneticButton>
            <MagneticButton href="#como-funciona" variant="secondary">
              <span className="flex items-center gap-2 text-[10px] font-bold tracking-[.13em]">VER CÓMO FUNCIONA</span>
            </MagneticButton>
          </div>
        </div>

        {/* Top Trust Bar */}
        <div className="gw-text-enter gw-delay-7 mb-5 hidden items-center gap-3 text-[8px] tracking-[.18em] text-text-muted sm:flex lg:gap-5">
          {trustItems.map((item, i) => (
            <span key={item} className="contents">
              {i > 0 && <span className="size-1.5 rounded-full bg-gold shadow-[0_0_6px_#D4A853]" />}
              <span>{item}</span>
            </span>
          ))}
        </div>

        {/* Bottom info bar */}
        <div className="gw-text-enter gw-delay-7 flex w-full items-end justify-between text-left">
          <p className="hidden max-w-[210px] text-[9px] uppercase leading-4 tracking-[.17em] text-text-muted md:block">
            Diseño independiente nacido entre el Atlántico y el Mediterráneo.
          </p>

          {/* Scroll Indicator */}
          <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2" aria-hidden="true">
            <span className="text-[8px] tracking-[.24em] text-gold/50">SCROLL</span>
            <div className="relative flex size-[30px] items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-gold/20" />
              <ArrowDown className="relative z-10 size-[15px] text-gold/60" />
            </div>
          </div>

          {/* Collection label */}
          <div className="ml-auto text-right">
            <p className="text-[9px] tracking-[.18em] text-text-muted">01 / 03</p>
            <p className="mt-1 font-display text-base italic tracking-wide text-gold/70 sm:text-lg">MONACO RIVIERA</p>
          </div>
        </div>
      </div>
    </section>
  )
}
