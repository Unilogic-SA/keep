"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, ExternalLink, Search, FileText, History, QrCode } from "lucide-react"
import { EditEquipmentDialog } from "./edit-equipment-dialog"
import { DeleteEquipmentDialog } from "./delete-equipment-dialog"
import { EquipmentHistoryDialog } from "./equipment-history-dialog"
import { EquipmentQRDialog } from "./equipment-qr-dialog"

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
  user_id: string
  created_at: string
}

export function EquipmentTable({ equipment }: { equipment: Equipment[] }) {
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null)
  const [deletingEquipment, setDeletingEquipment] = useState<Equipment | null>(null)
  const [historyEquipment, setHistoryEquipment] = useState<Equipment | null>(null)
  const [qrEquipment, setQrEquipment] = useState<Equipment | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Computers":
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20"
      case "Cameras":
        return "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20"
      case "Audio":
        return "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20"
      case "Networking":
        return "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20"
      case "Furniture":
        return "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
      case "Accessories":
        return "bg-teal-500/10 text-teal-500 hover:bg-teal-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
    }
  }

  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      const matchesSearch =
        item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.serial_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.assigned_to?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesAvailability = availabilityFilter === "all" || item.availability === availabilityFilter
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

      return matchesSearch && matchesAvailability && matchesCategory
    })
  }, [equipment, searchQuery, availabilityFilter, categoryFilter])

  if (equipment.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-muted-foreground">No equipment yet. Add your first item to get started.</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by item name, serial number, or assignee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Computers">Computers</SelectItem>
            <SelectItem value="Cameras">Cameras</SelectItem>
            <SelectItem value="Audio">Audio</SelectItem>
            <SelectItem value="Networking">Networking</SelectItem>
            <SelectItem value="Furniture">Furniture</SelectItem>
            <SelectItem value="Accessories">Accessories</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Availability</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="storage">Storage</SelectItem>
            <SelectItem value="repair">Repair</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
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
            {filteredEquipment.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  No equipment matches your filters
                </TableCell>
              </TableRow>
            ) : (
              filteredEquipment.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.item_name}</TableCell>
                  <TableCell>
                    {item.category ? (
                      <Badge variant="secondary" className={getCategoryColor(item.category)}>
                        {item.category}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
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
                      <Button variant="ghost" size="icon" onClick={() => setQrEquipment(item)} title="View QR Code">
                        <QrCode className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setHistoryEquipment(item)}
                        title="View History"
                      >
                        <History className="h-4 w-4" />
                      </Button>
                      {item.receipt_file_url && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={item.receipt_file_url} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
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
              ))
            )}
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

      {historyEquipment && (
        <EquipmentHistoryDialog
          equipmentId={historyEquipment.id}
          equipmentName={historyEquipment.item_name}
          open={!!historyEquipment}
          onOpenChange={(open) => !open && setHistoryEquipment(null)}
        />
      )}

      {qrEquipment && (
        <EquipmentQRDialog
          equipmentId={qrEquipment.id}
          equipmentName={qrEquipment.item_name}
          open={!!qrEquipment}
          onOpenChange={(open) => !open && setQrEquipment(null)}
        />
      )}
    </>
  )
}
