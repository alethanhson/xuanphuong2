"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  {
    name: "T1",
    revenue: 4000,
    profit: 2400,
  },
  {
    name: "T2",
    revenue: 3000,
    profit: 1398,
  },
  {
    name: "T3",
    revenue: 2000,
    profit: 9800,
  },
  {
    name: "T4",
    revenue: 2780,
    profit: 3908,
  },
  {
    name: "T5",
    revenue: 1890,
    profit: 4800,
  },
  {
    name: "T6",
    revenue: 2390,
    profit: 3800,
  },
  {
    name: "T7",
    revenue: 3490,
    profit: 4300,
  },
  {
    name: "T8",
    revenue: 3490,
    profit: 4300,
  },
  {
    name: "T9",
    revenue: 3490,
    profit: 4300,
  },
  {
    name: "T10",
    revenue: 4000,
    profit: 2400,
  },
  {
    name: "T11",
    revenue: 3000,
    profit: 1398,
  },
  {
    name: "T12",
    revenue: 2000,
    profit: 9800,
  },
]

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value.toLocaleString()} đ`, ""]} />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} name="Doanh thu" />
        <Line type="monotone" dataKey="profit" stroke="#82ca9d" name="Lợi nhuận" />
      </LineChart>
    </ResponsiveContainer>
  )
}

