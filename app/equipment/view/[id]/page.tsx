import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, FileText } from "lucide-react"

export default async function PublicEquipmentViewPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: equipment } = await supabase.from("equipment").select("*").eq("id", params.id).single()

  if (!equipment) {
    notFound()
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "assigned":
        return "bg-blue-500/10 text-blue-500"
      case "storage":
        return "bg-green-500/10 text-green-500"
      case "repair":
        return "bg-orange-500/10 text-orange-500"
      default:
        return ""
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Computers":
        return "bg-purple-500/10 text-purple-500"
      case "Cameras":
        return "bg-pink-500/10 text-pink-500"
      case "Audio":
        return "bg-indigo-500/10 text-indigo-500"
      case "Networking":
        return "bg-cyan-500/10 text-cyan-500"
      case "Furniture":
        return "bg-amber-500/10 text-amber-500"
      case "Accessories":
        return "bg-teal-500/10 text-teal-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{equipment.item_name}</CardTitle>
                <CardDescription>Equipment Details</CardDescription>
              </div>
              <div className="flex gap-2">
                {equipment.category && (
                  <Badge variant="secondary" className={getCategoryColor(equipment.category)}>
                    {equipment.category}
                  </Badge>
                )}
                <Badge variant="secondary" className={getAvailabilityColor(equipment.availability)}>
                  {equipment.availability}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Serial Number</p>
                <p className="text-base">{equipment.serial_number || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Value</p>
                <p className="text-base">
                  {equipment.value ? `$${Number.parseFloat(equipment.value.toString()).toFixed(2)}` : "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Purchase Date</p>
                <p className="text-base">
                  {equipment.purchase_date
                    ? new Date(equipment.purchase_date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Condition</p>
                <p className="text-base">{equipment.condition || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned To</p>
                <p className="text-base">{equipment.assigned_to || "Unassigned"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Availability</p>
                <p className="text-base capitalize">{equipment.availability}</p>
              </div>
            </div>

            {(equipment.receipt_file_url || equipment.receipt_url) && (
              <div className="space-y-2 border-t pt-4">
                <p className="text-sm font-medium">Attachments</p>
                <div className="flex gap-2">
                  {equipment.receipt_file_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={equipment.receipt_file_url} target="_blank" rel="noopener noreferrer">
                        <FileText className="mr-2 h-4 w-4" />
                        View Receipt/Warranty
                      </a>
                    </Button>
                  )}
                  {equipment.receipt_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={equipment.receipt_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        External Link
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
