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
import { FileText } from "lucide-react"

type Subscription = {
  id: string
  name: string
  cost: number
  renewal_date: string
  billing_cycle: string
  owner: string | null
  team: string | null
  status: string
  category?: string | null
  invoice_file_url?: string | null
}

export function EditSubscriptionDialog({
  subscription,
  open,
  onOpenChange,
}: {
  subscription: Subscription
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    let invoiceFileUrl = subscription.invoice_file_url
    if (selectedFile) {
      try {
        const uploadFormData = new FormData()
        uploadFormData.append("file", selectedFile)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        })

        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json()
          invoiceFileUrl = url
        }
      } catch (error) {
        console.error("File upload failed:", error)
      }
    }

    const supabase = createClient()

    const { error } = await supabase
      .from("subscriptions")
      .update({
        name: formData.get("name") as string,
        cost: Number.parseFloat(formData.get("cost") as string),
        renewal_date: formData.get("renewal_date") as string,
        billing_cycle: formData.get("billing_cycle") as string,
        owner: (formData.get("owner") as string) || null,
        team: (formData.get("team") as string) || null,
        status: formData.get("status") as string,
        category: (formData.get("category") as string) || null,
        invoice_file_url: invoiceFileUrl,
      })
      .eq("id", subscription.id)

    setIsLoading(false)

    if (!error) {
      onOpenChange(false)
      setSelectedFile(null)
      router.refresh()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Subscription</DialogTitle>
          <DialogDescription>Update subscription details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name *</Label>
            <Input id="edit-name" name="name" defaultValue={subscription.name} required minLength={1} maxLength={100} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-cost">Cost *</Label>
              <Input
                id="edit-cost"
                name="cost"
                type="number"
                step="0.01"
                min="0"
                max="999999.99"
                defaultValue={subscription.cost}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-billing_cycle">Billing Cycle *</Label>
              <Select name="billing_cycle" defaultValue={subscription.billing_cycle} required>
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
            <Label htmlFor="edit-renewal_date">Renewal Date *</Label>
            <Input
              id="edit-renewal_date"
              name="renewal_date"
              type="date"
              defaultValue={subscription.renewal_date}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Category</Label>
            <Select name="category" defaultValue={subscription.category || undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-owner">Owner</Label>
              <Input id="edit-owner" name="owner" defaultValue={subscription.owner || ""} maxLength={100} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-team">Team</Label>
              <Input id="edit-team" name="team" defaultValue={subscription.team || ""} maxLength={100} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">Status *</Label>
            <Select name="status" defaultValue={subscription.status} required>
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

          <div className="space-y-2">
            <Label htmlFor="edit-invoice_file">Invoice/Contract (PDF)</Label>
            {subscription.invoice_file_url && !selectedFile && (
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted mb-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <a
                  href={subscription.invoice_file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex-1"
                >
                  View current file
                </a>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Input
                id="edit-invoice_file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="cursor-pointer"
              />
              {selectedFile && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
                  Clear
                </Button>
              )}
            </div>
            {selectedFile && (
              <p className="text-xs text-muted-foreground">
                New file: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
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
