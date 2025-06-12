// pCloud integration for Apex Automation with your actual links

export interface VersionInfo {
  latest_version: string
  download_url: string
  release_notes: string
  file_size: number
  file_name: string
  release_date: string
  minimum_version: string
  force_update: boolean
  changelog: string[]
}

/**
 * Convert pCloud public link to direct download URL
 * Based on your updater.py logic
 */
export async function convertPcloudPublicToApi(publicUrl: string): Promise<string> {
  try {
    console.log(`[DEBUG] Converting pCloud public link: ${publicUrl}`)

    const response = await fetch(publicUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const htmlContent = await response.text()

    // Extract the downloadlink from the HTML
    const match = htmlContent.match(/"downloadlink":\s*"((?:\\.|[^"\\])*)"/)

    if (!match) {
      console.warn(`[WARNING] Could not find 'downloadlink' in HTML content`)
      return publicUrl // Fallback to original URL
    }

    const scrapedUrlWithEscapes = match[1]
    console.log(`[DEBUG] Found raw downloadlink: ${scrapedUrlWithEscapes}`)

    // Clean the URL - remove backslashes used for JSON escaping
    const cleanedUrl = scrapedUrlWithEscapes.replace(/\\/g, "")
    console.log(`[DEBUG] Cleaned download link: ${cleanedUrl}`)

    // Test the cleaned URL
    const testResponse = await fetch(cleanedUrl, {
      method: "HEAD",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (testResponse.ok) {
      console.log(`[SUCCESS] pCloud URL validated successfully`)
      return cleanedUrl
    } else {
      console.warn(`[WARNING] Cleaned URL test failed with status ${testResponse.status}`)
      return publicUrl // Fallback
    }
  } catch (error) {
    console.error(`[ERROR] pCloud conversion failed:`, error)
    return publicUrl // Fallback to original URL
  }
}

/**
 * Fetch version information from your JSON pCloud file
 */
export async function fetchVersionInfo(jsonPcloudUrl: string): Promise<VersionInfo> {
  try {
    console.log(`[DEBUG] Fetching version info from: ${jsonPcloudUrl}`)

    // Convert public link to direct API download
    const directUrl = await convertPcloudPublicToApi(jsonPcloudUrl)
    console.log(`[DEBUG] Using direct JSON URL: ${directUrl}`)

    // Download version info
    const response = await fetch(directUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const contentType = response.headers.get("content-type") || ""
    console.log(`[DEBUG] Content type: ${contentType}`)

    const responseText = await response.text()

    // Check if we got HTML instead of JSON
    if (responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
      throw new Error("Received HTML page instead of JSON file. Check pCloud link.")
    }

    // Check if response is empty
    if (!responseText.trim()) {
      throw new Error("Empty response from version check URL")
    }

    console.log(`[DEBUG] Response content (first 200 chars): ${responseText.substring(0, 200)}`)

    // Parse JSON
    const versionData: VersionInfo = JSON.parse(responseText)
    console.log(`[DEBUG] Parsed version data:`, versionData)

    return versionData
  } catch (error) {
    console.error(`[ERROR] Failed to fetch version info:`, error)
    throw error
  }
}

/**
 * Get the latest software download URL from the version info
 */
export async function getLatestDownloadUrl(versionInfo: VersionInfo): Promise<string> {
  try {
    console.log(`[DEBUG] Converting software download URL: ${versionInfo.download_url}`)

    // Convert the download URL from public link to direct download
    const directDownloadUrl = await convertPcloudPublicToApi(versionInfo.download_url)

    console.log(`[DEBUG] Direct download URL: ${directDownloadUrl}`)
    return directDownloadUrl
  } catch (error) {
    console.error(`[ERROR] Failed to get download URL:`, error)
    throw error
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "Size unknown"
  const mb = bytes / (1024 * 1024)
  if (mb < 1) {
    const kb = bytes / 1024
    return `${kb.toFixed(1)} KB`
  }
  return `${mb.toFixed(1)} MB`
}

/**
 * Format release date for display
 */
export function formatReleaseDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch (error) {
    return "Unknown date"
  }
}
