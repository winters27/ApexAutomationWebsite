import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#0c0c0d] border-t border-[#30363d] py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 mr-2">
                <img src="/images/shark-logo.png" alt="Apex Automation Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-white font-bold text-xl">Apex Automation</span>
            </Link>
            <p className="text-[#cccccc] mt-2 max-w-md">
              Level up your Call of Duty experience with the ultimate automation tool.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            <div>
              <h3 className="text-white font-semibold mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-[#cccccc] hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-[#cccccc] hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Community</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://discord.gg/apexautomation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#cccccc] hover:text-white transition-colors"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="https://filedn.com/lvvwxquPDhVHVPDbYeHJc6B/apexautomation_guide.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#cccccc] hover:text-white transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-[#30363d] mt-8 pt-8 text-center">
          <p className="text-[#cccccc]">© {new Date().getFullYear()} Apex Automation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
