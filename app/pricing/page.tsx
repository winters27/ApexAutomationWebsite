import Navbar from "@/components/navbar"
import PricingSection from "@/components/pricing-section"
import Footer from "@/components/footer"

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#0c0c0d] text-[#E0E0E0]">
      <Navbar />
      <div className="pt-20">
        <PricingSection />
      </div>
      <Footer />
    </main>
  )
}
