import { useState } from 'react'
import { ArrowUpRight, Shirt } from 'lucide-react'
import { brandInfo } from '../data/collections'

type ProductType = 'camiseta' | 'sudadera'
type GarmentColor = 'Negro' | 'Blanco' | 'Azul marino' | 'Gris'

const products = brandInfo.products.map((item) => ({ ...item, price: `${item.price} €` }))
const sizes = brandInfo.sizes
const colors: { name: GarmentColor; value: string; contrast: string }[] = [
  { name: 'Negro', value: '#111214', contrast: '#f5f5f2' },
  { name: 'Blanco', value: '#f1f0eb', contrast: '#111214' },
  { name: 'Azul marino', value: '#14253d', contrast: '#f5f5f2' },
  { name: 'Gris', value: '#777b80', contrast: '#111214' },
]
const suggestions = ['Mi isla', 'Motor y velocidad', 'Un recuerdo', 'Mi frase favorita']

export function DesignStudioSection() {
  const [product, setProduct] = useState<ProductType>('camiseta')
  const [size, setSize] = useState('M')
  const [color, setColor] = useState<GarmentColor>('Negro')
  const [inspiration, setInspiration] = useState('')
  const selectedColor = colors.find((item) => item.name === color) ?? colors[0]

  return (
    <section id="crear-diseno" className="scroll-mt-16 bg-bg-primary px-5 py-24 text-white sm:px-8 lg:px-[7vw] lg:py-36" aria-labelledby="studio-title">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="label-section text-gold">ESTUDIO DE DISEÑO</p>
          <h2 id="studio-title" className="heading-section mt-5 text-white sm:text-6xl">
            Empieza a darle forma a tu idea.
          </h2>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-gold/10 bg-bg-secondary lg:grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="p-6 sm:p-10 lg:p-12">
            <fieldset>
              <legend className="mb-3 text-[0.65rem] font-bold tracking-[0.2em] text-text-muted">PRENDA</legend>
              <div className="grid grid-cols-2 gap-2">
                {products.map((item) => (
                  <button key={item.type} type="button" onClick={() => setProduct(item.type)} aria-pressed={product === item.type} className={`rounded-xl border p-4 text-left transition-all ${product === item.type ? 'border-gold bg-gold/10 ring-1 ring-gold/30' : 'border-border-subtle hover:border-gold/25'}`}>
                    <span className="block text-sm font-bold text-white">{item.label}</span>
                    <span className="mt-1 block text-xs text-text-secondary">{item.price}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-8">
              <legend className="mb-3 text-[0.65rem] font-bold tracking-[0.2em] text-text-muted">TALLA</legend>
              <div className="flex flex-wrap gap-2">
                {sizes.map((item) => (
                  <button key={item} type="button" onClick={() => setSize(item)} aria-pressed={size === item} className={`size-11 rounded-full border text-xs font-bold transition-all ${size === item ? 'border-gold bg-gold text-text-contrast' : 'border-border-subtle text-text-secondary hover:border-gold/40'}`}>
                    {item}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-8">
              <legend className="mb-3 text-[0.65rem] font-bold tracking-[0.2em] text-text-muted">COLOR · {color.toUpperCase()}</legend>
              <div className="flex flex-wrap gap-3">
                {colors.map((item) => (
                  <button key={item.name} type="button" onClick={() => setColor(item.name)} aria-label={item.name} aria-pressed={color === item.name} className={`size-9 rounded-full border-2 p-1 transition-transform hover:scale-110 ${color === item.name ? 'border-gold ring-2 ring-gold/30' : 'border-border-subtle'}`}>
                    <span className="block size-full rounded-full border border-white/10" style={{ backgroundColor: item.value }} />
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="mt-8 block text-[0.65rem] font-bold tracking-[0.2em] text-text-muted" htmlFor="studio-inspiration">TU INSPIRACIÓN</label>
            <textarea id="studio-inspiration" value={inspiration} maxLength={120} onChange={(event) => setInspiration(event.target.value)} placeholder="Cuéntanos la idea, el recuerdo o el lugar que quieres llevar contigo…" className="mt-3 min-h-32 w-full resize-y rounded-xl border border-border-subtle bg-bg-tertiary p-4 text-sm leading-relaxed text-text-primary outline-none transition-colors placeholder:text-text-muted/50 focus:border-gold/50" />
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button key={suggestion} type="button" onClick={() => setInspiration(suggestion)} className="rounded-full border border-border-subtle px-3 py-1.5 text-[0.65rem] text-text-secondary transition-colors hover:border-gold/40 hover:text-gold">
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="relative order-first flex min-h-[440px] items-center justify-center overflow-hidden border-b border-border-subtle p-8 lg:order-none lg:min-h-[720px] lg:border-b-0 lg:border-l">
            {/* Gold glow */}
            <div className="absolute size-[50%] rounded-full bg-gold/10 blur-[90px]" />
            <div className="relative flex aspect-[4/5] w-full max-w-md items-center justify-center rounded-[2rem] border border-border-subtle bg-bg-tertiary">
              <Shirt className="h-auto w-[72%] transition-[color,fill] duration-700 ease-out" style={{ color: selectedColor.value, fill: selectedColor.value }} strokeWidth={0.65} />
              <div className="absolute left-1/2 top-[43%] w-[34%] -translate-x-1/2 text-center transition-colors duration-700" style={{ color: selectedColor.contrast }}>
                <span className="block text-[0.55rem] font-black tracking-[0.25em] opacity-60">GUANCHEWEAR</span>
                <span className="mt-1 block line-clamp-3 break-words text-sm font-black uppercase sm:text-base">{inspiration || 'TU IDEA'}</span>
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex justify-between text-[0.6rem] font-bold tracking-[0.18em] text-text-muted">
                <span>{product.toUpperCase()}</span><span>TALLA {size}</span>
              </div>
            </div>
          </div>

          <a href="/diseno" className="group col-span-full flex min-h-16 items-center justify-between bg-gold px-7 text-xs font-black tracking-[0.18em] text-text-contrast transition-all hover:bg-gold-light sm:px-10">
            CREAR MI DISEÑO <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default DesignStudioSection
