import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: categories, error } = await supabase.from("product_categories").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching categories:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      categories: categories,
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()

    const categoryData = await request.json()

    // Add timestamps
    const now = new Date().toISOString()
    categoryData.created_at = now
    categoryData.updated_at = now

    // Insert the category
    const { data: category, error } = await supabase.from("product_categories").insert([categoryData]).select().single()

    if (error) {
      console.error("Error creating category:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Revalidate the categories page to update the cache
    revalidatePath("/admin/products/categories")

    return NextResponse.json({
      success: true,
      category: category,
    })
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

