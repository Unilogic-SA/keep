"use client"

import { useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import QRCode from "qrcode"

export function EquipmentQRDialog({
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
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (open && canvasRef.current) {
      const url = `${window.location.origin}/equipment/view/${equipmentId}`
      QRCode.toCanvas(canvasRef.current, url, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
    }
  }, [open, equipmentId])

  const handleDownload = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = `${equipmentName.replace(/\s+/g, "-")}-qr-code.png`
      link.href = url
      link.click()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription>Scan to view equipment details</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          <div className="rounded-lg border p-4 bg-white">
            <canvas ref={canvasRef} />
          </div>
          <div className="text-center">
            <p className="font-medium">{equipmentName}</p>
            <p className="text-xs text-muted-foreground mt-1">Print this QR code and attach it to the equipment</p>
          </div>
          <Button onClick={handleDownload} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
