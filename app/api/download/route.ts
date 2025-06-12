import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import path from "path"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

// This route handles secure file downloads
export async function GET(request: NextRequest) {
  try {
    // Get the session ID and file type from the query parameters
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("session_id")
    const fileType = searchParams.get("type") || "software"

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 })
    }

    // Verify the session exists and is paid
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 403 })
    }

    // Determine which file to serve
    let filePath: string
    let fileName: string
    let contentType: string

    switch (fileType) {
      case "software":
        filePath = path.join(process.cwd(), "public", "downloads", "apex-automation-latest.zip")
        fileName = "apex-automation-latest.zip"
        contentType = "application/zip"
        break
      case "userGuide":
        filePath = path.join(process.cwd(), "public", "downloads", "apex-automation-user-guide.pdf")
        fileName = "apex-automation-user-guide.pdf"
        contentType = "application/pdf"
        break
      default:
        return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // In a real application, you would check if the file exists
    // For this example, we'll just return a success response

    // In a real implementation, you would:
    // 1. Read the file from disk or cloud storage
    // 2. Set the appropriate headers
    // 3. Return the file as a stream

    // For now, we'll just return a mock response
    return NextResponse.json({
      success: true,
      message: `File ${fileName} would be downloaded here`,
      downloadUrl: `/downloads/${fileName}`,
    })

    // In a real implementation with actual files:
    /*
    const fileBuffer = fs.readFileSync(filePath)
    
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": contentType,
      },
    })
    */
  } catch (error) {
    console.error("Error serving download:", error)
    return NextResponse.json({ error: "Error serving download" }, { status: 500 })
  }
}
