// SellAuth integration for Apex Automation

export interface SellAuthProduct {
  id: string
  name: string
  price: number
  currency: string
  description: string
}

export interface SellAuthLicense {
  key: string
  product_id: string
  customer_email: string
  created_at: string
  expires_at: string | null
  status: "active" | "expired" | "revoked"
}

/**
 * Create a SellAuth checkout session
 */
export async function createSellAuthCheckout(productId: string, customerEmail?: string) {
  try {
    const response = await fetch("/api/sellauth/create-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        customer_email: customerEmail,
        return_url: `${window.location.origin}/success`,
        cancel_url: `${window.location.origin}/pricing`,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create checkout session")
    }

    const data = await response.json()
    return data.checkout_url
  } catch (error) {
    console.error("Error creating SellAuth checkout:", error)
    throw error
  }
}

/**
 * Verify a SellAuth license key
 */
export async function verifySellAuthLicense(licenseKey: string, productId: string) {
  try {
    const response = await fetch("/api/sellauth/verify-license", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        license_key: licenseKey,
        product_id: productId,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to verify license")
    }

    return await response.json()
  } catch (error) {
    console.error("Error verifying license:", error)
    throw error
  }
}
