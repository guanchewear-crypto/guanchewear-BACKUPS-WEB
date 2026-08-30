import { motion } from 'framer-motion'
import { ArrowUpRight, MessageCircle } from 'lucide-react'
import { collections } from '../data/collections'

const reveal = { hidden: {}, show: { transition: { staggerChildren: .07, delayChildren: .45 } } }
const word = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: .65 } } }

function Words({ children }: { children: string }) {
  return <motion.span variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: .6 }}>{children.split(' ').map((text, i) => <motion.span aria-hidden="true" variants={word} className="inline-block" key={`${text}-${i}`}>{text}&nbsp;</motion.span>)}</motion.span>
}

export default function ClosingCTA() {
  return (
    <section className="relative flex min-h-[90dvh] items-center overflow-hidden bg-bg-primary px-5 py-24 text-text-primary md:px-10" aria-labelledby="closing-title">
      <div aria-hidden="true" className="absolute inset-0 opacity-35">
        {collections.map((item, i) => <motion.img key={item.id} src={item.image} alt="" initial={{ opacity: 0, x: i === 1 ? 0 : i === 0 ? -180 : 180, y: i === 1 ? 100 : 0 }} whileInView={{ opacity: .38, x: 0, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.4, delay: i * .15, ease: [0.16, 1, 0.3, 1] }} className={`absolute h-[68%] w-[48%] object-contain grayscale ${i === 0 ? '-left-[10%] top-[20%] rotate-[-9deg]' : i === 1 ? 'bottom-[-18%] left-[27%]' : '-right-[11%] top-[8%] rotate-[10deg]'}`} />)}
      </div>
      {/* Wider, brighter gold light beam */}
      <motion.div aria-hidden="true" initial={{ x: '-110%' }} whileInView={{ x: '110%' }} viewport={{ once: true }} transition={{ duration: 1.8, delay: .7 }} className="absolute inset-y-0 z-10 w-px bg-gradient-to-b from-transparent via-gold/80 to-transparent shadow-[0_0_50px_rgba(212,168,83,0.7)]" />
      {/* Extra glow layer behind the beam */}
      <motion.div aria-hidden="true" initial={{ x: '-110%' }} whileInView={{ x: '110%' }} viewport={{ once: true }} transition={{ duration: 1.8, delay: .7 }} className="absolute inset-y-0 z-10 w-20 bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
      <motion.div aria-hidden="true" initial={{ opacity: 0 }} whileInView={{ opacity: .035 }} viewport={{ once: true }} transition={{ delay: 1.8, duration: 1 }} className="pointer-events-none absolute inset-0 flex items-center justify-center text-[42vw] font-black leading-none tracking-[-.12em] text-text-muted">GW</motion.div>
      <div aria-hidden="true" className="pointer-events-none absolute -inset-[50%] z-20 opacity-[.045] mix-blend-screen" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 180 180\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'.8\'/%3E%3C/svg%3E")', animation: 'grain .25s steps(2) infinite' }} />
      <div className="relative z-30 mx-auto w-full max-w-7xl text-center">
        <h2 id="closing-title" className="mx-auto max-w-5xl text-4xl leading-[1.03] tracking-[-.045em] md:text-7xl lg:text-[clamp(4rem,8vw,9rem)]">
          <span className="block font-display font-normal italic text-gold"><Words>No queremos que vistas una marca.</Words></span>
          <strong className="mt-3 block font-extrabold text-white"><Words>Queremos que vistas quién eres.</Words></strong>
        </h2>
        <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 1.3 }} className="mx-auto mt-9 max-w-xl text-sm leading-7 text-text-secondary md:text-base">Tu historia merece algo que no lleve nadie más. Cuéntanos la idea; nosotros le damos forma.</motion.p>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.55 }} className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="#crear-diseno" className="group inline-flex items-center justify-center gap-3 bg-gold px-7 py-4 text-xs font-bold tracking-[.18em] text-text-contrast transition-all hover:-translate-y-1 hover:bg-gold-light hover:shadow-[0_0_30px_rgba(212,168,83,0.4)]"><span className="gold-shimmer">CREAR MI DISEÑO</span> <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a>
          <a href="mailto:guanchewear@gmail.com" className="group inline-flex items-center justify-center gap-3 border border-gold/30 px-7 py-4 text-xs font-bold tracking-[.18em] text-gold transition-all hover:border-gold hover:bg-gold/10 hover:shadow-[0_0_20px_rgba(212,168,83,0.15)]"><span className="gold-shimmer">HABLAR CON NOSOTROS</span> <MessageCircle className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></a>
        </motion.div>
      </div>
    </section>
  )
}
