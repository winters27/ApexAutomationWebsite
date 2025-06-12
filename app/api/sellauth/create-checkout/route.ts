import { type NextRequest, NextResponse } from "next/server"

const SELLAUTH_API_KEY = process.env.SELLAUTH_API_KEY!
const SELLAUTH_API_URL = "https://api.sellauth.com/v1"

export async function POST(request: NextRequest) {
  try {
    const { product_id, customer_email, return_url, cancel_url } = await request.json()

    const response = await fetch(`${SELLAUTH_API_URL}/checkout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SELLAUTH_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id,
        customer_email,
        return_url,
        cancel_url,
        payment_methods: ["card", "paypal", "crypto"],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("SellAuth API error:", error)
      throw new Error("Failed to create checkout session")
    }

    const data = await response.json()
    return NextResponse.json({ checkout_url: data.checkout_url })
  } catch (error) {
    console.error("Error creating SellAuth checkout:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
