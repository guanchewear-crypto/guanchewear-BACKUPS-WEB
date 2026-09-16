import type { Garment } from './garments'

/**
 * GuancheWear order handoff.
 *
 * Instagram has no way to prefill a direct message, so WhatsApp is the only
 * channel that can carry the full customization automatically. Instagram is
 * offered as a secondary handoff that copies the message to the clipboard.
 */
export const WHATSAPP_NUMBER = '34633079014'
export const INSTAGRAM_HANDLE = 'guanchewear'

export interface OrderPayload {
  garment: Garment
  size: string
  inspiration: string
  customerName?: string
}

export interface InstagramHandoff {
  handle: string
  profileUrl: string
  dmUrl: string
  needsManualPaste: boolean
  message: string
}

const clean = (value: string) => value.replace(/\s+/g, ' ').trim()

export function buildOrderMessage({ garment, size, inspiration, customerName }: OrderPayload): string {
  const idea = clean(inspiration) || 'por definir'

  const lines = [
    'Hola GuancheWear, quiero crear este diseño:',
    '',
    `• Prenda: ${garment.label}`,
    `• Color: ${garment.color}`,
    `• Talla: ${size}`,
    `• Precio: ${garment.price} €`,
    `• Referencia: ${garment.id}`,
  ]

  const name = customerName ? clean(customerName) : ''
  if (name) {
    lines.splice(2, 0, `• Nombre: ${name}`)
  }

  lines.push('', `Mi idea: ${idea}`, '', '¿Me confirmáis el siguiente paso?')

  return lines.join('\n')
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function buildInstagramHandoff(message: string): InstagramHandoff {
  return {
    handle: INSTAGRAM_HANDLE,
    profileUrl: `https://instagram.com/${INSTAGRAM_HANDLE}`,
    dmUrl: `https://ig.me/m/${INSTAGRAM_HANDLE}`,
    needsManualPaste: true,
    message,
  }
}
