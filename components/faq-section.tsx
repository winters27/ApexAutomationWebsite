"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

const faqs = [
  {
    question: "Is this safe to use?",
    answer:
      "Apex Automation is built with safety as a priority, operating on your desktop and interacting with the game in a way that is designed for reliability. However, as with any third-party tool, use is at your own discretion.",
  },
  {
    question: "What are the system requirements?",
    answer:
      "Windows 10/11. The game must be set to English and run in Windowed mode. For full details, see our setup guide.",
  },
  {
    question: "Do I need a high-end PC?",
    answer:
      "If your PC can run Call of Duty, it can run Apex Automation. The bot is lightweight and optimized for performance.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards and PayPal through our secure payment processor.",
  },
  {
    question: "Can I use this on multiple accounts?",
    answer:
      "Yes, your Apex Automation license allows you to use the software on multiple accounts, but only one at a time.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "We offer a 3-day money-back guarantee if the software doesn't work as described. Please contact our support team through Discord for assistance.",
  },
]

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 bg-[#0c0c0d]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-[#cccccc] max-w-3xl mx-auto">Got questions? We've got answers.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`mb-4 border ${
                openIndex === index ? "border-[#5285a6]" : "border-[#30363d]"
              } rounded-lg overflow-hidden bg-[#131314]`}
            >
              <button
                className="w-full text-left p-4 flex justify-between items-center focus:outline-none"
                onClick={() => toggleFaq(index)}
              >
                <span className="text-lg font-medium text-white">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-[#5285a6]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#5285a6]" />
                )}
              </button>

              {openIndex === index && (
                <div className="p-4 pt-0 text-[#cccccc] border-t border-[#30363d]">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
