import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export async function POST(request: NextRequest) {
  try {
    const { priceId, planName } = await request.json()

    // Get the origin from headers with fallback
    const origin =
      request.headers.get("origin") ||
      request.headers.get("referer")?.split("/").slice(0, 3).join("/") ||
      process.env.NEXT_PUBLIC_DOMAIN ||
      "https://yourdomain.com" // Replace with your actual domain

    console.log("Origin for checkout:", origin)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
      customer_creation: "always",
      billing_address_collection: "required",

      // Digital product delivery configuration
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: `Apex Automation ${planName} License`,
          metadata: {
            plan: planName,
            product_type: "digital_software",
          },
        },
      },

      // Custom fields for license delivery
      custom_fields: [
        {
          key: "license_delivery",
          label: {
            type: "custom",
            custom: "License Key Delivery Method",
          },
          type: "dropdown",
          dropdown: {
            options: [
              {
                label: "Email (Recommended)",
                value: "email",
              },
              {
                label: "Download Page",
                value: "download_page",
              },
            ],
          },
          optional: false,
        },
      ],

      metadata: {
        plan: planName,
        delivery_type: "digital",
        requires_license_key: "true",
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 })
  }
}
