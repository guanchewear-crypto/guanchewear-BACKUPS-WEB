import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { brandInfo } from '../data/collections'

type ProductType = 'camiseta' | 'sudadera'
type GarmentColor = 'Negro' | 'Blanco' | 'Azul marino' | 'Gris'

/* Printify mockup references — real product images from WP media */
const printifyMockups: Record<ProductType, Record<GarmentColor, string>> = {
  camiseta: {
    'Negro': 'https://guanchewear.es/wp-content/uploads/2026/08/modelo-1-guanchewear-city.webp',
    'Blanco': 'https://guanchewear.es/wp-content/uploads/2026/08/Diseno-personalizado.webp',
    'Azul marino': 'https://guanchewear.es/wp-content/uploads/2026/08/modelo-2-guanchewear-map.webp',
    'Gris': 'https://guanchewear.es/wp-content/uploads/2026/08/modelo-3-guanchewear-urban.webp',
  },
  sudadera: {
    'Negro': 'https://guanchewear.es/wp-content/uploads/2026/08/Sudaderas-personalizadas.webp',
    'Blanco': 'https://guanchewear.es/wp-content/uploads/2026/08/Diseno-personalizado-en-ropa.webp',
    'Azul marino': 'https://guanchewear.es/wp-content/uploads/2026/08/modelo-4-guanchewear-music.webp',
    'Gris': 'https://guanchewear.es/wp-content/uploads/2026/08/Ropa-de-marca-propia.webp',
  },
}

const products = brandInfo.products.map((item) => ({ ...item, price: `${item.price} €` }))
const sizes = brandInfo.sizes
const colors: { name: GarmentColor; value: string; contrast: string }[] = [
  { name: 'Negro', value: '#111214', contrast: '#f5f5f2' },
  { name: 'Blanco', value: '#f1f0eb', contrast: '#111214' },
  { name: 'Azul marino', value: '#14253d', contrast: '#f5f5f2' },
  { name: 'Gris', value: '#777b80', contrast: '#111214' },
]
const suggestions = ['Mi isla', 'Motor y velocidad', 'Un recuerdo', 'Mi frase favorita']

/* Printify mockup references — real product images for each garment/color combination */
const printifyMockups: Record<ProductType, Record<GarmentColor, string>> = {
  camiseta: {
    'Negro': 'https://guanchewear.es/wp-content/uploads/2026/08/modelo-1-guanchewear-city.webp',
    'Blanco': 'https://guanchewear.es/wp-content/uploads/2026/08/Diseno-personalizado.webp',
    'Azul marino': 'https://guanchewear.es/wp-content/uploads/2026/08/modelo-2-guanchewear-map.webp',
    'Gris': 'https://guanchewear.es/wp-content/uploads/2026/08/modelo-3-guanchewear-urban.webp',
  },
  sudadera: {
    'Negro': 'https://guanchewear.es/wp-content/uploads/2026/08/Sudaderas-personalizadas.webp',
    'Blanco': 'https://guanchewear.es/wp-content/uploads/2026/08/Diseno-personalizado-en-ropa.webp',
    'Azul marino': 'https://guanchewear.es/wp-content/uploads/2026/08/modelo-4-guanchewear-music.webp',
    'Gris': 'https://guanchewear.es/wp-content/uploads/2026/08/Ropa-de-marca-propia.webp',
  },
}

export function DesignStudioSection() {
  const [product, setProduct] = useState<ProductType>('camiseta')
  const [size, setSize] = useState('M')
  const [color, setColor] = useState<GarmentColor>('Negro')
  const [inspiration, setInspiration] = useState('')
  const [swatchScale, setSwatchScale] = useState<string | null>(null)

  const selectedColor = colors.find((item) => item.name === color) ?? colors[0]
  const charCount = inspiration.length

  return (
    <section id="crear-diseno" className="scroll-mt-16 bg-bg-primary px-5 py-24 text-white sm:px-8 lg:px-[7vw] lg:py-36" aria-labelledby="studio-title">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="label-section text-gold">ESTUDIO DE DISEÑO</p>
          <h2 id="studio-title" className="heading-section mt-5 text-white sm:text-6xl">
            Empieza a darle forma a tu idea.
          </h2>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-gold/10 bg-bg-secondary shadow-[0_0_60px_rgba(212,168,83,0.06)] lg:grid lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left: Controls */}
          <div className="p-6 sm:p-10 lg:p-12">
            <fieldset>
              <legend className="mb-3 text-[0.65rem] font-bold tracking-[0.2em] text-text-muted">PRENDA</legend>
              <div className="grid grid-cols-2 gap-2">
                {products.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setProduct(item.type)}
                    aria-pressed={product === item.type}
                    className={`group/option relative rounded-xl border p-4 text-left transition-all duration-300 ${
                      product === item.type
                        ? 'border-gold bg-gold/10 ring-1 ring-gold/30'
                        : 'border-border-subtle hover:border-gold/25'
                    }`}
                  >
                    <span className={`block text-sm font-bold transition-colors ${product === item.type ? 'text-gold' : 'text-white'}`}>
                      {item.label}
                    </span>
                    <span className="mt-1 block text-xs text-text-secondary">{item.price}</span>
                    {product === item.type && (
                      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gold/5 opacity-0 transition-opacity duration-300 group-hover/option:opacity-100" />
                    )}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-8">
              <legend className="mb-3 text-[0.65rem] font-bold tracking-[0.2em] text-text-muted">TALLA</legend>
              <div className="flex flex-wrap gap-2">
                {sizes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSize(item)}
                    aria-pressed={size === item}
                    className={`relative size-11 overflow-hidden rounded-full border text-xs font-bold transition-all duration-300 ${
                      size === item
                        ? 'border-gold bg-gold text-text-contrast shadow-[0_0_12px_rgba(212,168,83,0.3)]'
                        : 'border-border-subtle text-text-secondary hover:border-gold/40'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-8">
              <legend className="mb-3 text-[0.65rem] font-bold tracking-[0.2em] text-text-muted">COLOR · {color.toUpperCase()}</legend>
              <div className="flex flex-wrap gap-3">
                {colors.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setColor(item.name)
                      setSwatchScale(item.name)
                      setTimeout(() => setSwatchScale(null), 300)
                    }}
                    aria-label={item.name}
                    aria-pressed={color === item.name}
                    className={`relative size-10 overflow-hidden rounded-full border-2 p-1 transition-all duration-300 hover:scale-110 ${
                      color === item.name
                        ? 'border-gold ring-2 ring-gold/30'
                        : 'border-border-subtle'
                    }`}
                  >
                    {swatchScale === item.name && (
                      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-gold/30" />
                    )}
                    <span
                      className="block size-full rounded-full border border-white/10 transition-colors duration-300"
                      style={{ backgroundColor: item.value }}
                    />
                  </button>
                ))}
              </div>
            </fieldset>

            <label htmlFor="studio-inspiration" className="block text-[0.65rem] font-bold tracking-[0.2em] text-text-muted mt-8">
              TU INSPIRACIÓN
            </label>
            <div className="relative mt-3">
              <textarea
                id="studio-inspiration"
                value={inspiration}
                maxLength={120}
                onChange={(event) => setInspiration(event.target.value)}
                placeholder="Cuéntanos la idea, el recuerdo o el lugar que quieres llevar contigo…"
                className="w-full resize-y rounded-xl border border-border-subtle bg-bg-tertiary p-4 text-sm leading-relaxed text-text-primary outline-none transition-colors placeholder:text-text-muted/50 focus:border-gold/50"
                rows={4}
                aria-label="Describe tu inspiración para el diseño"
              />
              <div className={`mt-2 text-right text-[0.6rem] font-bold tracking-[0.1em] ${charCount > 100 ? 'text-red-400' : 'text-text-muted'}`}>
                {charCount} / 120
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setInspiration(suggestion)}
                  className="rounded-full border border-border-subtle px-3 py-1.5 text-[0.65rem] text-text-secondary transition-all duration-200 hover:border-gold/40 hover:text-gold hover:shadow-[0_0_8px_rgba(212,168,83,0.15)]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Mockup Preview with real Printify reference image */}
          <div className="relative order-first flex min-h-[440px] items-center justify-center overflow-hidden lg:order-none lg:min-h-[720px]">
            {/* Gold glow */}
            <div className="absolute size-[50%] rounded-full bg-gold/10 blur-[90px]" />

            {/* Real Printify reference image */}
            <div className="relative flex aspect-[4/5] w-full max-w-md items-center justify-center overflow-hidden rounded-[2rem] border border-border-subtle bg-bg-tertiary transition-all duration-500">
              <img
                src={printifyMockups[product][color]}
                alt={`Referencia ${product} en color ${color}`}
                className="h-full w-full object-cover transition-opacity duration-500"
              />

              {/* Design overlay text */}
              {inspiration && (
                <div
                  className="absolute left-1/2 top-[40%] w-[40%] -translate-x-1/2 text-center transition-all duration-500"
                  style={{ color: selectedColor.contrast }}
                >
                  <span className="block text-[0.5rem] font-black tracking-[0.3em] opacity-40">GUANCHEWEAR</span>
                  <span className="mt-0.5 block line-clamp-2 break-words text-[0.65rem] font-black uppercase sm:text-sm">
                    {inspiration}
                  </span>
                </div>
              )}

              {!inspiration && (
                <div className="absolute left-1/2 top-[40%] -translate-x-1/2 text-center opacity-20">
                  <span className="block text-[0.5rem] font-black tracking-[0.3em] text-white">TU IDEA AQUÍ</span>
                </div>
              )}

              {/* Bottom info bar */}
              <div className="absolute bottom-5 left-5 right-5 flex justify-between text-[0.55rem] font-bold tracking-[0.18em] text-text-muted/60">
                <span>{product === 'camiseta' ? 'CAMISETA' : 'SUDADERA'}</span>
                <span>TALLA {size}</span>
                <span className="text-gold/60">{color}</span>
              </div>
            </div>

            {/* Gold shimmer overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-gold/5 via-transparent to-transparent" />
          </div>

          {/* CTA Button - Full Width */}
          <div className="col-span-full">
            <a
              href="/diseno"
              className="group/btn relative flex min-h-16 items-center justify-between bg-gradient-to-r from-gold to-gold-light px-7 text-xs font-black tracking-[0.18em] text-text-contrast transition-all duration-300 hover:from-gold-light hover:to-gold shadow-[0_0_20px_rgba(212,168,83,0.2)] hover:shadow-[0_0_30px_rgba(212,168,83,0.4)]"
            >
              <span className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent" style={{ transform: 'translateX(-100%)', transition: 'transform 0.6s ease' }} />
              <span className="group-hover/btn:translate-x-[100%] transition-transform duration-600">CREAR MI DISEÑO</span>
              <ArrowUpRight className="size-5 transition-transform duration-300 group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DesignStudioSection