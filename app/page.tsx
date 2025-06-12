import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import HowItWorksSection from "@/components/how-it-works-section"
import PricingSection from "@/components/pricing-section"
import FaqSection from "@/components/faq-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0c0c0d] text-[#E0E0E0]">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <FaqSection />
      <Footer />
    </main>
  )
}
