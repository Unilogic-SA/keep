import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, Calendar, TrendingUp } from "lucide-react"
import { AppLayout } from "@/components/app-layout"
import { CategorySpendingChart } from "@/components/category-spending-chart"
import { CategoryHardwareChart } from "@/components/category-hardware-chart"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch subscriptions data
  const { data: subscriptions } = await supabase.from("subscriptions").select("*").eq("user_id", user.id)

  // Fetch equipment data
  const { data: equipment } = await supabase.from("equipment").select("*").eq("user_id", user.id)

  // Calculate metrics
  const totalMonthlySpend =
    subscriptions?.reduce((sum, sub) => {
      const cost = Number.parseFloat(sub.cost.toString())
      return sum + (sub.billing_cycle === "monthly" ? cost : cost / 12)
    }, 0) || 0

  const totalHardwareValue =
    equipment?.reduce((sum, item) => {
      return sum + Number.parseFloat(item.value?.toString() || "0")
    }, 0) || 0

  // Get upcoming renewals (next 30 days)
  const today = new Date()
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

  const upcomingRenewals =
    subscriptions
      ?.filter((sub) => {
        const renewalDate = new Date(sub.renewal_date)
        return renewalDate >= today && renewalDate <= thirtyDaysFromNow && sub.status === "active"
      })
      .sort((a, b) => new Date(a.renewal_date).getTime() - new Date(b.renewal_date).getTime()) || []

  // Get recent additions (last 7 days)
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const recentSubscriptions = subscriptions?.filter((sub) => new Date(sub.created_at) >= sevenDaysAgo).length || 0
  const recentEquipment = equipment?.filter((item) => new Date(item.created_at) >= sevenDaysAgo).length || 0

  return (
    <AppLayout>
      <div className="p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Overview of your subscriptions and equipment</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly SaaS Spend</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalMonthlySpend.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{subscriptions?.length || 0} active subscriptions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hardware Value</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalHardwareValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">{equipment?.length || 0} items tracked</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Renewals</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingRenewals.length}</div>
              <p className="text-xs text-muted-foreground">Next 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Additions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentSubscriptions + recentEquipment}</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Charts and Upcoming Renewals */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <CategorySpendingChart subscriptions={subscriptions || []} />
          <CategoryHardwareChart equipment={equipment || []} />
        </div>

        {/* Upcoming Renewals */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Renewals</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingRenewals.length > 0 ? (
              <div className="space-y-4">
                {upcomingRenewals.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{sub.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(sub.renewal_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${Number.parseFloat(sub.cost.toString()).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground capitalize">{sub.billing_cycle}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No upcoming renewals in the next 30 days</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
