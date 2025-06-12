"use client"

import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useEffect, useRef } from "react"
import AnimatedGradientText from "./animated-gradient-text"

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
    }[] = []

    const createParticles = () => {
      const particleCount = Math.floor(window.innerWidth / 10)

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          color: `rgba(82, 133, 166, ${Math.random() * 0.5 + 0.1})`,
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > canvas.width || particle.y < 0 || particle.y > canvas.height) {
          if (Math.random() > 0.5) {
            particle.x = Math.random() * canvas.width
            particle.y = Math.random() > 0.5 ? 0 : canvas.height
          } else {
            particle.x = Math.random() > 0.5 ? 0 : canvas.width
            particle.y = Math.random() * canvas.height
          }
        }

        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particles.length = 0
      createParticles()
    }

    createParticles()
    animate()

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>
      <div className="container mx-auto px-4 md:px-6 relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <AnimatedGradientText>
              Stop the Grind. <br className="hidden sm:block" />
              Start Dominating.
            </AnimatedGradientText>
          </div>
          <p className="text-xl md:text-2xl text-[#cccccc] mb-10 leading-relaxed">
            Apex Automation is your ultimate co-pilot for Call of Duty. Level up your rank, weapons, and battle pass
            effortlessly while you're AFK.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              className="bg-white/5 backdrop-blur-md border border-[#5285a6] text-white hover:bg-white/10 hover:shadow-[0_0_30px_rgba(82,133,166,0.5)] transition-all duration-300 text-lg px-8 py-6 rounded-md w-full sm:w-auto"
              onClick={() => {
                const pricingSection = document.getElementById("pricing")
                if (pricingSection) {
                  pricingSection.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              Get Apex Automation Now
            </Button>
            <a
              href="#features"
              className="flex items-center text-white hover:text-[#5285a6] transition-colors w-full sm:w-auto justify-center"
            >
              <span className="mr-2">See Features</span>
              <ChevronDown size={20} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
