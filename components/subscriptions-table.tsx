"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
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
}

export function SubscriptionsTable({ subscriptions }: { subscriptions: Subscription[] }) {
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null)
  const [deletingSubscription, setDeletingSubscription] = useState<Subscription | null>(null)

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

  if (subscriptions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">No subscriptions yet. Add your first subscription to get started.</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Billing Cycle</TableHead>
              <TableHead>Renewal Date</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell className="font-medium">{subscription.name}</TableCell>
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
            ))}
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
