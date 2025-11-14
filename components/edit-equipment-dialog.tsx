"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from 'lucide-react'

type Equipment = {
  id: string
  item_name: string
  serial_number: string | null
  purchase_date: string | null
  value: number | null
  condition: string | null
  assigned_to: string | null
  availability: string
  category: string | null
  receipt_url: string | null
  receipt_file_url: string | null
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
  const [uploadedFile, setUploadedFile] = useState<string | null>(equipment.receipt_file_url)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        setUploadedFile(url)
        toast({
          title: "File uploaded",
          description: "Receipt uploaded successfully.",
        })
      }
    } catch (error) {
      console.error("Upload failed:", error)
      toast({
        title: "Upload failed",
        description: "Could not upload file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const logHistoryChange = async (field: string, oldValue: any, newValue: any) => {
    if (oldValue === newValue) return

    try {
      await fetch("/api/equipment-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipment_id: equipment.id,
          field_changed: field,
          old_value: oldValue,
          new_value: newValue,
        }),
      })
    } catch (error) {
      console.error("Failed to log history:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const newAssignedTo = (formData.get("assigned_to") as string) || null
    const newAvailability = formData.get("availability") as string
    const newCondition = (formData.get("condition") as string) || null
    const itemName = formData.get("item_name") as string

    const { error } = await supabase
      .from("equipment")
      .update({
        item_name: itemName,
        serial_number: (formData.get("serial_number") as string) || null,
        purchase_date: (formData.get("purchase_date") as string) || null,
        value: formData.get("value") ? Number.parseFloat(formData.get("value") as string) : null,
        condition: newCondition,
        assigned_to: newAssignedTo,
        availability: newAvailability,
        category: (formData.get("category") as string) || null,
        receipt_url: (formData.get("receipt_url") as string) || null,
        receipt_file_url: uploadedFile,
      })
      .eq("id", equipment.id)

    if (!error) {
      await Promise.all([
        logHistoryChange("assigned_to", equipment.assigned_to, newAssignedTo),
        logHistoryChange("availability", equipment.availability, newAvailability),
        logHistoryChange("condition", equipment.condition, newCondition),
      ])
    }

    setIsLoading(false)

    if (!error) {
      onOpenChange(false)
      toast({
        title: "Changes saved!",
        description: `${itemName} has been updated successfully.`,
      })
      router.refresh()
    } else {
      toast({
        title: "Update failed",
        description: "Could not save changes. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Equipment</DialogTitle>
          <DialogDescription>Update equipment details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-item_name">Item Name *</Label>
            <Input
              id="edit-item_name"
              name="item_name"
              defaultValue={equipment.item_name}
              required
              minLength={1}
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Select name="category" defaultValue={equipment.category || undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Computers">Computers</SelectItem>
                <SelectItem value="Cameras">Cameras</SelectItem>
                <SelectItem value="Audio">Audio</SelectItem>
                <SelectItem value="Networking">Networking</SelectItem>
                <SelectItem value="Furniture">Furniture</SelectItem>
                <SelectItem value="Accessories">Accessories</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-serial_number">Serial Number</Label>
              <Input
                id="edit-serial_number"
                name="serial_number"
                defaultValue={equipment.serial_number || ""}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-value">Value</Label>
              <Input
                id="edit-value"
                name="value"
                type="number"
                step="0.01"
                min="0"
                max="9999999.99"
                defaultValue={equipment.value || ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-purchase_date">Purchase Date</Label>
              <Input
                id="edit-purchase_date"
                name="purchase_date"
                type="date"
                max={new Date().toISOString().split("T")[0]}
                defaultValue={equipment.purchase_date || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-condition">Condition</Label>
              <Input id="edit-condition" name="condition" defaultValue={equipment.condition || ""} maxLength={50} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-assigned_to">Assigned To</Label>
              <Input
                id="edit-assigned_to"
                name="assigned_to"
                defaultValue={equipment.assigned_to || ""}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-availability">Availability *</Label>
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
            <Input
              id="edit-receipt_url"
              name="receipt_url"
              type="url"
              defaultValue={equipment.receipt_url || ""}
              maxLength={500}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-receipt_file">Upload Receipt/Warranty (PDF, Image)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="edit-receipt_file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="flex-1"
              />
              {isUploading && <Upload className="h-4 w-4 animate-pulse" />}
            </div>
            {uploadedFile && (
              <p className="text-xs text-green-600">
                {uploadedFile === equipment.receipt_file_url ? "Current file attached" : "New file uploaded"}
              </p>
            )}
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
