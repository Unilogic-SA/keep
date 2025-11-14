"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from 'lucide-react'

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
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (open) {
      setIsLoading(true)
      const equipmentUrl = `${window.location.origin}/equipment/view/${equipmentId}`
      // Using a reliable QR code API that returns SVG
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(equipmentUrl)}&format=png`
      setQrCodeUrl(qrUrl)
      setIsLoading(false)
    }
  }, [open, equipmentId])

  const handleDownload = async () => {
    try {
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.download = `${equipmentName.replace(/\s+/g, "-")}-qr-code.png`
      link.href = url
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to download QR code:", error)
    }
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>QR Code - ${equipmentName}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                font-family: system-ui, -apple-system, sans-serif;
              }
              .container {
                text-align: center;
                padding: 2rem;
              }
              img {
                border: 2px solid #000;
                padding: 1rem;
                background: white;
              }
              h2 {
                margin-top: 1rem;
                font-size: 1.5rem;
              }
              p {
                color: #666;
                font-size: 0.875rem;
              }
              @media print {
                body {
                  min-height: auto;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <img src="${qrCodeUrl}" alt="QR Code" />
              <h2>${equipmentName}</h2>
              <p>Scan to view equipment details</p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription>Scan to view equipment details instantly</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-6">
          {isLoading ? (
            <div className="flex h-[300px] w-[300px] items-center justify-center rounded-lg border bg-muted">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-lg border-2 p-4 bg-white">
              <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="h-[300px] w-[300px]" />
            </div>
          )}
          
          <div className="text-center space-y-1">
            <p className="font-semibold text-lg">{equipmentName}</p>
            <p className="text-sm text-muted-foreground">Print this QR code and attach it to the equipment</p>
          </div>

          <div className="flex gap-2 w-full">
            <Button onClick={handleDownload} variant="outline" className="flex-1" disabled={isLoading}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button onClick={handlePrint} className="flex-1" disabled={isLoading}>
              Print
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
