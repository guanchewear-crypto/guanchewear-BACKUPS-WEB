import type { CSSProperties } from 'react'

export interface ProductVisualProps {
  image: string
  position?: string
  scale?: number
  overlay?: { opacity?: number; brightness?: number; contrast?: number }
  mask?: string
  className?: string
}

export function ProductVisual({ image, position = 'center', scale = 1, overlay, mask, className = '' }: ProductVisualProps) {
  const style: CSSProperties = {
    objectPosition: position,
    opacity: overlay?.opacity ?? 1,
    filter: `brightness(${overlay?.brightness ?? 1}) contrast(${overlay?.contrast ?? 1})`,
    transform: `scale(${scale})`,
    maskImage: mask ? `url(${mask})` : undefined,
    WebkitMaskImage: mask ? `url(${mask})` : undefined,
    maskPosition: mask ? 'center' : undefined,
    WebkitMaskPosition: mask ? 'center' : undefined,
    maskRepeat: mask ? 'no-repeat' : undefined,
    WebkitMaskRepeat: mask ? 'no-repeat' : undefined,
    maskSize: mask ? 'contain' : undefined,
    WebkitMaskSize: mask ? 'contain' : undefined,
  }

  return <div className={`relative overflow-hidden ${className}`}><img src={image} alt="" aria-hidden="true" className="h-full w-full object-cover transition-transform duration-500" style={style} /></div>
}

export default ProductVisual
