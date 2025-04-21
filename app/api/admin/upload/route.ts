import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()

    // Kiểm tra các bucket khả dụng
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    console.log("Available buckets:", buckets, "Error:", bucketsError)

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
    const folder = formData.get("folder") as string || "products"
    const filePath = `${folder}/${fileName}`

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Xác định bucket để sử dụng
    let bucketName = "CNC"

    // Nếu có danh sách bucket, kiểm tra xem bucket nào tồn tại
    if (buckets && buckets.length > 0) {
      // Kiểm tra xem bucket CNC có tồn tại không
      const cncBucket = buckets.find(b => b.name === "CNC")
      if (!cncBucket) {
        // Nếu không tồn tại, sử dụng bucket đầu tiên trong danh sách
        bucketName = buckets[0].name
        console.log("CNC bucket not found, using:", bucketName)
      }
    } else {
      // Nếu không có bucket nào, thử tạo bucket mới
      try {
        console.log("No buckets found, trying to create one")
        const { data: newBucket, error: createError } = await supabase.storage.createBucket("uploads", {
          public: true
        })

        if (!createError) {
          bucketName = "uploads"
          console.log("Created new bucket:", bucketName)
        } else {
          console.error("Error creating bucket:", createError)
        }
      } catch (err) {
        console.error("Exception creating bucket:", err)
      }
    }

    console.log("Uploading to bucket:", bucketName, "path:", filePath)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from(bucketName).upload(filePath, buffer, {
      contentType: fileType,
      cacheControl: "3600",
      upsert: false,
    })

    console.log("Upload result:", { data, error })

    if (error) {
      console.error("Error uploading file:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

