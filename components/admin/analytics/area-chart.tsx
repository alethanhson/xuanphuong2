"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  {
    name: "01/01",
    visitors: 4000,
    pageviews: 2400,
  },
  {
    name: "02/01",
    visitors: 3000,
    pageviews: 1398,
  },
  {
    name: "03/01",
    visitors: 2000,
    pageviews: 9800,
  },
  {
    name: "04/01",
    visitors: 2780,
    pageviews: 3908,
  },
  {
    name: "05/01",
    visitors: 1890,
    pageviews: 4800,
  },
  {
    name: "06/01",
    visitors: 2390,
    pageviews: 3800,
  },
  {
    name: "07/01",
    visitors: 3490,
    pageviews: 4300,
  },
  {
    name: "08/01",
    visitors: 3490,
    pageviews: 4300,
  },
  {
    name: "09/01",
    visitors: 3490,
    pageviews: 4300,
  },
  {
    name: "10/01",
    visitors: 4000,
    pageviews: 2400,
  },
  {
    name: "11/01",
    visitors: 3000,
    pageviews: 1398,
  },
  {
    name: "12/01",
    visitors: 2000,
    pageviews: 9800,
  },
  {
    name: "13/01",
    visitors: 2780,
    pageviews: 3908,
  },
  {
    name: "14/01",
    visitors: 1890,
    pageviews: 4800,
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
        <Line type="monotone" dataKey="pageviews" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="visitors" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  )
}

