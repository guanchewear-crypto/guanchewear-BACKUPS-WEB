import { ArrowUpRight } from 'lucide-react'
import { galleryTileImages } from '../data/collections'

const tiles = [
  { c: 0, label: 'MONACO RIVIERA', cls: 'md:col-span-7 md:row-span-2', pos: 'center' },
  { c: 1, label: 'FRONT PRINT', cls: 'md:col-span-5', pos: 'top' },
  { c: 2, label: 'PUERTO RICO', cls: 'md:col-span-5 md:row-span-2', pos: 'center' },
  { c: 1, label: 'MONACO LIFESTYLE', cls: 'md:col-span-4', pos: '55% 30%' },
  { c: 0, label: 'BACK PRINT', cls: 'md:col-span-3', pos: '50% 70%' },
  { c: 2, label: 'ISLAND EDITION', cls: 'md:col-span-4', pos: 'top' },
  { c: 0, label: 'RIVIERA NIGHTS', cls: 'md:col-span-5', pos: '50% 35%' },
  { c: 1, label: 'DETAIL 02', cls: 'md:col-span-3', pos: 'bottom' },
  { c: 2, label: 'FRONT PRINT', cls: 'md:col-span-4', pos: 'center' },
]

export function ProductVisual({ src, alt, position = 'center', index = 0, ariaHidden }: { src: string; alt: string; position?: string; index?: number; ariaHidden?: boolean }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="eager"
      decoding="async"
      aria-hidden={ariaHidden ? 'true' : undefined}
      className={`h-full w-full object-cover p-4 transition-transform duration-700 ease-out group-hover:scale-[1.04] md:p-7 gw-image-enter gw-delay-${Math.min(index + 2, 7)}`}
      style={{ objectPosition: position }}
    />
  )
}

export default function GallerySection() {
  return (
    <section
      id="disenos"
      className="scroll-mt-16 bg-bg-primary px-5 py-24 text-text-primary md:px-10 md:py-36"
      aria-labelledby="gallery-title"
    >
      <div className="mx-auto max-w-7xl">
        <p className="label-section mb-5 text-gold">COLECCIONES</p>
        <h2 id="gallery-title" className="heading-section mb-14 max-w-5xl text-white md:mb-20 md:text-7xl">Ideas que se convierten en identidad.</h2>
        <div className="grid auto-rows-[260px] grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-12 md:auto-rows-[230px]">
          {tiles.map((tile, index) => (
            <a
              href="#crear-diseno"
              key={`${tile.label}-${index}`}
              className={`group relative overflow-hidden bg-bg-tertiary ${tile.cls} cursor-[crosshair]`}
              role="link"
              aria-label={`Crear diseño inspirado en ${tile.label}`}
            >
              <ProductVisual
                src={galleryTileImages[index]}
                alt=""
                ariaHidden={true}
                position={tile.pos}
                index={index}
              />
              {/* All visual content inside the link is hidden from AT — aria-label is the accessible name */}
              <span className="absolute left-5 top-5 text-[10px] tracking-[.25em] text-text-muted" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div className="absolute inset-x-5 bottom-5 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" aria-hidden="true">
                <p className="text-[10px] tracking-[.28em] text-gold/60">VER DISEÑO</p>
                <p className="mt-2 flex items-end justify-between text-lg font-semibold text-white">
                  {tile.label}
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </p>
              </div>
              {/* Gold border glow on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-none opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ boxShadow: 'inset 0 0 0 1px rgba(212,168,83,0.3)' }}
              />
            </a>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <a
            href="#crear-diseno"
            className="group inline-flex items-center gap-4 border border-gold/30 px-7 py-4 text-xs font-bold tracking-[.18em] text-gold transition-all duration-500 hover:border-gold hover:shadow-[0_0_30px_rgba(212,168,83,0.2)] hover:bg-gold hover:text-text-contrast"
          >
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            CREAR MI DISEÑO
          </a>
        </div>
      </div>
    </section>
  )
}