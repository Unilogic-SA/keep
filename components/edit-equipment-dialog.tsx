"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Equipment = {
  id: string
  item_name: string
  serial_number: string | null
  purchase_date: string | null
  value: number | null
  condition: string | null
  assigned_to: string | null
  availability: string
  receipt_url: string | null
}

export function EditEquipmentDialog({
  equipment,
  open,
  onOpenChange,
}: {
  equipment: Equipment
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const { error } = await supabase
      .from("equipment")
      .update({
        item_name: formData.get("item_name") as string,
        serial_number: (formData.get("serial_number") as string) || null,
        purchase_date: (formData.get("purchase_date") as string) || null,
        value: formData.get("value") ? Number.parseFloat(formData.get("value") as string) : null,
        condition: (formData.get("condition") as string) || null,
        assigned_to: (formData.get("assigned_to") as string) || null,
        availability: formData.get("availability") as string,
        receipt_url: (formData.get("receipt_url") as string) || null,
      })
      .eq("id", equipment.id)

    setIsLoading(false)

    if (!error) {
      onOpenChange(false)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Equipment</DialogTitle>
          <DialogDescription>Update equipment details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-item_name">Item Name</Label>
            <Input id="edit-item_name" name="item_name" defaultValue={equipment.item_name} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-serial_number">Serial Number</Label>
              <Input id="edit-serial_number" name="serial_number" defaultValue={equipment.serial_number || ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-value">Value</Label>
              <Input id="edit-value" name="value" type="number" step="0.01" defaultValue={equipment.value || ""} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-purchase_date">Purchase Date</Label>
              <Input
                id="edit-purchase_date"
                name="purchase_date"
                type="date"
                defaultValue={equipment.purchase_date || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-condition">Condition</Label>
              <Input id="edit-condition" name="condition" defaultValue={equipment.condition || ""} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-assigned_to">Assigned To</Label>
              <Input id="edit-assigned_to" name="assigned_to" defaultValue={equipment.assigned_to || ""} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-availability">Availability</Label>
              <Select name="availability" defaultValue={equipment.availability} required>
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
            <Label htmlFor="edit-receipt_url">Receipt URL</Label>
            <Input id="edit-receipt_url" name="receipt_url" type="url" defaultValue={equipment.receipt_url || ""} />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
