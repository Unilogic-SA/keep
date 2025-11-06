"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, Search, FileText } from "lucide-react"
import { EditSubscriptionDialog } from "./edit-subscription-dialog"
import { DeleteSubscriptionDialog } from "./delete-subscription-dialog"

type Subscription = {
  id: string
  name: string
  cost: number
  renewal_date: string
  billing_cycle: string
  owner: string | null
  team: string | null
  status: string
  user_id: string
  created_at: string
  category?: string | null
  invoice_file_url?: string | null
}

export function SubscriptionsTable({ subscriptions }: { subscriptions: Subscription[] }) {
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  const [deletingSubscription, setDeletingSubscription] = useState<Subscription | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [billingCycleFilter, setBillingCycleFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "trial":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "cancelled":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
      default:
        return ""
    }
  }

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((subscription) => {
      const matchesSearch =
        subscription.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subscription.owner?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subscription.team?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || subscription.status === statusFilter
      const matchesBillingCycle = billingCycleFilter === "all" || subscription.billing_cycle === billingCycleFilter
      const matchesCategory = categoryFilter === "all" || subscription.category === categoryFilter

      return matchesSearch && matchesStatus && matchesBillingCycle && matchesCategory
    })
  }, [subscriptions, searchQuery, statusFilter, billingCycleFilter, categoryFilter])

  if (subscriptions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">No subscriptions yet. Add your first subscription to get started.</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex gap-4 mb-4 flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, owner, or team..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={billingCycleFilter} onValueChange={setBillingCycleFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Billing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Billing</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="annual">Annual</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Development">Development</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Legal">Legal</SelectItem>
              <SelectItem value="IT">IT</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Billing Cycle</TableHead>
              <TableHead>Renewal Date</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>File</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  No subscriptions match your filters
                </TableCell>
              </TableRow>
            ) : (
              filteredSubscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell className="font-medium">{subscription.name}</TableCell>
                  <TableCell>
                    {subscription.category ? (
                      <Badge variant="outline">{subscription.category}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>${Number.parseFloat(subscription.cost.toString()).toFixed(2)}</TableCell>
                  <TableCell className="capitalize">{subscription.billing_cycle}</TableCell>
                  <TableCell>
                    {new Date(subscription.renewal_date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{subscription.owner || "-"}</TableCell>
                  <TableCell>{subscription.team || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getStatusColor(subscription.status)}>
                      {subscription.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {subscription.invoice_file_url ? (
                      <a
                        href={subscription.invoice_file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <FileText className="h-4 w-4" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setEditingSubscription(subscription)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeletingSubscription(subscription)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingSubscription && (
        <EditSubscriptionDialog
          subscription={editingSubscription}
          open={!!editingSubscription}
          onOpenChange={(open) => !open && setEditingSubscription(null)}
        />
      )}

      {deletingSubscription && (
        <DeleteSubscriptionDialog
          subscription={deletingSubscription}
          open={!!deletingSubscription}
          onOpenChange={(open) => !open && setDeletingSubscription(null)}
        />
      )}
    </>
  )
}
