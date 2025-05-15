"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  {
    name: "01/01",
    dashboard: 240,
    products: 180,
    blog: 120,
    website: 90,
    analysis: 150,
  },
  {
    name: "02/01",
    dashboard: 220,
    products: 190,
    blog: 110,
    website: 85,
    analysis: 140,
  },
  {
    name: "03/01",
    dashboard: 250,
    products: 200,
    blog: 130,
    website: 95,
    analysis: 160,
  },
  {
    name: "04/01",
    dashboard: 280,
    products: 210,
    blog: 140,
    website: 100,
    analysis: 170,
  },
  {
    name: "05/01",
    dashboard: 260,
    products: 195,
    blog: 125,
    website: 90,
    analysis: 155,
  },
  {
    name: "06/01",
    dashboard: 270,
    products: 205,
    blog: 135,
    website: 95,
    analysis: 165,
  },
  {
    name: "07/01",
    dashboard: 290,
    products: 215,
    blog: 145,
    website: 105,
    analysis: 175,
  },
  {
    name: "08/01",
    dashboard: 300,
    products: 220,
    blog: 150,
    website: 110,
    analysis: 180,
  },
  {
    name: "09/01",
    dashboard: 310,
    products: 225,
    blog: 155,
    website: 115,
    analysis: 185,
  },
  {
    name: "10/01",
    dashboard: 320,
    products: 230,
    blog: 160,
    website: 120,
    analysis: 190,
  },
  {
    name: "11/01",
    dashboard: 330,
    products: 235,
    blog: 165,
    website: 125,
    analysis: 195,
  },
  {
    name: "12/01",
    dashboard: 340,
    products: 240,
    blog: 170,
    website: 130,
    analysis: 200,
  },
  {
    name: "13/01",
    dashboard: 350,
    products: 245,
    blog: 175,
    website: 135,
    analysis: 205,
  },
  {
    name: "14/01",
    dashboard: 360,
    products: 250,
    blog: 180,
    website: 140,
    analysis: 210,
  },
]

export function AreaChart() {
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
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="dashboard" stroke="#0088FE" activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="products" stroke="#00C49F" />
        <Line type="monotone" dataKey="blog" stroke="#FFBB28" />
        <Line type="monotone" dataKey="website" stroke="#FF8042" />
        <Line type="monotone" dataKey="analysis" stroke="#A28DFF" />
      </LineChart>
    </ResponsiveContainer>
  )
}

