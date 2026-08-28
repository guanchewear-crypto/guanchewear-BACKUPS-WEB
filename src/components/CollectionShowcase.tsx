import { useRef, useState, useLayoutEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { collections } from '../data/collections'
import { CollectionPanel } from './CollectionPanel'

gsap.registerPlugin(ScrollTrigger)

export function CollectionShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const reduceMotion = useReducedMotion()

  useLayoutEffect(() => {
    if (reduceMotion) return

    const media = gsap.matchMedia()
    media.add('(min-width: 768px)', () => {
      const section = sectionRef.current
      const track = trackRef.current
      if (!section || !track) return

      const tween = gsap.to(track, {
        xPercent: (-100 * (collections.length - 1)) / collections.length,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setActive(Math.min(collections.length - 1, Math.round(self.progress * (collections.length - 1))))
          },
        },
      })
      return () => tween.kill()
    })
    return () => media.revert()
  }, [reduceMotion])

  return (
    <section id="colecciones" ref={sectionRef} className="relative scroll-mt-16 bg-bg-secondary md:h-[320vh]" aria-label="Colecciones">
      <div className="hidden h-[100dvh] overflow-hidden md:sticky md:top-0 md:block">
        <div ref={trackRef} className="flex h-full" style={{ width: `${collections.length * 100}%` }}>
          {collections.map((collection, index) => (
            <div key={collection.id} className="h-full" style={{ width: `${100 / collections.length}%` }}>
              <CollectionPanel collection={collection} index={index} total={collections.length} isActive={active === index} />
            </div>
          ))}
        </div>
        <div className="absolute inset-x-8 bottom-6 z-20 h-px bg-gold/20">
          <div
            className="h-full bg-gold transition-[width] duration-300"
            style={{ width: `${((active + 1) / collections.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-px md:hidden">
        {collections.map((collection, index) => (
          <motion.div
            key={collection.id}
            className="min-h-[100svh]"
            initial={reduceMotion ? false : { opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            onViewportEnter={() => setActive(index)}
          >
            <CollectionPanel collection={collection} index={index} total={collections.length} isActive={active === index} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default CollectionShowcase
