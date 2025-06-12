"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-[#0c0c0d]/95 backdrop-blur-sm py-3 shadow-md" : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 mr-2">
                <img src="/images/shark-logo.png" alt="Apex Automation Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-white font-bold text-xl">Apex Automation</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-[#E0E0E0] hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-[#E0E0E0] hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="text-[#E0E0E0] hover:text-white transition-colors">
              FAQ
            </Link>
            <a
              href="https://discord.gg/apexautomation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E0E0E0] hover:text-white transition-colors"
            >
              Discord
            </a>
            <Button
              className="bg-white/5 backdrop-blur-md border border-[#5285a6] text-white hover:bg-white/10 hover:shadow-[0_0_20px_rgba(82,133,166,0.4)] transition-all duration-300"
              onClick={() => {
                const pricingSection = document.getElementById("pricing")
                if (pricingSection) {
                  pricingSection.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              Pricing
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 flex flex-col space-y-4">
            <Link
              href="#features"
              className="text-[#E0E0E0] hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-[#E0E0E0] hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="text-[#E0E0E0] hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <a
              href="https://discord.gg/apexautomation"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E0E0E0] hover:text-white transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Discord
            </a>
            <Button
              className="bg-white/5 backdrop-blur-md border border-[#5285a6] text-white hover:bg-white/10 hover:shadow-[0_0_20px_rgba(82,133,166,0.4)] transition-all duration-300 w-full"
              onClick={() => {
                setMobileMenuOpen(false)
                const pricingSection = document.getElementById("pricing")
                if (pricingSection) {
                  pricingSection.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              Pricing
            </Button>
          </nav>
        )}
      </div>
    </header>
  )
}
