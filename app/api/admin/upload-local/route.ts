import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check file type
    const fileType = file.type
    if (!fileType.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Generate a unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`

    // Get the folder from formData or use default
    const folder = formData.get("folder") as string || "uploads"

    // Create folder path
    const folderPath = join(process.cwd(), "public", folder)
    const filePath = join(folderPath, fileName)
    const publicPath = `/${folder}/${fileName}`

    console.log("Saving file to:", filePath)

    try {
      // Ensure folder exists
      if (!existsSync(folderPath)) {
        console.log("Creating folder:", folderPath)
        await mkdir(folderPath, { recursive: true })
      }

      await writeFile(filePath, Buffer.from(await file.arrayBuffer()))
      console.log("File saved successfully")

      return NextResponse.json({
        success: true,
        url: publicPath,
        fileName: fileName,
      })
    } catch (error) {
      console.error("Error saving file:", error)
      return NextResponse.json({ error: "Failed to save file" }, { status: 500 })
    }
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
