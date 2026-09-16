import { useState } from 'react'
import { ArrowUpRight, AtSign, Check, MessageCircle, Send } from 'lucide-react'
import { brandInfo } from '../data/collections'
import { garmentCatalog, type Garment, type GarmentType } from '../data/garments'
import { buildInstagramHandoff, buildOrderMessage, buildWhatsAppUrl } from '../data/orderMessage'

type ProductType = GarmentType

const garmentsByType: Record<ProductType, Garment[]> = {
  camiseta: garmentCatalog.filter((item) => item.type === 'camiseta'),
  sudadera: garmentCatalog.filter((item) => item.type === 'sudadera'),
}

const defaultGarmentFor = (type: ProductType) =>
  garmentsByType[type].find((item) => item.colorKey === 'black') ?? garmentsByType[type][0]!

const initialGarment = defaultGarmentFor('camiseta')
const products = brandInfo.products.map((item) => ({
  ...item,
  price: `${item.price} €`,
  count: garmentsByType[item.type].length,
}))
const sizes = brandInfo.sizes
const suggestions = ['Mi isla', 'Motor y velocidad', 'Un recuerdo', 'Mi frase favorita']

export function DesignStudioSection() {
  const [selectedGarmentId, setSelectedGarmentId] = useState(initialGarment.id)
  const [size, setSize] = useState('M')
  const [inspiration, setInspiration] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [copied, setCopied] = useState(false)

  const selectedGarment = garmentCatalog.find((item) => item.id === selectedGarmentId) ?? initialGarment
  const product = selectedGarment.type
  const visibleGarments = garmentsByType[product]
  const charCount = inspiration.length

  const orderMessage = buildOrderMessage({
    garment: selectedGarment,
    size,
    inspiration,
    customerName,
  })
  const whatsappUrl = buildWhatsAppUrl(orderMessage)
  const instagram = buildInstagramHandoff(orderMessage)
  const ideaMissing = inspiration.trim().length === 0

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      const helper = document.createElement('textarea')
      helper.value = text
      helper.setAttribute('readonly', '')
      helper.style.position = 'fixed'
      helper.style.opacity = '0'
      document.body.appendChild(helper)
      helper.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(helper)
      return ok
    }
  }

  const handleInstagram = async () => {
    await copyToClipboard(orderMessage)
    setCopied(true)
    window.open(instagram.dmUrl, '_blank', 'noopener,noreferrer')
    window.setTimeout(() => setCopied(false), 6000)
  }

  const handleProductChange = (type: ProductType) => {
    setSelectedGarmentId(defaultGarmentFor(type).id)
  }

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
                    onClick={() => handleProductChange(item.type)}
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
                    <span className="mt-1 block text-xs text-text-secondary">{item.price} · {item.count} colores</span>
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
              <legend className="mb-3 text-[0.65rem] font-bold tracking-[0.2em] text-text-muted">
                MODELO Y COLOR · {selectedGarment.color.toUpperCase()}
              </legend>
              <div className="grid max-h-[30rem] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3" aria-label={`Colores de ${selectedGarment.label}`}>
                {visibleGarments.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedGarmentId(item.id)}
                    aria-label={`${item.label} ${item.color}`}
                    aria-pressed={selectedGarment.id === item.id}
                    className={`group/garment relative overflow-hidden rounded-xl border text-left transition-all duration-300 hover:-translate-y-0.5 ${
                      selectedGarment.id === item.id
                        ? 'border-gold bg-gold/10 ring-1 ring-gold/30'
                        : 'border-border-subtle bg-bg-tertiary/50 hover:border-gold/40'
                    }`}
                  >
                    <span className="relative block aspect-square overflow-hidden bg-bg-tertiary">
                      <img
                        src={item.thumbnail}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-contain p-1 transition-transform duration-500 group-hover/garment:scale-105"
                      />
                      <span
                        className="absolute bottom-2 right-2 size-3 rounded-full border border-white/50 shadow-sm"
                        style={{ backgroundColor: item.swatch }}
                        aria-hidden="true"
                      />
                    </span>
                    <span className={`block truncate px-2 py-2 text-[0.65rem] font-bold ${selectedGarment.id === item.id ? 'text-gold' : 'text-text-secondary'}`}>
                      {item.color}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[0.6rem] tracking-[0.08em] text-text-muted">
                {visibleGarments.length} colores disponibles · selecciona una prenda para previsualizarla
              </p>
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
                src={selectedGarment.image}
                alt={`Referencia ${selectedGarment.label} en color ${selectedGarment.color}`}
                className="h-full w-full scale-[0.85] object-cover transition-opacity duration-500"
              />

              {/* Design overlay text */}
              {inspiration && (
                <div
                  className="absolute left-1/2 top-[40%] w-[40%] -translate-x-1/2 text-center transition-all duration-500"
                  style={{ color: selectedGarment.contrast }}
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
                <span className="text-gold/60">{selectedGarment.color}</span>
              </div>
            </div>

            {/* Gold shimmer overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-gold/5 via-transparent to-transparent" />
          </div>

          {/* Order form — every field auto-filled from the personalizer above */}
          <div className="col-span-full border-t border-gold/10 p-6 sm:p-10 lg:p-12">
            <p className="label-section text-gold">RESUMEN Y ENVÍO</p>
            <h3 className="heading-section mt-4 text-white sm:text-4xl">Envía tu idea con todo relleno.</h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
              Estos datos se completan solos con lo que has elegido arriba. Revísalos, añade tu nombre si quieres y envíanoslo: recibimos tu prenda, tu talla, tu color y tu idea en un solo mensaje.
            </p>

            <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr]">
              {/* Auto-filled summary */}
              <div className="rounded-2xl border border-border-subtle bg-bg-tertiary p-5">
                <div className="mx-auto flex aspect-square w-full max-w-[180px] items-center justify-center overflow-hidden rounded-xl bg-bg-secondary">
                  <img
                    src={selectedGarment.thumbnail}
                    alt={`${selectedGarment.label} en color ${selectedGarment.color}`}
                    className="h-full w-full object-contain p-2"
                  />
                </div>
                <dl className="mt-5 flex flex-col gap-2.5 text-xs">
                  {[
                    ['PRENDA', selectedGarment.label],
                    ['COLOR', selectedGarment.color],
                    ['TALLA', size],
                    ['PRECIO', `${selectedGarment.price} €`],
                    ['REFERENCIA', selectedGarment.id],
                  ].map(([term, value]) => (
                    <div key={term} className="flex items-baseline justify-between gap-3 border-b border-white/5 pb-2 last:border-0">
                      <dt className="tracking-[0.16em] text-text-muted">{term}</dt>
                      <dd className="text-right font-bold text-white">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Editable fields bound to the same state */}
              <div className="flex flex-col gap-5">
                <div>
                  <label htmlFor="order-name" className="block text-[0.65rem] font-bold tracking-[0.2em] text-text-muted">
                    TU NOMBRE (OPCIONAL)
                  </label>
                  <input
                    id="order-name"
                    type="text"
                    value={customerName}
                    maxLength={60}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Cómo quieres que te llamemos"
                    className="mt-3 w-full rounded-xl border border-border-subtle bg-bg-tertiary px-4 py-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted/50 focus:border-gold/50"
                  />
                </div>

                <div>
                  <label htmlFor="order-idea" className="block text-[0.65rem] font-bold tracking-[0.2em] text-text-muted">
                    TU IDEA
                  </label>
                  <textarea
                    id="order-idea"
                    value={inspiration}
                    maxLength={120}
                    rows={3}
                    onChange={(event) => setInspiration(event.target.value)}
                    placeholder="Un recuerdo, un símbolo, una frase, un lugar…"
                    className="mt-3 w-full resize-y rounded-xl border border-border-subtle bg-bg-tertiary p-4 text-sm leading-relaxed text-text-primary outline-none transition-colors placeholder:text-text-muted/50 focus:border-gold/50"
                  />
                  <p className="mt-2 text-[0.6rem] tracking-[0.08em] text-text-muted">
                    Se sincroniza con el personalizador de arriba · {charCount} / 120
                  </p>
                </div>

                {/* Exact payload preview */}
                <div>
                  <p className="text-[0.65rem] font-bold tracking-[0.2em] text-text-muted">MENSAJE QUE ENVIAREMOS</p>
                  <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap rounded-xl border border-border-subtle bg-bg-secondary p-4 text-[0.7rem] leading-relaxed text-text-secondary">{orderMessage}</pre>
                </div>

                {ideaMissing && (
                  <p className="text-xs text-gold/80" role="status">
                    Añade tu idea arriba para que nos llegue completa. Si lo envías así, aparecerá como «por definir».
                  </p>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/send inline-flex min-h-14 flex-1 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-gold to-gold-light px-6 text-xs font-black tracking-[0.18em] text-text-contrast shadow-[0_0_20px_rgba(212,168,83,0.2)] transition-all duration-300 hover:from-gold-light hover:to-gold hover:shadow-[0_0_30px_rgba(212,168,83,0.4)]"
                  >
                    <MessageCircle className="size-5" />
                    ENVIAR POR WHATSAPP
                    <Send className="size-4 transition-transform duration-300 group-hover/send:translate-x-1" />
                  </a>
                  <button
                    type="button"
                    onClick={handleInstagram}
                    className="inline-flex min-h-14 flex-1 items-center justify-center gap-3 rounded-xl border border-gold/30 px-6 text-xs font-black tracking-[0.18em] text-gold transition-all duration-300 hover:border-gold hover:bg-gold/10"
                  >
                    {copied ? <Check className="size-5" /> : <AtSign className="size-5" />}
                    {copied ? 'COPIADO · ABRIENDO INSTAGRAM' : 'ENVIAR POR INSTAGRAM'}
                  </button>
                </div>

                <p aria-live="polite" className="min-h-4 text-[0.65rem] tracking-[0.08em] text-text-muted">
                  {copied
                    ? 'Mensaje copiado al portapapeles: pégalo en el chat de Instagram que se acaba de abrir.'
                    : 'WhatsApp abre el chat con todo escrito. Instagram no permite rellenar el mensaje, así que te lo copiamos para que lo pegues.'}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button - Full Width */}
          <div className="col-span-full">
            <a
              href="#crear-diseno"
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