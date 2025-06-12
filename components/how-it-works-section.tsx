import { Settings, Play, Trophy } from "lucide-react"

const steps = [
  {
    icon: <Settings className="h-12 w-12 text-[#5285a6]" />,
    title: "Configure",
    description: "Use our clean UI to set your game mode and preferences in seconds.",
  },
  {
    icon: <Play className="h-12 w-12 text-[#5285a6]" />,
    title: "Launch",
    description: "Start the bot with a single click or a global hotkey.",
  },
  {
    icon: <Trophy className="h-12 w-12 text-[#5285a6]" />,
    title: "Dominate",
    description: "Go AFK and let Apex Automation handle the grind. Come back to a leveled-up account.",
  },
]

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-[#0c0c0d]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-xl text-[#cccccc] max-w-3xl mx-auto">
            Getting started with Apex Automation is simple and takes just a few moments.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center max-w-xs">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-[#131314] rounded-full flex items-center justify-center mx-auto border border-[#30363d]">
                  {step.icon}
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#5285a6] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-16 h-0.5 bg-gradient-to-r from-[#5285a6] to-transparent"></div>
                )}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-[#cccccc]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
