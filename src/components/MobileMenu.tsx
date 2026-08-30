import { Menu } from 'lucide-react'

export function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed inset-0 z-[199] bg-bg-primary/98 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-modal="true"
      role="dialog"
      aria-label="Menú de navegación"
      aria-labelledby="mobile-menu-title"
    >
      <span id="mobile-menu-title" className="sr-only">Menú de navegación</span>
      <div className={`flex h-full flex-col items-center justify-center gap-10 transition-transform duration-500 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-4'}`}>
        <button type="button" onClick={onClose} className="absolute right-6 top-6 rounded-full border border-gold/20 p-3 text-gold transition-all duration-300 hover:border-gold/40 hover:bg-gold/10 hover:shadow-[0_0_15px_rgba(212,168,83,0.2)]" aria-label="Cerrar menú">
          <Menu className="-rotate-90" size={20} />
        </button>
        <nav className="flex flex-col items-center gap-6">
          {[
            ['INICIO', '#inicio'],
            ['CÓMO FUNCIONA', '#como-funciona'],
            ['DISEÑOS', '#disenos'],
            ['NUESTRA HISTORIA', '#historia'],
            ['FAQ', '#faq'],
          ].map(([label, href]) => (
            <a key={href} href={href} onClick={onClose} className="text-xl font-bold tracking-[.15em] text-text-secondary transition-colors hover:text-gold">
              {label}
            </a>
          ))}
          <a href="#crear-diseno" onClick={onClose} className="mt-4 rounded-full bg-gold px-8 py-4 text-xs font-bold tracking-[.18em] text-text-contrast transition-all hover:bg-gold-light hover:scale-105">
            CREAR MI DISEÑO
          </a>
        </nav>
        <p className="mt-12 text-[10px] tracking-[.25em] text-text-muted">GUANCHEWEAR ISLAS CANARIAS</p>
      </div>
    </div>
  )
}
