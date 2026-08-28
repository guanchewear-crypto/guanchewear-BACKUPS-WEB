import { ArrowRight, Menu } from 'lucide-react'

export function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed inset-0 z-[199] bg-bg-primary/98 backdrop-blur-xl transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      aria-modal="true"
      role="dialog"
    >
      <div className="flex h-full flex-col items-center justify-center gap-10">
        <button type="button" onClick={onClose} className="absolute right-6 top-6 rounded-full border border-gold/20 p-3 text-gold transition-colors hover:bg-gold/10">
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
