import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { fetchVersionInfo, getLatestDownloadUrl } from "@/lib/pcloud-integration"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// Your pCloud JSON URL
const VERSION_JSON_URL = "https://u.pcloud.link/publink/show?code=XZ6Lzj5Zxla37ghWh2BP3WQR0HDXtuhDTQfV"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session

      try {
        const customerEmail = session.customer_details?.email || "customer@example.com"
        const planName = session.metadata?.plan || "Unknown"

        console.log(`[DEBUG] Processing order for ${customerEmail}, plan: ${planName}`)

        // Get the price ID from the session
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
        const priceId = lineItems.data[0]?.price?.id

        if (!priceId) {
          throw new Error("No price ID found in session")
        }

        // Get the price and its associated product
        const price = await stripe.prices.retrieve(priceId)
        const product = await stripe.products.retrieve(price.product as string)

        console.log(`[DEBUG] Fetching keys for product: ${product.name}`)

        // Get unused keys from product metadata
        const unusedKeys = product.metadata.unused_keys ? JSON.parse(product.metadata.unused_keys) : []
        const usedKeys = product.metadata.used_keys ? JSON.parse(product.metadata.used_keys) : []

        if (unusedKeys.length === 0) {
          console.error(`[ERROR] No unused keys available for product: ${product.name}`)

          // Mark session as failed for manual review
          await stripe.checkout.sessions.update(session.id, {
            metadata: {
              ...session.metadata,
              deliveryStatus: "failed",
              errorMessage: "No available license keys",
              errorTimestamp: new Date().toISOString(),
            },
          })

          return NextResponse.json({ error: "No available license keys" }, { status: 500 })
        }

        // Get the first available key
        const licenseKey = unusedKeys[0]
        console.log(`[DEBUG] Found available key: ${licenseKey}`)

        // Remove from unused, add to used
        const updatedUnusedKeys = unusedKeys.filter((key: string) => key !== licenseKey)
        const updatedUsedKeys = [
          ...usedKeys,
          {
            key: licenseKey,
            issuedTo: customerEmail,
            issuedAt: new Date().toISOString(),
          },
        ]

        // Update the product metadata
        await stripe.products.update(price.product as string, {
          metadata: {
            ...product.metadata,
            unused_keys: JSON.stringify(updatedUnusedKeys),
            used_keys: JSON.stringify(updatedUsedKeys),
            keys_remaining: updatedUnusedKeys.length.toString(),
          },
        })

        console.log(`[SUCCESS] Key ${licenseKey} marked as used for ${customerEmail}`)
        console.log(`[INFO] Keys remaining: ${updatedUnusedKeys.length}`)

        // Fetch the latest version info from your pCloud
        console.log("[DEBUG] Fetching latest software version...")
        const versionInfo = await fetchVersionInfo(VERSION_JSON_URL)
        const directDownloadUrl = await getLatestDownloadUrl(versionInfo)

        console.log(`[DEBUG] Latest version: ${versionInfo.latest_version}`)

        // Calculate expiration date based on plan
        const expirationDate = new Date()
        switch (planName) {
          case "Daily":
            expirationDate.setDate(expirationDate.getDate() + 1)
            break
          case "Weekly":
            expirationDate.setDate(expirationDate.getDate() + 7)
            break
          case "Monthly":
            expirationDate.setDate(expirationDate.getDate() + 30)
            break
          case "90 Days":
            expirationDate.setDate(expirationDate.getDate() + 90)
            break
        }

        // Store all delivery information in Stripe session metadata
        await stripe.checkout.sessions.update(session.id, {
          metadata: {
            ...session.metadata,
            licenseKey: licenseKey,
            softwareVersion: versionInfo.latest_version,
            softwareDownloadUrl: directDownloadUrl,
            softwareFilename: versionInfo.file_name,
            softwareFileSize: versionInfo.file_size.toString(),
            releaseNotes: versionInfo.release_notes || "No release notes available",
            changelog: JSON.stringify(versionInfo.changelog),
            releaseDate: versionInfo.release_date,
            expiresAt: expirationDate.toISOString(),
            deliveryTimestamp: new Date().toISOString(),
            deliveryStatus: "completed",
          },
        })

        console.log(`[SUCCESS] License key ${licenseKey} issued to ${customerEmail}`)
        console.log(`[SUCCESS] Software version ${versionInfo.latest_version} ready for delivery`)

        // TODO: Send email with license key and download link
        // await sendLicenseEmail(customerEmail, licenseKey, directDownloadUrl, versionInfo)
      } catch (error) {
        console.error("Error processing checkout.session.completed:", error)

        // Mark the session as failed for manual review
        try {
          await stripe.checkout.sessions.update(session.id, {
            metadata: {
              ...session.metadata,
              deliveryStatus: "failed",
              errorMessage: error instanceof Error ? error.message : "Unknown error",
              errorTimestamp: new Date().toISOString(),
            },
          })
        } catch (updateError) {
          console.error("Failed to update session with error status:", updateError)
        }
      }

      break
    }

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log("Payment succeeded:", paymentIntent.id)
      break

    case "payment_intent.payment_failed":
      const failedPaymentIntent = event.data.object as Stripe.PaymentIntent
      console.log("Payment failed:", failedPaymentIntent.id)
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
