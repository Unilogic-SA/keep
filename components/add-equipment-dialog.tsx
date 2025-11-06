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

export function AddEquipmentDialog({
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

    const { error } = await supabase.from("equipment").insert({
      item_name: formData.get("item_name") as string,
      serial_number: (formData.get("serial_number") as string) || null,
      purchase_date: (formData.get("purchase_date") as string) || null,
      value: formData.get("value") ? Number.parseFloat(formData.get("value") as string) : null,
      condition: (formData.get("condition") as string) || null,
      assigned_to: (formData.get("assigned_to") as string) || null,
      availability: formData.get("availability") as string,
      receipt_url: (formData.get("receipt_url") as string) || null,
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
          <DialogTitle>Add Equipment</DialogTitle>
          <DialogDescription>Add a new equipment item to your inventory.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="item_name">Item Name *</Label>
            <Input
              id="item_name"
              name="item_name"
              placeholder="e.g., MacBook Pro"
              required
              minLength={1}
              maxLength={100}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serial_number">Serial Number</Label>
              <Input id="serial_number" name="serial_number" placeholder="Optional" maxLength={100} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input id="value" name="value" type="number" step="0.01" min="0" max="9999999.99" placeholder="0.00" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchase_date">Purchase Date</Label>
              <Input id="purchase_date" name="purchase_date" type="date" max={new Date().toISOString().split("T")[0]} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Input id="condition" name="condition" placeholder="e.g., New, Good" maxLength={50} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assigned_to">Assigned To</Label>
              <Input id="assigned_to" name="assigned_to" placeholder="Optional" maxLength={100} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability *</Label>
              <Select name="availability" defaultValue="storage" required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="storage">Storage</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receipt_url">Receipt URL</Label>
            <Input id="receipt_url" name="receipt_url" type="url" placeholder="https://..." maxLength={500} />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Equipment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
