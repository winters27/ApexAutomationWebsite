// This file manages license key operations

// Sample license key pool - in production, store these securely in a database
// Each object contains a key and whether it's been used
export type LicenseKey = {
  key: string
  used: boolean
  plan: string
  issuedTo?: string
  issuedAt?: Date
  expiresAt?: Date
}

// In a real application, you would store these in a database
// This is just a simple example for demonstration
const licenseKeys: LicenseKey[] = [
  // Daily keys
  { key: "APEX-DAILY-ABCD-1234-EFGH-5678", used: false, plan: "Daily" },
  { key: "APEX-DAILY-IJKL-9012-MNOP-3456", used: false, plan: "Daily" },
  { key: "APEX-DAILY-QRST-7890-UVWX-1234", used: false, plan: "Daily" },

  // Weekly keys
  { key: "APEX-WEEK-ABCD-1234-EFGH-5678", used: false, plan: "Weekly" },
  { key: "APEX-WEEK-IJKL-9012-MNOP-3456", used: false, plan: "Weekly" },
  { key: "APEX-WEEK-QRST-7890-UVWX-1234", used: false, plan: "Weekly" },

  // Monthly keys
  { key: "APEX-MONTH-ABCD-1234-EFGH-5678", used: false, plan: "Monthly" },
  { key: "APEX-MONTH-IJKL-9012-MNOP-3456", used: false, plan: "Monthly" },
  { key: "APEX-MONTH-QRST-7890-UVWX-1234", used: false, plan: "Monthly" },

  // 90-Day keys
  { key: "APEX-90DAY-ABCD-1234-EFGH-5678", used: false, plan: "90 Days" },
  { key: "APEX-90DAY-IJKL-9012-MNOP-3456", used: false, plan: "90 Days" },
  { key: "APEX-90DAY-QRST-7890-UVWX-1234", used: false, plan: "90 Days" },
]

// Get an available license key for a specific plan
export async function getAvailableLicenseKey(plan: string): Promise<LicenseKey | null> {
  const availableKey = licenseKeys.find((key) => key.plan === plan && !key.used)

  if (!availableKey) {
    console.error(`No available license keys for plan: ${plan}`)
    return null
  }

  return availableKey
}

// Mark a license key as used
export async function markLicenseKeyAsUsed(key: string, customerEmail: string): Promise<LicenseKey | null> {
  const keyIndex = licenseKeys.findIndex((k) => k.key === key)

  if (keyIndex === -1) {
    console.error(`License key not found: ${key}`)
    return null
  }

  // Calculate expiration date based on plan
  const expirationDate = new Date()
  switch (licenseKeys[keyIndex].plan) {
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

  // Update the license key
  licenseKeys[keyIndex] = {
    ...licenseKeys[keyIndex],
    used: true,
    issuedTo: customerEmail,
    issuedAt: new Date(),
    expiresAt: expirationDate,
  }

  return licenseKeys[keyIndex]
}

// In a real application, you would have functions to:
// - Add new license keys to the pool
// - Check if a license key is valid
// - Revoke a license key
// - Get all license keys for reporting
