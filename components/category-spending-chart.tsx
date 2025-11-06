"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

type Subscription = {
  cost: number
  billing_cycle: string
  category?: string | null
  status: string
}

const CATEGORY_COLORS: Record<string, string> = {
  Marketing: "#ef4444",
  Design: "#f97316",
  Development: "#3b82f6",
  Operations: "#8b5cf6",
  Sales: "#10b981",
  HR: "#ec4899",
  Finance: "#14b8a6",
  Legal: "#6366f1",
  IT: "#06b6d4",
  Other: "#64748b",
  Uncategorized: "#94a3b8",
}

export function CategorySpendingChart({ subscriptions }: { subscriptions: Subscription[] }) {
  // Calculate spending by category (only active subscriptions)
  const categorySpending = subscriptions
    .filter((sub) => sub.status === "active")
    .reduce(
      (acc, sub) => {
        const category = sub.category || "Uncategorized"
        const monthlyCost = sub.billing_cycle === "monthly" ? sub.cost : sub.cost / 12

        if (!acc[category]) {
          acc[category] = 0
        }
        acc[category] += monthlyCost

        return acc
      },
      {} as Record<string, number>,
    )

  // Convert to chart data format
  const chartData = Object.entries(categorySpending)
    .map(([category, amount]) => ({
      name: category,
      value: Number(amount.toFixed(2)),
      color: CATEGORY_COLORS[category] || CATEGORY_COLORS.Other,
    }))
    .sort((a, b) => b.value - a.value)

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">No active subscriptions with categories yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 space-y-2">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
              <span className="font-medium">${item.value.toFixed(2)}/mo</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
