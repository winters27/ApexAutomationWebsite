import { Layers, Bot, Zap, Shield, Monitor, Cpu } from "lucide-react"

const features = [
  {
    icon: <Layers className="h-8 w-8 text-[#5285a6]" />,
    title: "Multi-Mode Support",
    description: "Works seamlessly with popular modes like Warzone and Black Ops Prop Hunt.",
  },
  {
    icon: <Bot className="h-8 w-8 text-[#5285a6]" />,
    title: "Total Automation",
    description: "From auto-prestige and loadout cycling to weapon switching for maximum XP.",
  },
  {
    icon: <Zap className="h-8 w-8 text-[#5285a6]" />,
    title: "Smart XP Token Usage",
    description: "Automatically detects and activates the correct Double XP tokens to boost your gains.",
  },
  {
    icon: <Shield className="h-8 w-8 text-[#5285a6]" />,
    title: "Customizable & Safe",
    description: "Configure hotkeys, timers, and behavior. Designed with system safety and reliability in mind.",
  },
  {
    icon: <Monitor className="h-8 w-8 text-[#5285a6]" />,
    title: "Launcher Agnostic",
    description: "Full support for Steam, Battle.net, and Game Pass versions of the game.",
  },
  {
    icon: <Cpu className="h-8 w-8 text-[#5285a6]" />,
    title: "Lightweight Performance",
    description: "Optimized to run in the background without impacting your system's performance.",
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-[#0c0c0d]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-xl text-[#cccccc] max-w-3xl mx-auto">
            Apex Automation comes packed with everything you need to maximize your Call of Duty progress without the
            grind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#131314] p-6 rounded-lg border border-[#30363d] transition-all duration-300 hover:border-[#5285a6]/50 hover:shadow-[0_0_15px_rgba(82,133,166,0.15)]"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-[#cccccc]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
