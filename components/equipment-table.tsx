"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, ExternalLink } from "lucide-react"
import { EditEquipmentDialog } from "./edit-equipment-dialog"
import { DeleteEquipmentDialog } from "./delete-equipment-dialog"

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
  user_id: string
  created_at: string
}

export function EquipmentTable({ equipment }: { equipment: Equipment[] }) {
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null)
  const [deletingEquipment, setDeletingEquipment] = useState<Equipment | null>(null)

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "assigned":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "storage":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "repair":
        return "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
      default:
        return ""
    }
  }

  if (equipment.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">No equipment yet. Add your first item to get started.</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Purchase Date</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipment.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.item_name}</TableCell>
                <TableCell>{item.serial_number || "-"}</TableCell>
                <TableCell>{item.value ? `$${Number.parseFloat(item.value.toString()).toFixed(2)}` : "-"}</TableCell>
                <TableCell>
                  {item.purchase_date
                    ? new Date(item.purchase_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "-"}
                </TableCell>
                <TableCell>{item.condition || "-"}</TableCell>
                <TableCell>{item.assigned_to || "-"}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getAvailabilityColor(item.availability)}>
                    {item.availability}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {item.receipt_url && (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={item.receipt_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => setEditingEquipment(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeletingEquipment(item)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingEquipment && (
        <EditEquipmentDialog
          equipment={editingEquipment}
          open={!!editingEquipment}
          onOpenChange={(open) => !open && setEditingEquipment(null)}
        />
      )}

      {deletingEquipment && (
        <DeleteEquipmentDialog
          equipment={deletingEquipment}
          open={!!deletingEquipment}
          onOpenChange={(open) => !open && setDeletingEquipment(null)}
        />
      )}
    </>
  )
}
