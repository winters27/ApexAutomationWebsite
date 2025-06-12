import { type NextRequest, NextResponse } from "next/server"
import { fetchVersionInfo, getLatestDownloadUrl } from "@/lib/pcloud-integration"

const SELLAUTH_WEBHOOK_SECRET = process.env.SELLAUTH_WEBHOOK_SECRET!
const VERSION_JSON_URL = "https://u.pcloud.link/publink/show?code=XZ6Lzj5Zxla37ghWh2BP3WQR0HDXtuhDTQfV"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-sellauth-signature")

    // Verify webhook signature (implement based on SellAuth docs)
    if (!signature || !verifyWebhookSignature(body, signature, SELLAUTH_WEBHOOK_SECRET)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const event = JSON.parse(body)

    switch (event.type) {
      case "license.created": {
        const license = event.data
        console.log(`[DEBUG] New license created: ${license.key} for ${license.customer_email}`)

        try {
          // Fetch the latest version info from your pCloud
          console.log("[DEBUG] Fetching latest software version...")
          const versionInfo = await fetchVersionInfo(VERSION_JSON_URL)
          const directDownloadUrl = await getLatestDownloadUrl(versionInfo)

          console.log(`[DEBUG] Latest version: ${versionInfo.latest_version}`)

          // TODO: Send email with license key and download link
          // await sendLicenseEmail(
          //   license.customer_email,
          //   license.key,
          //   directDownloadUrl,
          //   versionInfo
          // )

          console.log(`[SUCCESS] License ${license.key} processed for ${license.customer_email}`)
        } catch (error) {
          console.error("Error processing license creation:", error)
        }

        break
      }

      case "payment.completed": {
        const payment = event.data
        console.log(`[DEBUG] Payment completed: ${payment.id}`)
        break
      }

      case "payment.failed": {
        const payment = event.data
        console.log(`[DEBUG] Payment failed: ${payment.id}`)
        break
      }

      default:
        console.log(`Unhandled SellAuth event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("SellAuth webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

function verifyWebhookSignature(body: string, signature: string, secret: string): boolean {
  // Implement SellAuth signature verification based on their documentation
  // This is a placeholder - check SellAuth docs for exact implementation
  const crypto = require("crypto")
  const expectedSignature = crypto.createHmac("sha256", secret).update(body).digest("hex")

  return signature === expectedSignature
}
