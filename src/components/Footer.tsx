import { ArrowUp, AtSign, Mail } from 'lucide-react'

const nav = [['INICIO', '#inicio'], ['DISEÑOS', '#disenos'], ['CÓMO FUNCIONA', '#como-funciona'], ['NOSOTROS', '#historia']]
const help = [['PREGUNTAS FRECUENTES', '#faq'], ['ENVÍOS', '#faq'], ['CAMBIOS Y DEVOLUCIONES', '#faq'], ['PRIVACIDAD', 'mailto:guanchewear@gmail.com?subject=Privacidad']]

const FooterLink = ({ href, children }: { href: string; children: string }) => (
  <a href={href} className="group relative w-fit text-sm text-text-muted transition-colors hover:text-gold">
    <span>{children}</span>
    <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-[width] duration-300 group-hover:w-full" />
  </a>
)

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-bg-primary px-5 pb-8 pt-20 text-white md:px-10 md:pt-28">
      {/* Gold divider glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div aria-hidden="true" className="pointer-events-none absolute -bottom-[13vw] -right-[4vw] animate-[pulse_12s_ease-in-out_infinite] text-[34vw] font-black leading-none tracking-[-.14em] text-text-muted">GW</div>
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-14 border-b border-gold/10 pb-20 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div><a href="#inicio" className="text-2xl font-extrabold tracking-[-.05em] text-white">GUANCHEWEAR</a><p className="mt-5 max-w-xs text-sm leading-6 text-text-secondary">TU IDEA. TU DISEÑO.<br />Prendas personalizadas creadas desde las Islas Canarias.</p><p className="mt-8 text-[10px] font-semibold tracking-[.28em] text-gold">GUANCHEWEAR ISLAS CANARIAS</p></div>
          <div><h3 className="mb-6 text-[10px] font-bold tracking-[.25em] text-text-muted">NAVEGACIÓN</h3><div className="flex flex-col gap-4">{nav.map(([label, href]) => <FooterLink key={label} href={href}>{label}</FooterLink>)}</div></div>
          <div><h3 className="mb-6 text-[10px] font-bold tracking-[.25em] text-text-muted">AYUDA</h3><div className="flex flex-col gap-4">{help.map(([label, href]) => <FooterLink key={label} href={href}>{label}</FooterLink>)}</div></div>
          <div><h3 className="mb-6 text-[10px] font-bold tracking-[.25em] text-text-muted">CONTACTO</h3><div className="flex flex-col gap-4"><a href="mailto:guanchewear@gmail.com" className="flex items-center gap-3 text-sm text-text-muted transition-colors hover:text-gold"><Mail className="h-4 w-4 transition-colors" />guanchewear@gmail.com</a><a href="https://instagram.com/guanchewear" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-text-muted transition-colors hover:text-gold"><AtSign className="h-4 w-4 transition-colors" />@guanchewear</a></div></div>
        </div>
        <div className="flex flex-col gap-6 pt-7 text-[10px] tracking-[.16em] text-text-muted sm:flex-row sm:items-center sm:justify-between"><p>© 2026 GUANCHEWEAR ISLAS CANARIAS · EUROPE</p><div className="flex items-center gap-6"><div aria-label="Selector de idioma" className="flex gap-3"><button className="text-gold" type="button">ES</button><span>/</span><button className="transition-colors hover:text-gold" type="button">EN</button></div><button type="button" aria-label="Volver arriba" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="border border-gold/20 p-3 text-white transition-all hover:border-gold/40 hover:bg-gold hover:text-text-contrast hover:shadow-[0_0_15px_rgba(212,168,83,0.2)]"><ArrowUp className="h-4 w-4" /></button></div></div>
      </div>
    </footer>
  )
}
