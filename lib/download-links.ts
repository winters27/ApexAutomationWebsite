// This file manages download links for software

// Define download links for different versions of the software
// In a real application, these would be stored in a database or configuration
export const downloadLinks = {
  // Main software download
  software: {
    url: "/downloads/apex-automation-latest.zip",
    filename: "apex-automation-latest.zip",
    version: "1.0.0",
  },

  // Additional downloads
  extras: {
    userGuide: {
      url: "/downloads/apex-automation-user-guide.pdf",
      filename: "apex-automation-user-guide.pdf",
    },
    quickStart: {
      url: "/downloads/apex-automation-quick-start.pdf",
      filename: "apex-automation-quick-start.pdf",
    },
  },
}

// Generate a signed/time-limited download URL
// In a real application, you would generate signed URLs that expire
export function generateDownloadUrl(type: "software" | "userGuide" | "quickStart"): string {
  if (type === "software") {
    return downloadLinks.software.url
  } else if (type === "userGuide") {
    return downloadLinks.extras.userGuide.url
  } else if (type === "quickStart") {
    return downloadLinks.extras.quickStart.url
  }

  throw new Error(`Unknown download type: ${type}`)
}
