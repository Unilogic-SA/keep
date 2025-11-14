import { redirect } from 'next/navigation'
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { SubscriptionsTable } from "@/components/subscriptions-table"
import { AddSubscriptionDialog } from "@/components/add-subscription-dialog"
import { AppLayout } from "@/components/app-layout"
import { Suspense } from "react"
import { TableSkeleton } from "@/components/table-skeleton"

async function SubscriptionsContent() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Subscriptions</h2>
          <p className="text-muted-foreground">Manage your SaaS subscriptions and renewals</p>
        </div>
        <AddSubscriptionDialog userId={user.id}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Subscription
          </Button>
        </AddSubscriptionDialog>
      </div>

      <SubscriptionsTable subscriptions={subscriptions || []} />
    </>
  )
}

export default async function SubscriptionsPage() {
  return (
    <AppLayout>
      <div className="p-8">
        <Suspense fallback={<TableSkeleton columns={10} rows={5} />}>
          <SubscriptionsContent />
        </Suspense>
      </div>
    </AppLayout>
  )
}
