import { type NextRequest, NextResponse } from "next/server"
import { fetchVersionInfo, getLatestDownloadUrl, formatFileSize, formatReleaseDate } from "@/lib/pcloud-integration"

// Your actual pCloud JSON URL
const VERSION_JSON_URL = "https://u.pcloud.link/publink/show?code=XZ6Lzj5Zxla37ghWh2BP3WQR0HDXtuhDTQfV"

export async function GET(request: NextRequest) {
  try {
    console.log("[DEBUG] Fetching latest version info...")

    // Fetch version information from your pCloud-hosted JSON
    const versionInfo = await fetchVersionInfo(VERSION_JSON_URL)

    // Get the direct download URL for the software
    const directDownloadUrl = await getLatestDownloadUrl(versionInfo)

    // Return the version info with direct download URL
    const response = {
      success: true,
      version: versionInfo.latest_version,
      downloadUrl: directDownloadUrl,
      filename: versionInfo.file_name,
      fileSize: versionInfo.file_size,
      fileSizeFormatted: formatFileSize(versionInfo.file_size),
      releaseNotes: versionInfo.release_notes,
      changelog: versionInfo.changelog,
      releaseDate: versionInfo.release_date,
      releaseDateFormatted: formatReleaseDate(versionInfo.release_date),
      minimumVersion: versionInfo.minimum_version,
      forceUpdate: versionInfo.force_update,
    }

    console.log("[DEBUG] Version info response:", response)

    return NextResponse.json(response)
  } catch (error) {
    console.error("[ERROR] Failed to get latest version:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch latest version information",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
