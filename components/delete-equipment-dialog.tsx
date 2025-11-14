"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type Equipment = {
  id: string
  item_name: string
}

export function DeleteEquipmentDialog({
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

  const handleDelete = async () => {
    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from("equipment").delete().eq("id", equipment.id)

    setIsLoading(false)

    if (!error) {
      onOpenChange(false)
      toast({
        title: "Equipment deleted",
        description: `${equipment.item_name} has been removed from your inventory.`,
      })
      router.refresh()
    } else {
      toast({
        title: "Delete failed",
        description: "Could not delete equipment. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the equipment &quot;{equipment.item_name}&quot;. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
