import assert from 'node:assert/strict'
import { buildOrderMessage, buildWhatsAppUrl, buildInstagramHandoff, WHATSAPP_NUMBER, INSTAGRAM_HANDLE } from '../src/data/orderMessage.ts'

const garment = {
  id: 'sudadera-navy',
  type: 'sudadera',
  label: 'Sudadera',
  price: 35,
  colorKey: 'navy',
  color: 'Azul marino',
  swatch: '#14253D',
  contrast: '#F5F5F2',
  image: '/garments/sudadera-navy.webp',
  thumbnail: '/garments/sudadera-navy-thumb.webp',
}

// 1. Message carries every customization
const message = buildOrderMessage({ garment, size: 'L', inspiration: 'Un drago canario sobre el Teide al atardecer' })
assert.match(message, /Sudadera/, 'must include garment label')
assert.match(message, /Azul marino/, 'must include color')
assert.match(message, /Talla: L/, 'must include size')
assert.match(message, /35 €/, 'must include price')
assert.match(message, /sudadera-navy/, 'must include reference id')
assert.ok(message.includes('Un drago canario sobre el Teide al atardecer'), 'must include the idea verbatim')

// 2. Optional customer name
const named = buildOrderMessage({ garment, size: 'M', inspiration: 'Mi isla', customerName: 'Nauzet' })
assert.match(named, /Nauzet/, 'must include customer name when provided')
assert.doesNotMatch(message, /Nombre:/, 'must omit name line when absent')

// 3. Empty idea falls back instead of leaving a blank
const noIdea = buildOrderMessage({ garment, size: 'S', inspiration: '' })
assert.match(noIdea, /por definir/, 'must state the idea is still undefined')
assert.doesNotMatch(noIdea, /Mi idea: *\n/, 'must not leave an empty idea value')

// 4. Accents, quotes and emoji survive the URL round-trip
const tricky = buildOrderMessage({ garment, size: 'XL', inspiration: 'Café "La Orotava" 🐉 ñandú' })
const url = buildWhatsAppUrl(tricky)
assert.ok(url.startsWith(`https://wa.me/${WHATSAPP_NUMBER}?text=`), `unexpected url: ${url}`)
assert.equal(decodeURIComponent(url.split('?text=')[1]), tricky, 'decoded payload must equal the message')

// 5. WhatsApp target is the real business number, digits only
assert.equal(WHATSAPP_NUMBER, '34633079014', 'whatsapp number must be digits-only with country code')
assert.equal(url.includes('+'), false, 'wa.me url must not contain a plus sign')

// 6. Instagram cannot prefill a DM, so it hands off a clipboard copy
const ig = buildInstagramHandoff(tricky)
assert.equal(ig.handle, INSTAGRAM_HANDLE, 'must expose the instagram handle')
assert.equal(ig.dmUrl, `https://ig.me/m/${INSTAGRAM_HANDLE}`, 'must open the direct message thread')
assert.equal(ig.needsManualPaste, true, 'must flag that instagram needs a manual paste')
assert.equal(ig.message, tricky, 'clipboard payload must match the message')

// 7. Newlines used for readability, no CRLF that would break wa.me
assert.equal(tricky.includes('\r'), false, 'message must not contain carriage returns')
assert.ok(tricky.split('\n').length > 4, 'message must be multi-line for readability')

console.log('ORDER_MESSAGE_OK')
console.log(message)
