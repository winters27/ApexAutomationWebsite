import type React from "react"
import { cn } from "@/lib/utils"

interface AnimatedGradientTextProps {
  children: React.ReactNode
  className?: string
}

const AnimatedGradientText = ({ children, className }: AnimatedGradientTextProps) => {
  return (
    <h1
      className={cn(
        "text-4xl md:text-6xl font-bold leading-tight pb-2",
        "bg-clip-text text-transparent bg-gradient-to-r animate-gradient-flow",
        "from-[#5285a6] via-[#66c2ff] to-[#5285a6]",
        "drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]",
        "filter drop-shadow-[0_0_8px_rgba(102,194,255,0.6)]",
        className,
      )}
    >
      {children}
    </h1>
  )
}

export default AnimatedGradientText
