import { type NextRequest, NextResponse } from "next/server"

const SELLAUTH_API_KEY = process.env.SELLAUTH_API_KEY!
const SELLAUTH_API_URL = "https://api.sellauth.com/v1"

export async function POST(request: NextRequest) {
  try {
    const { license_key, product_id } = await request.json()

    const response = await fetch(`${SELLAUTH_API_URL}/licenses/verify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SELLAUTH_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        license_key,
        product_id,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("SellAuth license verification error:", error)
      return NextResponse.json({ valid: false, error: "Invalid license" }, { status: 400 })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error verifying license:", error)
    return NextResponse.json({ valid: false, error: "Verification failed" }, { status: 500 })
  }
}
