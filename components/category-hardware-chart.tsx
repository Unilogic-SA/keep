"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

type Equipment = {
  category: string | null
  value: number | null
}

const COLORS = {
  Computers: "#a855f7",
  Cameras: "#ec4899",
  Audio: "#6366f1",
  Networking: "#06b6d4",
  Furniture: "#f59e0b",
  Accessories: "#14b8a6",
  Other: "#6b7280",
}

export function CategoryHardwareChart({ equipment }: { equipment: Equipment[] }) {
  // Group equipment by category and sum values
  const categoryData = equipment.reduce(
    (acc, item) => {
      const category = item.category || "Other"
      const value = Number.parseFloat(item.value?.toString() || "0")

      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += value

      return acc
    },
    {} as Record<string, number>,
  )

  // Convert to array format for chart
  const chartData = Object.entries(categoryData)
    .map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hardware Value by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No equipment data available. Add equipment to see the breakdown.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hardware Value by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name as keyof typeof COLORS] || COLORS.Other} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `$${value.toFixed(2)}`}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "6px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] || COLORS.Other }}
                />
                <span>{item.name}</span>
              </div>
              <span className="font-medium">${item.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
