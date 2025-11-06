import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { equipment_id, field_changed, old_value, new_value } = body

    const { error } = await supabase.from("equipment_history").insert({
      equipment_id,
      user_id: user.id,
      field_changed,
      old_value: old_value?.toString() || null,
      new_value: new_value?.toString() || null,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to log history" }, { status: 500 })
  }
}
