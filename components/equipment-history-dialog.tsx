"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

type HistoryEntry = {
  id: string
  field_changed: string
  old_value: string | null
  new_value: string | null
  changed_at: string
}

export function EquipmentHistoryDialog({
  equipmentId,
  equipmentName,
  open,
  onOpenChange,
}: {
  equipmentId: string
  equipmentName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (open) {
      loadHistory()
    }
  }, [open, equipmentId])

  const loadHistory = async () => {
    setIsLoading(true)
    const supabase = createClient()

    const { data, error } = await supabase
      .from("equipment_history")
      .select("*")
      .eq("equipment_id", equipmentId)
      .order("changed_at", { ascending: false })

    if (!error && data) {
      setHistory(data)
    }
    setIsLoading(false)
  }

  const formatFieldName = (field: string) => {
    return field
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Equipment History</DialogTitle>
          <DialogDescription>Complete timeline for {equipmentName}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">No history recorded yet</div>
          ) : (
            <div className="space-y-4">
              {history.map((entry) => (
                <div key={entry.id} className="flex gap-4 rounded-lg border p-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{formatFieldName(entry.field_changed)}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(entry.changed_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="text-sm">
                      {entry.old_value && (
                        <span className="text-muted-foreground">
                          <span className="line-through">{entry.old_value}</span>
                          {" → "}
                        </span>
                      )}
                      <span className="font-medium">{entry.new_value || "Not set"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
