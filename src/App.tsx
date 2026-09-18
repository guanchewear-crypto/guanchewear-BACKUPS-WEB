import { useEffect } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { TrustMarquee } from './components/TrustMarquee'
import CollectionShowcase from './components/CollectionShowcase'
import ProcessSection from './components/ProcessSection'
import DesignStudioSection from './components/DesignStudioSection'
import OriginSection from './components/OriginSection'
import ValuesSection from './components/ValuesSection'
import GallerySection from './components/GallerySection'
import TestimonialsSection from './components/TestimonialsSection'
import FAQSection from './components/FAQSection'
import ClosingCTA from './components/ClosingCTA'
import Footer from './components/Footer'
import NoiseOverlay from './components/NoiseOverlay'
import ScrollProgress from './components/ScrollProgress'
import ParticleField from './components/ParticleField'
import { marqueeItems } from './data/collections'

function App() {
  useEffect(() => {
    // Mark intro as played so it doesn't replay on refresh
    if (!sessionStorage.getItem('gw_intro_played')) {
      sessionStorage.setItem('gw_intro_played', 'true')
    }
  }, [])

  return (
    <>
      <NoiseOverlay />
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <TrustMarquee items={marqueeItems} />
        <ParticleField>
          <CollectionShowcase />
          <ProcessSection />
          <DesignStudioSection />
          <OriginSection />
          <ValuesSection />
          <GallerySection />
          <TestimonialsSection />
          <FAQSection />
          <ClosingCTA />
        </ParticleField>
      </main>
      <Footer />
    </>
  )
}

export default App