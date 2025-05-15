"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"

const data = [
  { name: "Hà Nội", value: 40 },
  { name: "TP.HCM", value: 30 },
  { name: "Đà Nẵng", value: 15 },
  { name: "Cần Thơ", value: 8 },
  { name: "Khác", value: 7 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function SiteAnalytics() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={90}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => [`${value}%`, "Tỉ lệ"]} labelFormatter={(label) => `${label}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

