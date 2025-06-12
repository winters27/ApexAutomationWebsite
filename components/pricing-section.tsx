"use client"

import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import { useState } from "react"
import { createSellAuthCheckout } from "@/lib/sellauth-integration"

const pricingPlans = [
  {
    name: "Daily",
    price: "$5",
    period: "per day",
    description: "Perfect for testing Apex Automation",
    features: ["All Features Included", "24/7 Discord Support", "Instant Access", "No Commitment"],
    sellAuthProductId: "your_daily_product_id", // Replace with your SellAuth product ID
    popular: false,
  },
  {
    name: "Weekly",
    price: "$15",
    period: "per week",
    description: "Great for short-term grinding",
    features: [
      "All Features Included",
      "24/7 Discord Support",
      "Priority Setup Help",
      "Save vs Daily Rate",
      "Perfect for Events",
    ],
    sellAuthProductId: "your_weekly_product_id", // Replace with your SellAuth product ID
    popular: true,
  },
  {
    name: "Monthly",
    price: "$30",
    period: "per month",
    description: "Most popular for serious players",
    features: [
      "All Features Included",
      "24/7 Discord Support",
      "Priority Support",
      "Great Value Option",
      "Season Pass Completion",
    ],
    sellAuthProductId: "your_monthly_product_id", // Replace with your SellAuth product ID
    popular: false,
  },
  {
    name: "90 Days",
    price: "$50",
    period: "per 90 days",
    description: "Best value for dedicated grinders",
    features: [
      "All Features Included",
      "24/7 Discord Support",
      "VIP Support Channel",
      "Huge Savings (83% vs Daily)",
      "Complete Multiple Seasons",
    ],
    sellAuthProductId: "your_90day_product_id", // Replace with your SellAuth product ID
    popular: false,
  },
]

export default function PricingSection() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleCheckout = async (plan: (typeof pricingPlans)[0]) => {
    setLoadingPlan(plan.name)

    try {
      const checkoutUrl = await createSellAuthCheckout(plan.sellAuthProductId)

      // Redirect to SellAuth checkout
      window.location.href = checkoutUrl
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to create checkout session. Please try again.")
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <section id="pricing" className="py-20 bg-[#0c0c0d]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Flexible Pricing Plans</h2>
          <p className="text-xl text-[#cccccc] max-w-3xl mx-auto">
            Choose the perfect duration for your grinding needs. All plans include full access to Apex Automation.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-[#cccccc]">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#4CAF50]" />
              <span>Secure payments by SellAuth</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#4CAF50]" />
              <span>Instant license delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#4CAF50]" />
              <span>Multiple payment methods</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`bg-[#131314] rounded-lg border ${
                plan.popular ? "border-[#5285a6] ring-2 ring-[#5285a6]/20" : "border-[#30363d]"
              } overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(82,133,166,0.2)] relative`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#5285a6] text-white text-xs font-bold py-1 px-3 rounded-bl-lg">
                  POPULAR
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-2xl md:text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-[#cccccc] ml-1 text-sm">{plan.period}</span>
                </div>
                <p className="text-[#cccccc] mb-6 text-sm">{plan.description}</p>

                <div className="mb-6">
                  <Button
                    onClick={() => handleCheckout(plan)}
                    disabled={loadingPlan === plan.name}
                    className={`w-full ${
                      plan.popular
                        ? "bg-white/5 backdrop-blur-md border border-[#5285a6] text-white hover:bg-white/10 hover:shadow-[0_0_20px_rgba(82,133,166,0.4)]"
                        : "bg-[#30363d] hover:bg-[#30363d]/80"
                    } transition-all duration-300`}
                  >
                    {loadingPlan === plan.name ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Get ${plan.name} Access`
                    )}
                  </Button>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-4 w-4 text-[#4CAF50] mr-2 flex-shrink-0" />
                      <span className="text-[#cccccc] text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Value Comparison */}
        <div className="mt-12 text-center">
          <div className="bg-[#131314] rounded-lg p-6 max-w-4xl mx-auto border border-[#30363d]">
            <h3 className="text-xl font-bold text-white mb-4">💰 Value Comparison</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-[#cccccc]">Daily Rate</div>
                <div className="text-white font-bold">$5.00/day</div>
              </div>
              <div className="text-center">
                <div className="text-[#cccccc]">Weekly Rate</div>
                <div className="text-white font-bold">$2.14/day</div>
                <div className="text-[#4CAF50] text-xs">Save 57%</div>
              </div>
              <div className="text-center">
                <div className="text-[#cccccc]">Monthly Rate</div>
                <div className="text-white font-bold">$1.00/day</div>
                <div className="text-[#4CAF50] text-xs">Save 80%</div>
              </div>
              <div className="text-center">
                <div className="text-[#cccccc]">90-Day Rate</div>
                <div className="text-white font-bold">$0.56/day</div>
                <div className="text-[#4CAF50] text-xs">Save 89%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-[#cccccc] mb-4">
            All payments are processed securely through SellAuth. We accept cards, PayPal, and cryptocurrency.
          </p>
          <div className="flex items-center justify-center gap-6 opacity-60">
            <span className="text-sm text-[#cccccc]">Visa</span>
            <span className="text-sm text-[#cccccc]">Mastercard</span>
            <span className="text-sm text-[#cccccc]">PayPal</span>
            <span className="text-sm text-[#cccccc]">Crypto</span>
          </div>
        </div>
      </div>
    </section>
  )
}
