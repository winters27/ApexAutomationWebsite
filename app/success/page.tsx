"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, Download, Copy, MessageCircle, RefreshCw, Calendar, Package } from "lucide-react"
import Link from "next/link"

interface LicenseData {
  licenseKey: string
  customerEmail: string
  planName: string
  softwareVersion: string
  softwareDownloadUrl: string
  softwareFilename: string
  changelog: string[]
  releaseDate: string
  expiresAt: string | null
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const licenseKey = searchParams.get("license_key")
  const [licenseData, setLicenseData] = useState<LicenseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (licenseKey) {
      fetchLicenseData(licenseKey)
    } else {
      // Fallback to latest version data
      fetchLatestVersion()
    }
  }, [licenseKey])

  const fetchLicenseData = async (key: string) => {
    try {
      // In a real implementation, you'd verify the license with SellAuth
      // For now, we'll fetch the latest version data
      await fetchLatestVersion()
    } catch (error) {
      console.error("Failed to fetch license data:", error)
      setLoading(false)
    }
  }

  const fetchLatestVersion = async () => {
    try {
      const versionResponse = await fetch("/api/get-latest-version")
      const versionData = await versionResponse.json()

      if (versionData.success) {
        setLicenseData({
          licenseKey: licenseKey || "APEX-XXXX-XXXX-XXXX-XXXX",
          customerEmail: "customer@example.com",
          planName: "Monthly",
          softwareVersion: versionData.version,
          softwareDownloadUrl: versionData.downloadUrl,
          softwareFilename: versionData.filename,
          changelog: versionData.changelog || [],
          releaseDate: versionData.releaseDate,
          expiresAt: null, // SellAuth handles expiration
        })
      }
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch version data:", error)
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (licenseData) {
      navigator.clipboard.writeText(licenseData.licenseKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = async () => {
    if (!licenseData) return

    setDownloading(true)
    try {
      const link = document.createElement("a")
      link.href = licenseData.softwareDownloadUrl
      link.download = licenseData.softwareFilename
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Download failed:", error)
    } finally {
      setDownloading(false)
    }
  }

  const formatReleaseDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return "Unknown date"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0c0d] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5285a6] mx-auto mb-4"></div>
          <p className="text-white">Preparing your download...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0c0c0d] text-[#E0E0E0]">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[#4CAF50] rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="h-10 w-10 text-white" />
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">Payment Successful!</h1>
            <p className="text-xl text-[#cccccc] mb-8">
              Thank you for purchasing Apex Automation. Your license has been activated and the latest version is ready
              for download!
            </p>
          </div>

          {/* License Key Section */}
          <div className="bg-[#131314] rounded-lg p-6 mb-8 border border-[#30363d]">
            <h2 className="text-2xl font-bold text-white mb-4">Your License Key</h2>
            <div className="bg-[#0c0c0d] p-4 rounded-md flex items-center justify-between mb-4">
              <code className="text-[#5285a6] font-mono">{licenseData?.licenseKey}</code>
              <Button
                size="sm"
                variant="outline"
                className="ml-2 border-[#30363d] hover:bg-[#30363d]/20"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="text-sm text-[#cccccc]">
              <p>
                <span className="font-semibold">Plan:</span> {licenseData?.planName}
              </p>
              <p className="mt-2 text-[#4CAF50]">✓ Your license key has been sent to {licenseData?.customerEmail}</p>
            </div>
          </div>

          {/* Download Section */}
          <div className="bg-[#131314] rounded-lg p-6 mb-8 border border-[#30363d]">
            <h2 className="text-2xl font-bold text-white mb-4">Download Latest Version</h2>
            <div className="bg-[#0c0c0d] p-4 rounded-md mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold">Apex Automation v{licenseData?.softwareVersion}</h3>
                <span className="text-[#4CAF50] text-sm font-semibold">LATEST</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-[#cccccc] mb-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>{licenseData?.softwareFilename}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{licenseData?.releaseDate && formatReleaseDate(licenseData.releaseDate)}</span>
                </div>
              </div>

              {licenseData?.changelog && licenseData.changelog.length > 0 && (
                <div className="text-sm text-[#cccccc] mb-3">
                  <p className="font-semibold mb-2">What's New in v{licenseData.softwareVersion}:</p>
                  <ul className="text-xs bg-[#131314] p-3 rounded space-y-1">
                    {licenseData.changelog.map((change, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-[#4CAF50] mt-1">•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full bg-white/5 backdrop-blur-md border border-[#5285a6] text-white hover:bg-white/10 hover:shadow-[0_0_20px_rgba(82,133,166,0.4)] transition-all duration-300"
            >
              {downloading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Starting Download...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Apex Automation v{licenseData?.softwareVersion}
                </>
              )}
            </Button>
          </div>

          {/* Setup Instructions */}
          <div className="bg-[#131314] rounded-lg p-6 mb-8 border border-[#30363d]">
            <h2 className="text-2xl font-bold text-white mb-4">Setup Instructions</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#5285a6] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Download & Run</h3>
                  <p className="text-[#cccccc] text-sm">
                    Download the ApexAutomation.exe file and run it directly. No installation required!
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#5285a6] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Enter License Key</h3>
                  <p className="text-[#cccccc] text-sm">
                    When prompted, enter your license key to activate the software.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#5285a6] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Automatic Updates</h3>
                  <p className="text-[#cccccc] text-sm">
                    The software will automatically check for updates and notify you when new versions are available.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleDownload}
              className="bg-white/5 backdrop-blur-md border border-[#5285a6] text-white hover:bg-white/10 hover:shadow-[0_0_20px_rgba(82,133,166,0.4)] transition-all duration-300"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Again
            </Button>
            <Button
              variant="outline"
              className="border-[#30363d] text-[#cccccc] hover:bg-[#30363d]/20"
              onClick={() => window.open("https://discord.gg/apexautomation", "_blank")}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Join Discord
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-[#30363d] text-center">
            <p className="text-[#cccccc] text-sm mb-4">
              Having trouble? Contact our support team on{" "}
              <a
                href="https://discord.gg/apexautomation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5285a6] hover:text-[#5285a6]/80 transition-colors"
              >
                Discord
              </a>{" "}
              or visit our{" "}
              <a
                href="https://filedn.com/lvvwxquPDhVHVPDbYeHJc6B/apexautomation_guide.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#5285a6] hover:text-[#5285a6]/80 transition-colors"
              >
                Support Guide
              </a>
            </p>
            <Link href="/" className="text-[#5285a6] hover:text-[#5285a6]/80 transition-colors">
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
