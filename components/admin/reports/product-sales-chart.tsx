"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  {
    name: "WoodMaster 500",
    sales: 35,
  },
  {
    name: "MetalPro 700",
    sales: 28,
  },
  {
    name: "LaserTech 500",
    sales: 18,
  },
  {
    name: "WoodMaster 900",
    sales: 12,
  },
  {
    name: "MetalPro 1000",
    sales: 7,
  },
]

export function ProductSalesChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{
          top: 20,
          right: 30,
          left: 100,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" />
        <Tooltip formatter={(value) => [`${value} đơn hàng`, "Số lượng"]} />
        <Bar dataKey="sales" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

