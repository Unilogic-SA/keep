import { redirect } from 'next/navigation'
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { EquipmentTable } from "@/components/equipment-table"
import { AddEquipmentDialog } from "@/components/add-equipment-dialog"
import { AppLayout } from "@/components/app-layout"
import { Suspense } from "react"
import { TableSkeleton } from "@/components/table-skeleton"

async function EquipmentContent() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: equipment } = await supabase
    .from("equipment")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Equipment</h2>
          <p className="text-muted-foreground">Track your hardware and equipment inventory</p>
        </div>
        <AddEquipmentDialog userId={user.id}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Equipment
          </Button>
        </AddEquipmentDialog>
      </div>

      <EquipmentTable equipment={equipment || []} />
    </>
  )
}

export default async function EquipmentPage() {
  return (
    <AppLayout>
      <div className="p-8">
        <Suspense fallback={<TableSkeleton columns={9} rows={5} />}>
          <EquipmentContent />
        </Suspense>
      </div>
    </AppLayout>
  )
}
