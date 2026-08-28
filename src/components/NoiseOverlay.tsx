export interface NoiseOverlayProps { opacity?: number }

export function NoiseOverlay({ opacity = 0.03 }: NoiseOverlayProps) {
  return <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay" style={{ opacity, backgroundImage: 'repeating-conic-gradient(rgba(255,255,255,.9) 0 .5deg, rgba(0,0,0,.9) .5deg 1deg)', backgroundSize: '4px 4px' }} />
}

export default NoiseOverlay
