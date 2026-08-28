import { useEffect, useState } from 'react'
import { ArrowRight, Menu } from 'lucide-react'
import { MobileMenu } from './MobileMenu'

const links = [
  ['Inicio', '#inicio'],
  ['Cómo funciona', '#como-funciona'],
  ['Diseños', '#disenos'],
  ['Nuestra historia', '#historia'],
  ['FAQ', '#faq'],
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-[200] px-4 py-4 text-white transition-[background-color,backdrop-filter,border-color] duration-500 sm:px-6 lg:px-10 ${
          scrolled ? 'border-b border-gold/20 bg-bg-primary/90 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          <a href="#inicio" className="shrink-0 text-xl font-black leading-none tracking-[-.055em] sm:text-2xl" aria-label="GuancheWear, inicio">
            GUANCHE<span className="font-normal">WEAR</span>
          </a>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-gold/10 bg-white/[0.04] p-1 backdrop-blur-lg lg:flex" aria-label="Navegación principal">
            {links.map(([label, href]) => (
              <a key={href} href={href} className="rounded-full px-3.5 py-2 text-[10px] font-medium tracking-[0.08em] text-white/75 transition hover:bg-gold/10 hover:text-gold xl:px-4">
                {label}
              </a>
            ))}
          </nav>

          <a href="#crear-diseno" className="hidden min-h-11 items-center gap-2 rounded-full bg-gold px-5 py-3 text-[10px] font-bold tracking-[0.12em] text-text-contrast transition hover:-translate-y-0.5 hover:bg-gold-light md:flex">
            CREAR MI DISEÑO <ArrowRight size={14} />
          </a>
          <button type="button" onClick={() => setMenuOpen(true)} className="grid size-10 place-items-center rounded-full border border-gold/20 lg:hidden" aria-label="Abrir menú" aria-expanded={menuOpen}>
            <Menu size={20} />
          </button>
        </div>
      </header>
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
