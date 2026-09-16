import { ArrowUpRight } from 'lucide-react'
import { galleryTileImages, galleryTileLabels } from '../data/collections'

/**
 * Two designs per row: each tile takes 6 of the 12 columns over 2 rows, which
 * is the only size that both fills the grid exactly (no empty cells) and lands
 * on the 4:3 aspect of the artwork, so each board is shown whole and at a size
 * where it can actually be read. scripts/check-gallery-grid.py verifies both
 * properties - keep them true when editing this.
 */
const TILE_SPAN = 'md:col-span-6 md:row-span-2'

export function ProductVisual({ src, alt, index = 0, ariaHidden }: { src: string; alt: string; index?: number; ariaHidden?: boolean }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="eager"
      decoding="async"
      aria-hidden={ariaHidden ? 'true' : undefined}
      className={`h-full w-full object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-[1.04] md:p-7 gw-image-enter gw-delay-${Math.min(index + 2, 7)}`}
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
        {/* Row height tracks the viewport so the 3/6-column tiles keep the 4:3
            artwork aspect across desktop widths, instead of only at max-w-7xl. */}
        <div className="grid auto-rows-[260px] grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-12 md:auto-rows-[clamp(170px,17vw,235px)]">
          {galleryTileImages.map((img, index) => (
            <a
              href="#crear-diseno"
              key={`${galleryTileLabels[index]}-${index}`}
              className={`group relative overflow-hidden bg-bg-tertiary ${TILE_SPAN} cursor-[crosshair]`}
              role="link"
              aria-label={`Ver diseño: ${galleryTileLabels[index]}`}
            >
              <ProductVisual
                src={img}
                alt=""
                ariaHidden={true}
                index={index}
              />
              <span className="absolute left-5 top-5 text-[10px] tracking-[.25em] text-text-muted" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div className="absolute inset-x-5 bottom-5 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" aria-hidden="true">
                <p className="text-[10px] tracking-[.28em] text-gold/60">VER DISEÑO</p>
                <p className="mt-2 flex items-end justify-between text-lg font-semibold text-white">
                  {galleryTileLabels[index]}
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </p>
              </div>
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