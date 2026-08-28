import { ArrowDown, ArrowRight } from 'lucide-react'
import { SpotlightReveal } from './SpotlightReveal'

const trustItems = ['DISEÑOS ÚNICOS', 'PRODUCCIÓN EUROPEA', 'ENVÍO 2-4 DÍAS', 'ATENCIÓN PERSONAL']

export function Hero() {
  return <section id="inicio" className="relative min-h-[100svh] overflow-hidden bg-bg-primary text-white" aria-labelledby="hero-title">
    <div className="gw-image-enter absolute inset-0"><SpotlightReveal mainImage="/garments/monaco-riviera.svg" hiddenImage="/garments/monaco-lifestyle.svg" /></div>
    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.48),rgba(0,0,0,.08)_36%,rgba(0,0,0,.18)_60%,rgba(0,0,0,.8))]">
      {/* Gold glow at bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[30%] rounded-full bg-gold/5 blur-[120px]" />
    </div>
    <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col items-center px-5 pb-7 pt-28 text-center sm:px-8 sm:pt-32 lg:px-10">
      <div className="my-auto flex max-w-4xl flex-col items-center">
        <p className="gw-text-enter gw-delay-2 mb-5 text-[9px] tracking-[.28em] text-gold/70 sm:text-[10px]">GUANCHEWEAR CANARY ISLANDS / EUROPE</p>
        <h1 id="hero-title" className="gw-text-enter gw-delay-3 text-[clamp(3.4rem,9vw,8.5rem)] leading-[.82] tracking-[-.065em]">
          <span className="block font-display font-normal italic">Tu idea.</span>
          <span className="block font-sans font-extrabold text-gold">Tu diseño.</span>
        </h1>
        <p className="gw-text-enter gw-delay-4 mt-7 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">Describe lo que imaginas y lo convertimos en una prenda creada para representarte.</p>
        <p className="gw-text-enter gw-delay-5 mt-3 text-[9px] uppercase leading-4 tracking-[.16em] text-text-muted sm:text-[10px]">Diseños únicos. Producción europea. Envíos a toda Europa.</p>
        <div id="crear" className="gw-text-enter gw-delay-6 mt-7 flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <a href="#crear-diseno" className="pointer-events-auto flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-[10px] font-bold tracking-[.13em] text-text-contrast transition hover:-translate-y-0.5 hover:bg-gold-light">CREAR MI DISEÑO <ArrowRight size={15} /></a>
          <a href="#como-funciona" className="pointer-events-auto rounded-full border border-gold/35 bg-bg-primary/30 px-6 py-3.5 text-[10px] font-bold tracking-[.13em] backdrop-blur-sm hover:border-gold/60">VER CÓMO FUNCIONA</a>
        </div>
      </div>
      <div className="gw-text-enter gw-delay-7 mb-5 hidden items-center gap-3 text-[8px] tracking-[.18em] text-text-muted sm:flex lg:gap-5">{trustItems.map((item, i) => <span key={item} className="contents">{i > 0 && <span className="size-1.5 rounded-full bg-gold" />}<span>{item}</span></span>)}</div>
      <div className="gw-text-enter gw-delay-7 flex w-full items-end justify-between text-left">
        <p className="hidden max-w-[210px] text-[9px] uppercase leading-4 tracking-[.17em] text-text-muted md:block">Diseño independiente nacido entre el Atlántico y el Mediterráneo.</p>
        <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-gold/50" aria-hidden="true"><span className="text-[8px] tracking-[.24em]">SCROLL</span><ArrowDown className="gw-scroll size-[15px]" /></div>
        <div className="ml-auto text-right"><p className="text-[9px] tracking-[.18em] text-text-muted">01 / 03</p><p className="mt-1 font-display text-base italic tracking-wide sm:text-lg">MONACO RIVIERA</p></div>
      </div>
    </div>
  </section>
}
