"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AddSubscriptionDialog({
  children,
  userId,
}: {
  children: React.ReactNode
  userId: string
}) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const { error } = await supabase.from("subscriptions").insert({
      name: formData.get("name") as string,
      cost: Number.parseFloat(formData.get("cost") as string),
      renewal_date: formData.get("renewal_date") as string,
      billing_cycle: formData.get("billing_cycle") as string,
      owner: (formData.get("owner") as string) || null,
      team: (formData.get("team") as string) || null,
      status: formData.get("status") as string,
      user_id: userId,
    })

    setIsLoading(false)

    if (!error) {
      setOpen(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Subscription</DialogTitle>
          <DialogDescription>Add a new subscription to track renewals and costs.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="e.g., Figma" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Cost</Label>
              <Input id="cost" name="cost" type="number" step="0.01" placeholder="0.00" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing_cycle">Billing Cycle</Label>
              <Select name="billing_cycle" defaultValue="monthly" required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="renewal_date">Renewal Date</Label>
            <Input id="renewal_date" name="renewal_date" type="date" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              <Input id="owner" name="owner" placeholder="Optional" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team">Team</Label>
              <Input id="team" name="team" placeholder="Optional" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue="active" required>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Subscription"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
